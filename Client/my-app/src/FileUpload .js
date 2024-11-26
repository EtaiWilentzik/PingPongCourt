import React, { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [opponentId, setOpponentId] = useState("");
  const [isCurrentInLeft, setisCurrentInLeft] = useState("");
  const [starter, setStarter] = useState("");

  // Add your token here
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IkV0YWkiLCJ1c2VySWQiOiI2NzNkZjM2M2RmNmJkMjI5MTU4MDYzMmMiLCJpYXQiOjE3MzIxMTMyOTJ9.kFcLUpKElfgc-tYtqecofdL1sosaMD3zvkNeB5TJoog";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "video/mp4") {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid MP4 file.");
    }
  };

  const handleUpload = async () => {
    if (!file || !opponentId || !isCurrentInLeft || !starter) {
      alert("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("opponentId", opponentId);
    formData.append("isCurrentInLeft", isCurrentInLeft);
    formData.append("starter", starter);

    try {
      const response = await fetch("http://localhost:3000/games/startGame", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Network or server error.");
    }
  };

  return (
    <div>
      <h1>Upload MP4 File</h1>
      <input type="file" accept="video/mp4" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Set Opponent"
        value={opponentId}
        onChange={(e) => setOpponentId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Am I on the left side?"
        value={isCurrentInLeft}
        onChange={(e) => setisCurrentInLeft(e.target.value)}
      />
      <input type="text" placeholder="Am I starting?" value={starter} onChange={(e) => setStarter(e.target.value)} />
      <button onClick={handleUpload} disabled={!file}>
        Upload
      </button>
    </div>
  );
};

export default FileUpload;
