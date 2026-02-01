const axios = require('axios');

// ⚠️ APNI API KEY YAHAN DALEIN
const API_KEY = "AIzaSyCzuIEAX1_CG_6h9h7tRfFhUQujrLYHt_k";

async function checkModels() {
    try {
        console.log("🔍 Google se models ki list mangwa raha hu...");
        
        // Hum Google se puch rahe hain ki kaunse models available hain
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
        
        const response = await axios.get(url);
        
        console.log("\n✅ AVAILABLE MODELS (Jo aap use kar sakte hain):");
        const models = response.data.models;
        
        models.forEach(m => {
            // Sirf wahi models dikhao jo content generate kar sakte hain
            if(m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                console.log(`👉 ${m.name.replace('models/', '')}`);
            }
        });

    } catch (error) {
        console.log("\n❌ Yahan bhi Error aaya:");
        console.log(error.response ? error.response.data : error.message);
    }
}

checkModels();