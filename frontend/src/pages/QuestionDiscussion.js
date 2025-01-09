import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from "socket.io-client";
import { useParams } from 'react-router-dom';
import { Form, Button, ListGroup, Container } from 'react-bootstrap';

const socket = io("http://localhost:4000");

const QuestionDiscussion = () => {
    const { groupId, questionId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const username = localStorage.getItem('username');
    const lastMessageRef = useRef(null); // Reference to the last message

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/discussions/${groupId}/questions/${questionId}`);
                setMessages(response.data.messages);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();

        // Listen for new messages in the room
        socket.on("message", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Cleanup on unmount
        return () => {
            socket.off("message");
        };
    }, [groupId, questionId]);

    useEffect(() => {
        // Scroll to the last message when messages array changes
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handlePostMessage = async () => {
        try {
            await axios.post(`http://localhost:5000/api/discussions/${groupId}/questions/${questionId}`, {
                message: newMessage,
                user: username,
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error posting message:", error);
        }
    };

    return (
        <Container style={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
            <h3>Discussion Forum</h3>
            <ListGroup
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    marginBottom: '1rem',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    padding: '10px'
                }}
            >
                {messages.map((msg, index) => (
                    <ListGroup.Item key={index} ref={index === messages.length - 1 ? lastMessageRef : null}>
                        <strong>{msg.user}:</strong> {msg.message}
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <Form style={{ marginTop: 'auto' }}>
                <Form.Group>
                    <Form.Control
                        type="text"
                        placeholder="Add a comment"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        style={{ height: '50px' }}
                    />
                </Form.Group>
                <Button onClick={handlePostMessage} style={{ width: '100%' }}>Post</Button>
            </Form>
        </Container>
    );
};

export default QuestionDiscussion;
