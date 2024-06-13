import mongoose from "mongoose";
import bcrypt from "bcryptjs";

mongoose
  .connect(
    "mongodb+srv://KobiManuel:doorknob91@cluster0.iabidqb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("mongodb connected");
  })
  .catch(() => {
    console.log("failed to connect");
  });

const LoginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const InterviewSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: true,
  },
  interviewQuestions: {
    type: [String],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  candidates: [
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      score: { type: Number, required: false },
      authToken: { type: String, required: false },
    },
  ],
});

LoginSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Create a compound index to enforce unique organization name per user
InterviewSchema.index({ userId: 1, organizationName: 1 }, { unique: true });

const User = mongoose.model("User", LoginSchema);
const Interview = mongoose.model("Interview", InterviewSchema);

export { User, Interview };
