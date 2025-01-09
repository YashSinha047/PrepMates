import React, { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";
import axios from 'axios';
import moment from 'moment';
import './styles.css'

const socket = io("http://localhost:4000");

function ChatComponent({ groupId, username }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        socket.emit("joinRoom", { groupId, username });

        const handleOnlineUsers = (users) => {
            console.log("Online Users:", users); // Debug log
            setOnlineUsers(users);
        };
        socket.on("onlineUsers", handleOnlineUsers);

        const handleReceiveMessage = (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };
        socket.on("receiveMessage", handleReceiveMessage);

        const fetchMessages = async () => {
            const response = await axios.get(`http://localhost:5000/api/messages/${groupId}`);
            setMessages(response.data);
        };
        fetchMessages();

        return () => {
            socket.emit("leaveGroup", { groupId, username });
            socket.off("onlineUsers", handleOnlineUsers);
            socket.off("receiveMessage", handleReceiveMessage);
        };
    }, [groupId, username]);

    const formatTime = (timestamp) => {
        return moment(timestamp).format("hh:mm A");
    };

    // Scroll to the bottom whenever messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (message.trim()) {
            const messageData = {
                groupId,
                sender: username,
                content: message,
                timestamp: new Date().toISOString(),
            };

            socket.emit("sendMessage", messageData);
            setMessage("");
        }
    };

    return (
        <div className="chat-container">
            {/* Left Column for Online Members */}
            <div className="col-md-2 online-users-area">
                <h4>Online Members</h4>
                <ul className="list-group">
                    {onlineUsers.length > 1 ? (
                        onlineUsers
                            .filter((user) => user !== username)
                            .map((user) => (
                                <div key={user} className="user-box">
                                    {user}
                                </div>
                            ))
                    ) : (
                        <div>No other members are online</div>
                    )}
                </ul>
            </div>

            {/* Chat Space */}
            <div className="chat-box">
                {/* Chat Messages */}
                <div ref={scrollRef} className="message-area">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={msg.senderName === username ? 'message message-right' : 'message message-left'}
                        >
                            {msg.senderName !== username ? (
                                <div>
                                    <strong>{msg.senderName}:</strong> {msg.content}
                                </div>
                            ) : (
                                <div>{msg.content}</div>
                            )}
                            <div className="message-time">{formatTime(msg.timestamp)}</div>
                        </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="message-input">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                    />
                    <button className="btn btn-primary" onClick={handleSendMessage}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatComponent;

