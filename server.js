const axios = require('axios');

const API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-Small-3.1-24B-Instruct-2503'; // URL du modèle Mistral
const API_TOKEN = process.env.HUGGING_FACE_API_KEY; // Clé API Hugging Face

if (!API_TOKEN) {
  console.error('Clé API manquante. Vérifiez vos variables d\'environnement.');
  process.exit(1); // Arrête le processus si la clé API est manquante
}

async function query(data) {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    // Vérifie si la réponse est valide
    if (!response.data || !response.data.generated_text) {
      console.error('Réponse invalide de l\'API :', response.data);
      return null;
    }

    return response.data;
  } catch (error) {
    // Gestion détaillée des erreurs
    console.error('Erreur lors de la requête au modèle :', error.response?.data || error.message);
    throw new Error('Erreur lors de la requête au modèle');
  }
}

const input = "Quel est le meilleur moyen d'apprendre à programmer ?"; // Exemple de texte

query({ inputs: input })
  .then((response) => {
    if (response) {
      console.log('Réponse générée :', response);
    } else {
      console.error('Aucune réponse générée.');
    }
  })
  .catch((error) => {
    console.error('Une erreur s\'est produite :', error.message);
  });
