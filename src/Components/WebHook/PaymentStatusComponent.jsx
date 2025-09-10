import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import toast from 'react-hot-toast';

const PaymentStatusComponent = ({ userId, reservationId, onPaymentComplete }) => {
    const [status, setStatus] = useState("En attente de paiement...");

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        console.log(token) 
        if (!token) {
            console.error("JWT token non trouvé. La connexion au hub ne peut pas être établie.");
            return;
        }

        // le nom de domaine doit correspondre à celui configuré dans le backend, le fichier api.js
        const connection = new HubConnectionBuilder()
            .withUrl(`https://test.kombicar.app/reservations-paymentHub?access_token=${token}`)
            .withAutomaticReconnect()
            .build();

        const startConnection = async () => {
            try {
                await connection.start();
                console.log('Connecté au Hub de paiement.');

                connection.on('ReceivePaymentStatus', (data) => {
                    // Sécurité : Vérifier que la notification est pour l'utilisateur et la réservation actuels
                    if (data.reservationId === reservationId) {
                        if (data.status === 'completed') {
                            setStatus(`Paiement de la réservation ${data.reservationId} réussi !`);
                            toast.success(`Paiement réussi pour la réservation ${data.reservationId}.`);
                            console.log(`Paiement réussi pour la réservation ${data.reservationId}.`);

                            // Notifier le parent du succès du paiement
                            onPaymentComplete(true);
                        } else {
                            setStatus(`Échec du paiement pour la réservation ${data.reservationId}.`);
                            toast.error(`Échec du paiement pour la réservation ${data.reservationId}.`);
                            console.log(`Échec du paiement pour la réservation ${data.reservationId}.`);
                            // Notifier le parent de l'échec du paiement
                            onPaymentComplete(false);
                        }
                    }
                });
            } catch (err) {
                console.error("Erreur de connexion à SignalR:", err);
            }
        };

        startConnection();

        return () => {
            if (connection.state !== HubConnectionState.Disconnected) {
                connection.stop();
            }
        };
    }, [userId, reservationId, onPaymentComplete]);

    return (
        <div>
            <h2>Statut de la transaction</h2>
            <p>{status}</p>
        </div>
    );
};

export default PaymentStatusComponent;