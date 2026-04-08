const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY });

const genai = async(req, res) => {
    try {
        const {prompt} = req.body;
        // res.setHeader('Content-Type', 'text');
        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });
        console.log("Response genai: ", result.text);
        res.status(200).send(result.text);
    } catch (error) {
        res.status(400).send('Having an issue while generating :(')
    }
}

module.exports =  genai;