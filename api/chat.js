export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { message } = req.body;

        // URL de l'API Groq
        const apiUrl = 'https://api.groq.ai/v1/predict'; // URL de l'API Groq
        const API_TOKEN = process.env.GROQ_API_KEY; // Clé API Groq

        // Vérifiez si la clé API est définie
        if (!API_TOKEN) {
            console.error('Clé API manquante');
            return res.status(500).json({ error: 'Clé API manquante. Vérifiez vos variables d\'environnement.' });
        }

        const headers = {
            'Authorization': `Bearer ${API_TOKEN}`, // Utilise la clé API stockée dans les variables d'environnement
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
                        framework: 'transformers' // Spécifie le framework à utiliser
                    }
                })
            });

            // Vérification de la réponse
            if (!response.ok) {
                console.error('Erreur API Groq:', response.statusText);
                return res.status(response.status).json({ error: response.statusText });
            }

            // Analyse des données de réponse
            const data = await response.json();

            // Vérifiez si la réponse est bien formée
            if (!data || !data[0]?.generated_text) {
                console.error('Réponse API invalide', data);
                return res.status(500).json({ error: 'Réponse invalide de l\'API Groq' });
            }

            // Journal des données pour déboguer
            console.log('Réponse API:', data);

            // Retourne la réponse générée
            res.status(200).json({ response: data[0].generated_text });
        } catch (error) {
            // Gestion des erreurs internes
            console.error('Erreur interne:', error.message);
            res.status(500).json({ error: 'Erreur interne du serveur', details: error.message });
        }
    } else {
        // Gestion des méthodes non autorisées
        res.status(405).json({ error: 'Méthode non autorisée. Utilisez une requête POST.' });
    }
}
