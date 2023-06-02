import React from 'react'
import "../index.css"

export function Die({ value, isHeld, disabled, holdDice }) {
  return (
    <div>
      <button onClick={holdDice} className={`die ${isHeld ? "held" : ""}`} disabled={disabled}>
        {value}
      </button>
    </div>
  );
}
