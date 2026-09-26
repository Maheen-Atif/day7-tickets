import { useState } from "react";
import Card from "./Card";

function CardList({ ticketArray }) {
  const [category, setCategory] = useState("All");
  let array;
  function handleChange(e) {
    setCategory(e.target.value);
  }
  if (category === "All") {
    array = ticketArray;
  } else {
    array = ticketArray.filter(
      (ticket) => ticket.category.toLowerCase() === category.toLowerCase(),
    );
  }
  return (
    <div className="m-6">
      <select value={category} onChange={handleChange}>
        <option value="All">All</option>
        <option value="IT">IT</option>
        <option value="Finance">Finance</option>
        <option value="Academic">Academic</option>
        <option value="General">General</option>
        <option value="Records">Records</option>
        <option value="Housing">Housing</option>
        <option value="Administration">Administration</option>
      </select>
      {array.map((ticket) => (
        <Card key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
export default CardList;