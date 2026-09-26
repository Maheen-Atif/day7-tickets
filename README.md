# Student Support Ticket Prioritizer

A tool for university staff to browse and filter open student support tickets and get an AI-generated priority suggestion (High/Medium/Low) with a one-line reason for any ticket.

## Features

* Browse and filter open tickets by category
* View ticket details
* Generate an AI priority suggestion and reason for any ticket on demand
* Evaluate each ticket independently without comparing it to other tickets

## Setup

1. Start the backend:

   ```bash
   cd backend
   npm install
   node index.js
   ```

   Runs on port `5000`.

2. Start the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Runs on port `5173`.

3. Add your Gemini API key to `backend/.env`:

   ```env
   GEMINI_API_KEY=your_key_here
   ```

## Tech Stack

* React (Vite)
* Tailwind CSS
* Express.js
* Google Gemini API

## AI Usage

Gemini evaluates each ticket independently using only its subject, description, and category. It returns a structured JSON response containing a priority level (High/Medium/Low) and a one-line reason based on the ticket's own content.

The AI does not compare tickets or use information from other tickets.

## Why AI Classification Instead of Keyword Rules?

Simple keyword matching, such as flagging words like "urgent" or "exam", can miss context-dependent urgency. A ticket may be time-sensitive without containing obvious keywords.

AI is used specifically to interpret the context of an individual ticket, while ticket listing and filtering remain deterministic operations handled by the application.

## Limitations

AI-generated priorities are suggestions and may not always be accurate. Staff should use them as a starting point and make the final decision based on the actual ticket and university policies.
