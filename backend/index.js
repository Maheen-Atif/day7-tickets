const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const tickets = [
  {
    id: 1,
    subject: "Cannot access student portal",
    description: "My login isn't working and I have an exam in 10 minutes. I need to access the portal urgently.",
    category: "IT",
    status: "Open",
    submittedDate: "2026-09-22"
  },
  {
    id: 2,
    subject: "Fee voucher issue",
    description: "My fee voucher shows the wrong amount and I would like to know how to get it corrected.",
    category: "Finance",
    status: "Open",
    submittedDate: "2026-09-21"
  },
  {
    id: 3,
    subject: "Unable to register for course",
    description: "I am trying to register for CS101 but the registration system is not allowing me to add the course.",
    category: "Academic",
    status: "Open",
    submittedDate: "2026-09-21"
  },
  {
    id: 4,
    subject: "Password reset",
    description: "I forgot my student portal password and need instructions for resetting it.",
    category: "IT",
    status: "Open",
    submittedDate: "2026-09-20"
  },
  {
    id: 5,
    subject: "Library timings",
    description: "Could you please tell me the opening and closing timings of the university library?",
    category: "General",
    status: "Open",
    submittedDate: "2026-09-20"
  },
  {
    id: 6,
    subject: "Exam portal access",
    description: "I cannot access the examination portal and my final exam is scheduled for today.",
    category: "Academic",
    status: "Open",
    submittedDate: "2026-09-19"
  },
  {
    id: 7,
    subject: "Transcript request",
    description: "I need my official transcript as soon as possible because I have to submit it for an application.",
    category: "Records",
    status: "Open",
    submittedDate: "2026-09-19"
  },
  {
    id: 8,
    subject: "Software installation",
    description: "I need help installing the software required for my programming course.",
    category: "IT",
    status: "Open",
    submittedDate: "2026-09-18"
  },
  {
    id: 9,
    subject: "Housing information",
    description: "I would like some information about the university's on-campus housing options.",
    category: "Housing",
    status: "Open",
    submittedDate: "2026-09-17"
  },
  {
    id: 10,
    subject: "Syllabus request",
    description: "Can you please tell me where I can find the syllabus for my course?",
    category: "Academic",
    status: "Open",
    submittedDate: "2026-09-16"
  },
  {
    id: 11,
    subject: "Incorrect attendance record",
    description: "My attendance for last week's class has been marked incorrectly. I attended the class but the system shows me absent.",
    category: "Academic",
    status: "Open",
    submittedDate: "2026-09-15"
  },
  {
    id: 12,
    subject: "Student ID card replacement",
    description: "I lost my student ID card and need information about getting a replacement.",
    category: "Administration",
    status: "Closed",
    submittedDate: "2026-09-14"
  }
];

function cleanedJSONResponse(data) {
  return data
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

app.get("/api/tickets", (req, res) => {
  const { category } = req.query;

  if (category) {
    const filtered = tickets.filter(
      ticket => ticket.category === category
    );

    return res.json(filtered);
  }

  return res.json(tickets);
});

app.post("/api/priority", async (req, res) => {
  const { ticket } = req.body;

  try {
    const prompt = `
Evaluate this ticket independently based only on its subject, description, and category.

Classify its priority as High, Medium, or Low.

Do not compare it to other tickets.
Do not invent information.

Ticket:
${JSON.stringify(ticket)}

Respond ONLY with valid JSON in this exact format:
{"priority": "High", "reason": "one sentence here"}
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash"
    });

    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    const cleanedAnswer = cleanedJSONResponse(answer);

    let parsed;

    // First attempt
    try {
      parsed = JSON.parse(cleanedAnswer);
    } catch (error) {
      console.error("First JSON parsing attempt failed.");

      // Retry
      const retryPrompt = `
Your previous response could not be parsed as JSON.

Respond with ONLY the raw JSON object.
Do NOT use markdown.
Do NOT use code fences.
Do NOT include explanations.
Do NOT include any text before or after the JSON.

Use exactly this format:
{"priority": "High", "reason": "one sentence"}

Ticket:
${JSON.stringify(ticket)}
`;

      const retryResult = await model.generateContent(retryPrompt);
      const retryAnswer = retryResult.response.text();

      const cleanedRetryAnswer = cleanedJSONResponse(retryAnswer);

      parsed = JSON.parse(cleanedRetryAnswer);
    }

    // Send successful result
    res.json(parsed);

  } catch (error) {
    console.error("AI service error:", error);

    res.status(500).json({
      error: "AI service failed to provide valid JSON. Try again."
    });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});