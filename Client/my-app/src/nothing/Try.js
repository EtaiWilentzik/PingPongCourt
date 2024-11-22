import React from 'react';
import './Try.css'; // Ensure to create this CSS file

const Try = () => {
  return (
    <div className="container">
      <div className="content">
        <h2>Content Here</h2>
        <p>This is some content next to the image.</p>
      </div>
      <div className="image-container">
        <img
          src="pingpong.jpg" // Replace with your image URL
          alt="Description"
          className="responsive-image"
        />
      </div>
    </div>
  );
};

export default Try;
