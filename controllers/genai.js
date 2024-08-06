const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const genai = async(req, res) => {
    try {
        const {prompt} = req.body;
        const result = await model.generateContent(prompt);
        res.status(200).send(result.response.text());
    } catch (error) {
        res.status(400).send('Having an issue while generating :(')
    }
}

module.exports =  genai;