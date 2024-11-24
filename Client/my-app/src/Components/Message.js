import React from "react";
import "./Message.css";

const Message = ({ headline, content, onClick, btnText, showButton }) => {
  return (
    <div className="no-data-container">
      <div className="no-data-message">
        <h2>{headline}</h2>
        <p>{content}</p>
        {showButton && (
          <button className="retry-button" onClick={onClick}>
            {btnText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;
