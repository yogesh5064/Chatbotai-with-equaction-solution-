const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Added for better form-data parsing

// API Key Validation
if (!process.env.GEMINI_API_KEY) {
    console.error("❌ ERROR: GEMINI_API_KEY is missing in .env file");
    process.exit(1); 
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const upload = multer({ storage: multer.memoryStorage() });

// --- Routes ---

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent(message);
        const response = await result.response;
        
        res.json({ success: true, reply: response.text() });
    } catch (error) {
        console.error("❌ Chat Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/solve-math', upload.single('image'), async (req, res) => {
    console.log("📥 Math Request Received"); // Debugging Log
    try {
        const { text } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = text || "Solve this math problem clearly with steps.";
        const parts = [prompt];

        if (req.file) {
            console.log("📸 Image attached:", req.file.originalname);
            parts.push({
                inlineData: {
                    data: req.file.buffer.toString("base64"),
                    mimeType: req.file.mimetype
                }
            });
        }

        const result = await model.generateContent(parts);
        const response = await result.response;
        
        res.json({ solution: response.text() });
    } catch (error) {
        console.error("❌ Math Error:", error.message);
        res.status(500).json({ error: "Server encountered an error processing the image." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Professional Server running on: http://localhost:${PORT}`);
});