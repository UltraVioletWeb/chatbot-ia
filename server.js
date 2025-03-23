const axios = require('axios');

const API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-Small-3.1-24B-Instruct-2503'; // Remplace par le modèle de Mistral
const API_TOKEN = process.env.HUGGING_FACE_API_KEY; // Ta clé API Hugging Face

async function query(data) {
  try {
    const response = await axios.post(API_URL, data, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error querying the model:', error);
  }
}

const input = "Quel est le meilleur moyen d'apprendre à programmer ?";  // Exemple de texte

query({ inputs: input })
  .then((response) => {
    console.log(response);  // Affiche la réponse du modèle
  })
  .catch((error) => {
    console.error(error);
  });
