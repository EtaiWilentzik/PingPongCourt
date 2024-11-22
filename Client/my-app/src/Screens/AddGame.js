import React, { useState, useContext } from "react";
import { AuthContext } from "../App/AuthContext.js";
import './AddGame.css'
import "../Components/GamesList.css";
import {useNavigate} from "react-router-dom";

const AddGame = () => {
    const { token } = useContext(AuthContext);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const [users, setUsers] = useState([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
    ]); // Demo data
    const [selectedUser, setSelectedUser] = useState(null);
    const [imOnLeft, setImOnLeft] = useState(true);
    const [imServer, setImServer] = useState(true);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "video/mp4") {
            setFile(selectedFile);
        } else {
            alert("Please upload a valid MP4 file.");
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const handleBackToList = () => {
        setSelectedUser(null);
    };

    const handleSwitchSides = () => {
        setImOnLeft(!imOnLeft);
    };

    const handleSwitchServer = () => {
        setImServer(!imServer);
    };

    const handleSend = async () => {
        if (!selectedUser || !file || !token) {
            alert("Please select a user, upload a file, and ensure you are logged in.");
            return;
        }

        const formData = new FormData();
        formData.append("video", file);
        formData.append("userId", selectedUser.id);
        formData.append("imOnLeft", imOnLeft);
        formData.append("imServer", imServer);

        try {
            const response = await fetch("http://localhost:3000/games/startGame", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                    navigate("/");
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error("Error sending payload:", error);
            alert("Network or server error.");
        }
    };

    return (
        <div className="user-component">
            {!selectedUser ? (
                <div>
                    <h1>Select a User</h1>
                    <table className="games-list-table">
                        <thead>
                        <tr className="games-list-header-row">
                            <th className="games-list-header">Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="games-list-row"
                                onClick={() => handleUserClick(user)}
                            >
                                <td className="games-list-cell">{user.name}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="settings-form">
                    <h1>Current Settings</h1>
                    <div className="settings-info">
                        {
                            imOnLeft && <p><strong>Sides: </strong>Me (left) : {selectedUser.name}(right)</p>
                        }
                        {
                            !imOnLeft && <p><strong>Sides: </strong>{selectedUser.name} (left) : Me(right)</p>
                        }
                        <p><strong>Chosen User:</strong> {selectedUser.name}</p>
                        <p><strong>Server:</strong> {imServer ? "Me" : selectedUser.name}</p>
                    </div>
                    <div className="settings-actions">
                        <button onClick={handleSwitchSides}>Switch Sides</button>
                        <button onClick={handleSwitchServer}>Switch Server</button>
                        <button onClick={handleBackToList}>Back to List</button>
                    </div>
                    <div className="file-upload">
                        <label htmlFor="file-upload">Upload Video (MP4):</label>
                        <input
                            type="file"
                            id="file-upload"
                            accept="video/mp4"
                            onChange={handleFileChange}
                        />
                    </div>
                    <button className="send-button" onClick={handleSend}>
                        Send
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddGame;