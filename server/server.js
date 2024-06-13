import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "I am HireVue. The best ever A.I Interviewer",
  });
});

const interviewQuestions = [
  "Hello! Are you ready to start your interview?",
  "Can you tell me a bit about yourself and your background?",
  "Why are you interested in this position?",
  "Describe a time you faced a challenge and how you overcame it.",
];

let newInterviewQuestions = [];

app.post("/interview-questions", async (req, res) => {
  try {
    newInterviewQuestions = req.body.questions;
    console.log("this is", req.body.questions);
    res.status(200).send({ message: "Questions updated successfully" });
    console.log("questions", interviewQuestions);
  } catch (error) {
    console.error("Failed to update questions:", error);
    res.status(500).send({ error });
  }
});

const conversationHistory = [
  {
    role: "system",
    content: `You are conducting an interview. You will ask a total of ${interviewQuestions.length} questions and nothing more, DO NOT REPEAT QUESTIONS. The questions are: ${interviewQuestions}. Once all questions on the list have been asked, you should respond with: "Thank you, this interview is now concluded." from that moment on`,
  },
  { role: "assistant", content: "follow the instructions" },
];

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    conversationHistory.push({ role: "user", content: prompt });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversationHistory, // Pass the entire history
      temperature: 0,
      max_tokens: 400,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    // Append assistant message to conversation history
    conversationHistory.push({
      role: "assistant",
      content: response.choices[0].message.content,
    });

    res.status(200).send({
      bot: response.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.listen(5000, () =>
  console.log("server is running on port http://localhost:5000")
);
