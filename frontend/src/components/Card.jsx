import { useState } from "react";

function Card({ ticket }) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const url = "http://localhost:5000/api/priority";
  async function handleGenearte() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticket }),
      });

      if (!response.ok) {
        throw new Error("Server responded with an error");
      }
      const ans = await response.json();
      setText(ans);
    } catch (err) {
      console.log(err);
      setText(null);
      setError("Failed to generate priority. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg mt-4">
      <h1 className="text-xl font-bold text-gray-900">{ticket.subject}</h1>

      <h2 className="mt-1 text-sm text-gray-500">{ticket.status}</h2>
      <div className="mt-5 grid grid-cols-3 gap-3 border-y border-gray-100 py-4">
        <div>
          <p className="text-xs text-gray-400">Description</p>
          <p className="mt-1 font-semibold text-gray-800">
            {ticket.description}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Category</p>
          <p className="mt-1 font-semibold text-gray-800">{ticket.category}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Submitted Date</p>
          <p className="mt-1 font-semibold text-gray-800">
            {ticket.submittedDate}
          </p>
        </div>
      </div>
      <button
        onClick={handleGenearte}
        disabled={loading}
        className="mt-5 w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Generating..." : "Generate Priority"}
      </button>
      {error && <p className="mt-5 text-sm text-red-600">{error}</p>}

      {text && (
        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <h4 className="text-sm font-bold text-blue-800">
            AI Ticket Priority
          </h4>
          

          <p className="mt-2 text-sm leading-6 text-gray-700">
            Priority: {text.priority}
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-700">
            Reason: {text.reason}
          </p>
        </div>
      )}
    </div>
  );
}
export default Card;
