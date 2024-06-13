import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";
import { User, Interview } from "./mongodb.js";
import authMiddleware from "./middleware/auth.js";
import verifyToken from "./middleware/verifyToken.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const secretKey = process.env.JWT_SECRET;

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, secretKey, { expiresIn: "1h" });
};

app.get("/signup", async (req, res) => {
  res.status(200).send({ message: "Sign up successful" });
});

app.get("/login", async (req, res) => {
  res.render("login ");
});

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email and password are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ message: "Invalid email format" });
    }

    // Validate password strength (minimum 6 characters, at least one letter and one number)
    if (
      password.length < 6 ||
      !/\d/.test(password) ||
      !/[a-zA-Z]/.test(password)
    ) {
      return res.status(400).send({
        message:
          "Password must be at least 6 characters long and include at least one letter and one number",
      });
    }

    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ message: "Email is already in use" });
    }

    // Insert new user
    const user = new User({ email, password });
    await user.save();

    const token = generateToken(user);

    res.status(200).send({ token, message: "Sign up successful" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).send({ message: "An error occurred while signing up" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure the email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    // Handle case where user is not found
    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password); // Compare hashed passwords

    // Validate password
    if (isMatch) {
      const token = generateToken(user);
      // If everything is fine, send success response
      res.status(200).send({ token, message: "Login successful" });
    } else {
      return res.status(401).send({ message: "Incorrect password" });
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Login error:", error);

    // Send a generic error message
    res
      .status(500)
      .send({ message: "An error occurred while trying to log in" });
  }
});

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "I am HireVue. The best ever A.I Interviewer",
  });
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

app.post("/save-interview-data", async (req, res) => {
  try {
    const { organizationName, name, email, score } = req.body;

    if (!organizationName || !name || !email) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const interview = await Interview.findOne({ organizationName });

    if (!interview) {
      return res.status(404).send({ message: "Organization not found" });
    }

    const existingCandidate = interview.candidates.find(
      (candidate) => candidate.email === email
    );

    if (existingCandidate) {
      return res
        .status(409)
        .send({ message: "Candidate with this email already exists" });
    }

    const candidate = {
      name,
      email,
      score,
      authToken: jwt.sign({ email, organizationName }, secretKey),
    };
    interview.candidates.push(candidate);
    await interview.save();

    res.status(200).send({
      message: "Interview data saved successfully",
      authToken: candidate.authToken,
    });
  } catch (error) {
    console.error("Error saving interview data:", error);
    res
      .status(500)
      .send({ message: "An error occurred while saving interview data" });
  }
});

app.patch("/update-score", verifyToken, async (req, res) => {
  try {
    const { organizationName, email, score } = req.body;

    if (!organizationName || !email || score == null) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const interview = await Interview.findOne({ organizationName });

    if (!interview) {
      return res.status(404).send({ message: "Organization not found" });
    }

    const candidate = interview.candidates.find(
      (candidate) => candidate.email === email
    );

    if (!candidate) {
      return res.status(404).send({ message: "Candidate not found" });
    }

    candidate.score = score;
    candidate.authToken = null; // Invalidate the token
    await interview.save();

    // Determine pass/fail based on the score
    const passCutoff = 60; // Example cutoff score for passing
    const passOrFail = score >= passCutoff ? "passed" : "failed";

    // Send email notification to the candidate
    const subject = "Interview Update";
    const text = `Hello ${candidate.name},\n\nYour interview score is ${score}. You have ${passOrFail} the interview cut-off.\n\nBest regards,\nThe Interview Team`;
    sendEmail(email, subject, text);

    res
      .status(200)
      .send({ message: "Score updated successfully and email sent" });
  } catch (error) {
    console.error("Error updating score and sending mail:", error);
    res.status(500).send({ message: "Error updating score and sending mail" });
  }
});

app.get("/candidates/:organizationName", authMiddleware, async (req, res) => {
  try {
    const { organizationName } = req.params;
    const userId = req.userId;

    const interview = await Interview.findOne({ organizationName, userId });

    if (!interview) {
      return res.status(404).send({ message: "Organization not found" });
    }

    res.status(200).send({ candidates: interview.candidates });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res
      .status(500)
      .send({ message: "An error occurred while fetching candidates" });
  }
});

app.post(
  "/interview-questions/:organizationName",
  authMiddleware,
  async (req, res) => {
    try {
      const { organizationName, interviewQuestions } = req.body;

      const userId = req.userId;

      if (!organizationName || !interviewQuestions) {
        return res.status(400).send({
          message: "Organization name and interview questions are required",
        });
      }

      // Check if interview questions already exist for the organization
      const existingInterview = await Interview.findOne({
        organizationName,
        userId,
      });

      if (existingInterview) {
        return res.status(409).send({
          message: "Organization name already exists for this user",
        });
      } else {
        // Create a new entry for interview questions
        const newInterview = new Interview({
          organizationName,
          interviewQuestions,
          userId,
        });
        await newInterview.save();
        return res
          .status(200)
          .send({ message: "Interview questions saved successfully" });
      }
    } catch (error) {
      console.error("Error saving interview questions:", error);
      res.status(500).send({
        message: "An error occurred while saving interview questions",
      });
    }
  }
);

app.patch(
  "/interview-questions/:organizationName",
  authMiddleware,
  async (req, res) => {
    try {
      const { organizationName } = req.params;
      const { interviewQuestions, newOrganizationName } = req.body;
      const userId = req.userId;

      if (!interviewQuestions) {
        return res.status(400).send({
          message: "Interview questions are required",
        });
      }

      // Check if the interview entry exists
      const existingInterview = await Interview.findOne({
        organizationName,
        userId,
      });

      if (!existingInterview) {
        return res.status(404).send({
          message: "Organization name not found for this user",
        });
      }

      // Update the existing interview questions
      existingInterview.interviewQuestions = interviewQuestions;
      existingInterview.organizationName = newOrganizationName;
      await existingInterview.save();
      return res
        .status(200)
        .send({ message: "Interview questions updated successfully" });
    } catch (error) {
      console.error("Error updating interview questions:", error);
      res.status(500).send({
        message: "An error occurred while updating interview questions",
      });
    }
  }
);

app.get(
  "/interview-questions/:organizationName",
  authMiddleware,
  async (req, res) => {
    try {
      const { organizationName } = req.params;
      const userId = req.userId;

      const interview = await Interview.findOne({ organizationName, userId });

      if (!interview) {
        return res.status(404).send({
          message:
            "Interview questions not found for the specified organization",
        });
      }

      res.status(200).send({
        organizationName: interview.organizationName,
        interviewQuestions: interview.interviewQuestions,
      });
    } catch (error) {
      console.error("Error fetching interview questions:", error);
      res.status(500).send({
        message: "An error occurred while fetching interview questions",
      });
    }
  }
);

app.get("/validateLink/:organizationName", async (req, res) => {
  try {
    const { organizationName } = req.params;

    const interview = await Interview.findOne({ organizationName });

    if (!interview) {
      return res.status(404).send({
        message: "Interview questions not found for the specified organization",
      });
    }

    res.status(200).send({
      message: "request successful",
    });
  } catch (error) {
    console.error("Error validating link:", error);
    res.status(500).send({
      message: "An error occurred while validating link",
    });
  }
});

// const conversationHistory = [
//   {
//     role: "system",
//     content: `You are conducting an interview. You will ask a total of ${interviewQuestions.length} questions and nothing more, DO NOT REPEAT QUESTIONS. The questions are: ${interviewQuestions}. Once all questions on the list have been asked, you should respond with: "Thank you, this interview is now concluded." from that moment on`,
//   },
//   { role: "assistant", content: "follow the instructions" },
// ];

const interviewSessions = {};

app.post("/", verifyToken, async (req, res) => {
  try {
    const { prompt, organizationName, sessionId } = req.body;

    // Fetch interview questions from the database (unchanged)
    const interview = await Interview.findOne({ organizationName });

    if (!interview) {
      return res.status(404).send({
        message: "Interview questions not found for the specified organization",
      });
    }

    const interviewQuestions = interview.interviewQuestions;

    // const interviewQuestions = [
    //   ...initialInterviewQuestions,
    //   "Thank you, this interview is now concluded. You have scored {something} percent",
    // ];

    // Build conversation history with Gemini format
    const conversationHistory = [
      { role: "user", parts: [{ text: prompt }] }, // User's initial prompt
      {
        role: "model",
        parts: [
          {
            text: `You are conducting an interview with a total of ${
              interviewQuestions.length
            } questions. The last question includes a score placeholder. DO NOT REPEAT QUESTIONS. TAKE NOTE OF THE CONVERSATION AND DEDUCE A PERCENTAGE SCORE BASED ON THE USER'S RESPONSE TO ALL THE QUESTIONS AND INCLUDE THE SCORE IN THE {SOMETHING} BRACKET OF THE LAST TEXT STRING IN THE QUESTIONS LIST. END THE INTERVIEW BY DISPLAYING THE SCORE PLACEHOLDER.   Questions: ${interviewQuestions.join(
              ", "
            )}`,
          },
        ],
      }, // System message explaining interview details
    ];

    // Choose a suitable Gemini model for chat-like interactions
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Replace with appropriate model if needed

    // Start chat session with Gemini
    const chat = await model.startChat({
      history: conversationHistory,
      generationConfig: {
        maxOutputTokens: 400, // Adjust max output length if needed
      },
    });

    // Send initial assistant message using sendMessage
    const assistantResponse = await chat.sendMessage(prompt); // Use prompt for initial assistant message
    const assistantContent = await assistantResponse.response.text();

    conversationHistory.push({
      role: "assistant",
      content: { parts: [{ text: assistantContent }] },
    });

    res.status(200).send({
      bot: assistantContent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.listen(5000, () =>
  console.log("server is running on port http://localhost:5000")
);
