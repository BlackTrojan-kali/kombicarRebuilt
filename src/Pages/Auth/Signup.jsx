"use client";
import React, { useState } from "react";
import Select from 'react-select';
import Input from "../../Components/form/Input";
import FormButton from "../../Components/form/FormButton";
import { Toaster, toast } from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

export default function Signup() {
  const { register, externalLoginGoogle, loading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    country: null,
    acceptConditions: false,
  });

  // Liste complète des pays avec leurs codes téléphoniques
  const countries = [
    { value: 93, label: "Afghanistan (+93)" },
    { value: 355, label: "Albanie (+355)" },
    { value: 213, label: "Algérie (+213)" },
    { value: 376, label: "Andorre (+376)" },
    { value: 244, label: "Angola (+244)" },
    { value: 54, label: "Argentine (+54)" },
    { value: 374, label: "Arménie (+374)" },
    { value: 61, label: "Australie (+61)" },
    { value: 43, label: "Autriche (+43)" },
    { value: 994, label: "Azerbaïdjan (+994)" },
    { value: 973, label: "Bahreïn (+973)" },
    { value: 880, label: "Bangladesh (+880)" },
    { value: 32, label: "Belgique (+32)" },
    { value: 229, label: "Bénin (+229)" },
    { value: 975, label: "Bhoutan (+975)" },
    { value: 591, label: "Bolivie (+591)" },
    { value: 387, label: "Bosnie-Herzégovine (+387)" },
    { value: 267, label: "Botswana (+267)" },
    { value: 55, label: "Brésil (+55)" },
    { value: 226, label: "Burkina Faso (+226)" },
    { value: 257, label: "Burundi (+257)" },
    { value: 855, label: "Cambodge (+855)" },
    { value: 237, label: "Cameroun (+237)" },
    { value: 1, label: "Canada (+1)" },
    { value: 238, label: "Cap-Vert (+238)" },
    { value: 236, label: "Centrafrique (+236)" },
    { value: 56, label: "Chili (+56)" },
    { value: 86, label: "Chine (+86)" },
    { value: 57, label: "Colombie (+57)" },
    { value: 269, label: "Comores (+269)" },
    { value: 242, label: "Congo (+242)" },
    { value: 243, label: "Congo, Rép. Dém. (+243)" },
    { value: 82, label: "Corée du Sud (+82)" },
    { value: 225, label: "Côte d'Ivoire (+225)" },
    { value: 385, label: "Croatie (+385)" },
    { value: 53, label: "Cuba (+53)" },
    { value: 45, label: "Danemark (+45)" },
    { value: 253, label: "Djibouti (+253)" },
    { value: 20, label: "Égypte (+20)" },
    { value: 503, label: "El Salvador (+503)" },
    { value: 971, label: "Émirats Arabes Unis (+971)" },
    { value: 34, label: "Espagne (+34)" },
    { value: 251, label: "Éthiopie (+251)" },
    { value: 358, label: "Finlande (+358)" },
    { value: 33, label: "France (+33)" },
    { value: 241, label: "Gabon (+241)" },
    { value: 220, label: "Gambie (+220)" },
    { value: 233, label: "Ghana (+233)" },
    { value: 30, label: "Grèce (+30)" },
    { value: 224, label: "Guinée (+224)" },
    { value: 245, label: "Guinée-Bissau (+245)" },
    { value: 240, label: "Guinée Équatoriale (+240)" },
    { value: 509, label: "Haïti (+509)" },
    { value: 36, label: "Hongrie (+36)" },
    { value: 91, label: "Inde (+91)" },
    { value: 62, label: "Indonésie (+62)" },
    { value: 964, label: "Irak (+964)" },
    { value: 353, label: "Irlande (+353)" },
    { value: 39, label: "Italie (+39)" },
    { value: 81, label: "Japon (+81)" },
    { value: 254, label: "Kenya (+254)" },
    { value: 965, label: "Koweït (+965)" },
    { value: 371, label: "Lettonie (+371)" },
    { value: 231, label: "Liberia (+231)" },
    { value: 218, label: "Libye (+218)" },
    { value: 261, label: "Madagascar (+261)" },
    { value: 265, label: "Malawi (+265)" },
    { value: 60, label: "Malaisie (+60)" },
    { value: 223, label: "Mali (+223)" },
    { value: 222, label: "Mauritanie (+222)" },
    { value: 52, label: "Mexique (+52)" },
    { value: 212, label: "Maroc (+212)" },
    { value: 258, label: "Mozambique (+258)" },
    { value: 264, label: "Namibie (+264)" },
    { value: 227, label: "Niger (+227)" },
    { value: 234, label: "Nigéria (+234)" },
    { value: 47, label: "Norvège (+47)" },
    { value: 51, label: "Pérou (+51)" },
    { value: 63, label: "Philippines (+63)" },
    { value: 48, label: "Pologne (+48)" },
    { value: 351, label: "Portugal (+351)" },
    { value: 974, label: "Qatar (+974)" },
    { value: 44, label: "Royaume-Uni (+44)" },
    { value: 250, label: "Rwanda (+250)" },
    { value: 221, label: "Sénégal (+221)" },
    { value: 232, label: "Sierra Leone (+232)" },
    { value: 65, label: "Singapour (+65)" },
    { value: 252, label: "Somalie (+252)" },
    { value: 249, label: "Soudan (+249)" },
    { value: 46, label: "Suède (+46)" },
    { value: 41, label: "Suisse (+41)" },
    { value: 255, label: "Tanzanie (+255)" },
    { value: 66, label: "Thaïlande (+66)" },
    { value: 228, label: "Togo (+228)" },
    { value: 216, label: "Tunisie (+216)" },
    { value: 90, label: "Turquie (+90)" },
    { value: 256, label: "Ouganda (+256)" },
    { value: 380, label: "Ukraine (+380)" },
    { value: 58, label: "Venezuela (+58)" },
    { value: 84, label: "Vietnam (+84)" },
    { value: 967, label: "Yémen (+967)" },
    { value: 260, label: "Zambie (+260)" },
    { value: 263, label: "Zimbabwe (+263)" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCountryChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      country: selectedOption ? selectedOption.value : null,
    }));
  };
  
  const handleGoogleLogin = async () => {
    const googleLoginPromise = externalLoginGoogle();
    
    toast.promise(googleLoginPromise, {
      loading: 'Redirection vers Google...',
      success: 'Redirection réussie !',
      error: (err) => `Erreur: ${err.message || 'Échec de la connexion Google.'}`,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.password || !formData.country) {
      toast.error("Veuillez remplir tous les champs obligatoires.", {
        position: "top-right",
      });
      return;
    }

    if (!formData.acceptConditions) {
        toast.error("Veuillez accepter les conditions d'utilisation.", {
          position: "top-right",
        });
        return;
      }

    // Mise à jour de l'objet pour inclure phoneNumber
    const dataToSend = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber, // Ajout du numéro de téléphone
      country: parseInt(formData.country, 10),
    };

    console.log("Données de l'utilisateur à envoyer :", dataToSend);

    await register(dataToSend);
  };

  return (
    <>
      <Toaster />
      <div>
        <br /><br /><br /><br />
        <div></div>
        <div className="flex justify-center mt-2 extra-linear-gradient-yellow">
          <div className="w-[90vw] md:w-[500px] ">
            <div className="flex items-center justify-center mb-6">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="flex items-center w-full justify-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
              >
                <svg
                  className="h-6 w-6 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="800px"
                  height="800px"
                  viewBox="-0.5 0 48 48"
                  version="1.1"
                >
                  <title>Google-color</title>
                  <desc>Created with Sketch.</desc>
                  <defs> </defs>
                  <g
                    id="Icons"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="Color-"
                      transform="translate(-401.000000, -860.000000)"
                    >
                      <g
                        id="Google"
                        transform="translate(401.000000, 860.000000)"
                      >
                        <path
                          d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                          id="Fill-1"
                          fill="#FBBC05"
                        >
                        </path>
                        <path
                          d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                          id="Fill-2"
                          fill="#EB4335"
                        >
                        </path>
                        <path
                          d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                          id="Fill-3"
                          fill="#34A853"
                        >
                        </path>
                        <path
                          d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                          id="Fill-4"
                          fill="#4285F4"
                        >
                        </path>
                      </g>
                    </g>
                  </g>
                </svg>
                <span>S'inscrire avec Google</span>
              </button>
            </div>
            {/* End of new Google signup button */}

            {/* This is the "Ou" divider */}
            <div className="py-4 text-center font-bold">Ou</div>

            <div className="flex justify-center">
              <picture>
                <img
                  src="/default/logo.png"
                  alt="Logo Kombicar"
                  className="w-[80px] h-[80px]"
                />
              </picture>
            </div>
            <h2 className="text-3xl font-bold text-center">Inscription</h2>
            <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto py-10">
              <div className="grid gap-2">
                <label>Nom(s)</label>
                <Input
                  placeholder="Ex: Ngoumou Takam"
                  type="text"
                  name="lastName"
                  required={true}
                  className="formInput"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                <div className="text-muted-foreground text-sm">
                  Votre nom comme sur votre document d'identité
                </div>
              </div>

              <div className="grid gap-2">
                <label>Prénom(s)</label>
                <Input
                  placeholder="Ex: Jean Bertrand"
                  type="text"
                  name="firstName"
                  required={true}
                  className="formInput"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <div className="text-muted-foreground text-sm">
                  Votre prénom comme sur votre document d'identité
                </div>
              </div>

              <div className="grid gap-2">
                <label>Numéro de téléphone</label>
                <Input
                  placeholder="699888777"
                  type="tel"
                  name="phoneNumber"
                  required={false}
                  className="formInput"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
                <div className="text-muted-foreground text-sm">
                  Le numéro de téléphone sur lequel vous êtes facilement joignable{" "}
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="country">Pays</label>
                <Select
                  id="country"
                  name="country"
                  options={countries}
                  onChange={handleCountryChange}
                  className="formInput w-full"
                  placeholder="Sélectionnez votre pays"
                  isClearable={true}
                />
              </div>

              <div className="grid gap-2">
                <label>Email</label>
                <Input
                  placeholder="example@example.com"
                  required={false}
                  type="email"
                  name="email"
                  className="formInput"
                  value={formData.email}
                  onChange={handleChange}
                />
                <div className="text-muted-foreground text-sm">Optionnel.</div>
              </div>

              <div className="grid gap-2">
                <label>Mot de passe</label>
                <Input
                  placeholder="*******"
                  type="password"
                  name="password"
                  required={true}
                  className="formInput"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="text-muted-foreground text-sm">
                  Votre mot de passe doit contenir au moins 8 caractères.
                </div>
              </div>

              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <input
                  id="Conditions"
                  name="acceptConditions"
                  required={true}
                  type="checkbox"
                  checked={formData.acceptConditions}
                  onChange={handleChange}
                />
                <div className="space-y-1 leading-none">
                  <label htmlFor="Conditions">
                    Accepter les conditions d'utilisations
                  </label>
                  <div className="text-muted-foreground text-sm">
                    Il s'agit du contrat que vous acceptez en utilisant notre
                    application
                  </div>
                </div>
              </div>
              <FormButton
                type="submit"
                className="w-full bg-[#2682F3] hover:bg-[#0B32B5] text-white text-xl p-3 rounded-md"
                disabled={loading}
              >
                {loading ? 'Inscription...' : 'S\'inscrire'}
              </FormButton>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}