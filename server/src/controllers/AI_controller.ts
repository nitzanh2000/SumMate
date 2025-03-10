const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const improveText = async (inputText: string): Promise<any | null> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Improve the following text for sharing it in social platform for students. fix typo mistake, improve grammar and vocabulary. The text to improve: "${inputText}". Return only the better text, only one option and no explanation`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
};

export { improveText };
