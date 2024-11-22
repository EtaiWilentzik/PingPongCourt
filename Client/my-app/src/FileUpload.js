import React, { useState } from "react";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [playerLeft, setPlayerLeft] = useState("");
    const [playerRight, setPlayerRight] = useState("");
    const [starter, setStarter] = useState("");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "video/mp4") {
            setFile(selectedFile);
        } else {
            alert("Please upload a valid MP4 file.");
        }
    };

    const handleUpload = async () => {
        if (!file || !playerLeft || !playerRight || !starter) {
            alert("All fields are required.");
            return;
        }

        const formData = new FormData();
        formData.append("video", file);
        formData.append("playerLeft", playerLeft);
        formData.append("playerRight", playerRight);
        formData.append("starter", starter);

        try {
            const response = await fetch("http://localhost:3000/games/startGame", {
                method: "POST",
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
            <input type="text" placeholder="Player Left" value={playerLeft} onChange={(e) => setPlayerLeft(e.target.value)} />
            <input
                type="text"
                placeholder="Player Right"
                value={playerRight}
                onChange={(e) => setPlayerRight(e.target.value)}
            />
            <input type="text" placeholder="Starter" value={starter} onChange={(e) => setStarter(e.target.value)} />
            <button onClick={handleUpload} disabled={!file}>
                Upload
            </button>
        </div>
    );
};

export default FileUpload;