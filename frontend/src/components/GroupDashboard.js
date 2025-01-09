import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChatComponent from './ChatComponent';

const GroupDashboard = () => {
    const { user, setUser } = useContext(UserContext);
    const [copySuccess, setCopySuccess] = useState('');
    const navigate = useNavigate();

    if (!user) {
        return <div>Loading...</div>;
    }

    const { groupId, groupName, username } = user;

    const handleHomeClick = () => {
        localStorage.removeItem('groupName');
        localStorage.removeItem('groupId');

        setUser((prevUser) => ({
            ...prevUser,
            groupId: null,
            groupName: null,
        }));

        navigate('/primary-dashboard');
    };

    const handleCopyGroupId = () => {
        navigator.clipboard.writeText(groupId)
            .then(() => {
                setCopySuccess('Group ID copied!');
                setTimeout(() => setCopySuccess(''), 2000);
            })
            .catch((err) => {
                console.error('Failed to copy Group ID:', err);
            });
    };

    const handleLeaveGroup = async () => {
        const confirmLeave = window.confirm('Do you want to leave this group? You will lose all the files of this group.');
        if (!confirmLeave) return;

        try {
            await axios.post('http://localhost:5000/api/groups/leave-group', {
                groupName,
                username,
            });

            localStorage.removeItem('groupName');
            localStorage.removeItem('groupId');
            setUser((prevUser) => ({
                ...prevUser,
                groupId: null,
                groupName: null,
            }));
            navigate('/primary-dashboard');
        } catch (error) {
            console.error('Error leaving group:', error);
        }
    };

    const handleViewQuestions = () => {
        navigate(`/group/${groupId}/questions`);
    };

    return (
        <Container className="mt-5">
            <h3>Hi {username}, Welcome to {groupName}</h3>
            {copySuccess && <p className="text-success">{copySuccess}</p>}
            <Button variant="primary" onClick={handleHomeClick}>
                Home
            </Button>
            <Button variant="danger" onClick={handleLeaveGroup} className="mx-2">
                Leave Group
            </Button>
            <Button variant="secondary" onClick={handleCopyGroupId}>
                Copy GroupID
            </Button>
            <Button variant="info" onClick={handleViewQuestions} className="mx-2">
                Questions
            </Button>

            <div className="col-md-10 chat-area">
                <ChatComponent groupId={groupId} username={username} />
            </div>
        </Container>
    );
};

export default GroupDashboard;
