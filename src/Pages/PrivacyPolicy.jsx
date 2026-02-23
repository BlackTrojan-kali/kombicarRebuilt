import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShieldAlt, faMapMarkerAlt, faCamera, faUserLock, 
    faCreditCard, faShareNodes, faTrashAlt, faEnvelope 
} from '@fortawesome/free-solid-svg-icons';

const PrivacyPolicy = () => {
    // Date de dernière mise à jour
    const lastUpdated = "23 Février 2026";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                
                {/* En-tête */}
                <div className="bg-blue-600 dark:bg-blue-800 px-8 py-10 text-white text-center">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-5xl mb-4 opacity-90" />
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Politique de Confidentialité</h1>
                    <p className="text-blue-100 text-sm md:text-base">
                        Transparence, sécurité et respect de vos données personnelles sur KombiCar.
                    </p>
                    <p className="text-blue-200 text-xs mt-4">Dernière mise à jour : {lastUpdated}</p>
                </div>

                {/* Contenu principal */}
                <div className="p-8 md:p-12 space-y-10 text-gray-700 dark:text-gray-300">
                    
                    {/* Introduction */}
                    <section>
                        <p className="leading-relaxed">
                            Chez <strong>KombiCar</strong>, votre vie privée n'est pas une option, c'est une priorité absolue. 
                            Pour vous offrir un service de VTC et de covoiturage fiable et sécurisé, nous devons collecter certaines informations. 
                            Cette page vous explique de manière claire et transparente <strong>quelles données nous collectons, pourquoi nous en avons besoin, et comment nous les protégeons</strong>.
                        </p>
                    </section>

                    {/* La Géolocalisation */}
                    <section className="flex gap-4 md:gap-6">
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xl">
                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Géolocalisation (Votre position exacte)</h2>
                            <p className="mb-3">La position GPS est le cœur de notre application. Voici précisément ce que nous en faisons :</p>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li><strong>Pour les passagers :</strong> Nous l'utilisons pour localiser votre point de départ, trouver le chauffeur le plus proche et calculer le prix de la course. La position n'est suivie que lorsque l'application est ouverte ou qu'une course est active.</li>
                                <li><strong>Pour les chauffeurs :</strong> Votre position est suivie en arrière-plan lorsque vous êtes "En ligne". Cela permet de vous attribuer des courses et de fournir un tracé GPS précis au passager et à l'administration pour garantir la sécurité du trajet.</li>
                                <li><strong>Sécurité :</strong> En cas de litige ou de problème de sécurité, le tracé de la course est conservé sur nos serveurs sécurisés pour audit.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Appareil Photo et Fichiers */}
                    <section className="flex gap-4 md:gap-6">
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xl">
                                <FontAwesomeIcon icon={faCamera} />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Appareil Photo et Fichiers</h2>
                            <p className="mb-3">Nous ne déclenchons <strong>jamais</strong> votre appareil photo à votre insu. Nous vous demandons cet accès uniquement pour :</p>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li><strong>Vérification d'identité (KYC) :</strong> Scanner ou photographier votre pièce d'identité et votre permis de conduire (obligatoire pour les chauffeurs) afin de prévenir la fraude.</li>
                                <li><strong>Validation des véhicules :</strong> Prendre en photo l'état du véhicule (extérieur, intérieur, plaque d'immatriculation) pour garantir le confort des passagers.</li>
                                <li><strong>Photo de profil :</strong> Permettre aux passagers et chauffeurs de se reconnaître lors du point de rencontre.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Données Personnelles et Financières */}
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                                <FontAwesomeIcon icon={faUserLock} className="text-purple-500" />
                                Données Personnelles
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                Lors de votre inscription, nous collectons votre nom, prénom, adresse e-mail et numéro de téléphone. Ces informations servent à créer votre compte, à vous envoyer des reçus de course, et permettent au chauffeur/passager de vous contacter via l'application. <strong>Votre véritable numéro de téléphone peut être masqué</strong> lors des appels via la plateforme pour protéger votre vie privée.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                                <FontAwesomeIcon icon={faCreditCard} className="text-amber-500" />
                                Données Financières
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                Si vous utilisez des paiements par carte bancaire ou Mobile Money, vos données sont traitées par nos prestataires de paiement certifiés (ex: Stripe, opérateurs locaux). <strong>KombiCar ne stocke jamais les numéros complets de votre carte bancaire</strong> sur ses serveurs. Nous conservons uniquement l'historique de vos transactions, recharges et retraits.
                            </p>
                        </section>
                    </div>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    {/* Partage des données */}
                    <section className="flex gap-4 md:gap-6">
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center text-xl">
                                <FontAwesomeIcon icon={faShareNodes} />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Avec qui partageons-nous vos données ?</h2>
                            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Vos données ne sont jamais vendues à des tiers à des fins publicitaires. Elles sont partagées uniquement dans ces contextes :</p>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li><strong>Entre utilisateurs :</strong> Le chauffeur voit le prénom, la note et la destination du passager. Le passager voit le prénom, la photo, la plaque d'immatriculation et la position en temps réel du chauffeur.</li>
                                <li><strong>Prestataires de services :</strong> Hébergeurs (serveurs cloud), services de paiement, et services d'envoi de SMS/Emails.</li>
                                <li><strong>Autorités légales :</strong> Sur réquisition judiciaire valide, nous pouvons être tenus de fournir le tracé GPS ou les informations d'un trajet à la police en cas d'incident grave.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Vos droits */}
                    <section className="flex gap-4 md:gap-6">
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center text-xl">
                                <FontAwesomeIcon icon={faTrashAlt} />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Vos droits et suppression (Droit à l'oubli)</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                Vous êtes propriétaire de vos données. À tout moment, depuis les paramètres de l'application, vous pouvez demander la <strong>suppression définitive de votre compte</strong>. 
                                Une fois la demande effectuée, vos données personnelles seront effacées de nos bases de données sous 30 jours, à l'exception des données financières et des historiques de courses que nous sommes légalement obligés de conserver à des fins comptables et fiscales.
                            </p>
                        </div>
                    </section>

                    {/* Contact */}
                    <div className="mt-12 bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 text-center border border-gray-100 dark:border-gray-700">
                        <FontAwesomeIcon icon={faEnvelope} className="text-3xl text-gray-400 dark:text-gray-500 mb-3" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Des questions sur vos données ?</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Notre équipe dédiée à la protection des données est là pour vous répondre.
                        </p>
                        <a href="mailto:privacy@kombicar.com" className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm">
                            Contacter le support vie privée
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;