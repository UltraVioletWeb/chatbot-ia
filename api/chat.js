export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { message } = req.body;

        // URL de l'API Hugging Face pour le modèle sélectionné
        const apiUrl = 'https://api-inference.huggingface.co/models/gpt2'; // Remplacez par un autre modèle si nécessaire
        const headers = {
            'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`, // Assurez-vous que la clé est définie
            'Content-Type': 'application/json'
        };

        try {
            // Envoi de la requête à l'API
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    inputs: message,
                    parameters: {
                        framework: 'transformers' // Spécifie le framework
                    }
                })
            });

            // Vérification de la réponse
            if (!response.ok) {
                console.error('Erreur API Hugging Face:', response.statusText);
                return res.status(response.status).json({ error: response.statusText });
            }

            // Analyse des données de réponse
            const data = await response.json();

            // Journal des données pour déboguer
            console.log('Réponse API:', data);

            // Retourne la réponse générée ou un message par défaut
            res.status(200).json({ response: data[0]?.generated_text || 'Désolé, je n\'ai pas pu comprendre.' });
        } catch (error) {
            // Gestion des erreurs internes
            console.error('Erreur interne:', error.message);
            res.status(500).json({ error: 'Erreur interne du serveur', details: error.message });
        }
    } else {
        // Gestion des méthodes non autorisées
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
