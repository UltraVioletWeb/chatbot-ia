// api/chat.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { message } = req.body;

        // Utilisation de Hugging Face API pour générer la réponse
        const apiUrl = 'https://api-inference.huggingface.co/models/gpt2';
        const headers = {
            'Authorization': `Bearer YOUR_HUGGING_FACE_API_KEY`,
            'Content-Type': 'application/json'
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ inputs: message })
        });

        const data = await response.json();

        // Retourner la réponse générée par l'IA
        res.status(200).json({ response: data[0]?.generated_text || 'Désolé, je n\'ai pas pu comprendre.' });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
