import config from "../config";

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(config.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getAnswer = async (prompt) => {
    const result = await model.generateContent(prompt);
    return result.response.text();
}

export {
    getAnswer
}