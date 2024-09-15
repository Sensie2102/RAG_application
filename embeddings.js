import fetch from 'node-fetch';

const getEmbeddings = async (text, retries = 3, delay = 1000) => {
    const body = JSON.stringify({ inputs: { text: text } });

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch('https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2', {
                method: 'POST',
                headers: { 
                    Authorization: `Bearer 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`,
                    'Content-Type': 'application/json',
                },
                body: body,
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);
                return; // Exit if successful
            } else {
                console.log(`Attempt ${attempt} failed with status ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error(`Attempt ${attempt} encountered an error:`, error);
        }

        // Wait before retrying
        if (attempt < retries) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            console.log(`Retrying... (${attempt + 1}/${retries})`);
        }
    }

    console.error('All attempts failed. Please try again later.');
};

getEmbeddings("This is a sample document for embedding.");