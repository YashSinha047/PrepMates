import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { ListGroup, Container, Spinner, Alert } from 'react-bootstrap';

const GroupQuestions = () => {
    const { groupId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSharedQuestions = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/shared-questions`);
                setQuestions(response.data.sharedQuestions);
                setLoading(false);
            } catch (err) {
                setError("Error fetching shared questions.");
                setLoading(false);
            }
        };

        fetchSharedQuestions();
    }, [groupId]);

    if (loading) return <Spinner animation="border" role="status" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container className="mt-4">
            <h3>Shared Questions for Group</h3>
            {questions.length === 0 ? (
                <p>No questions shared in this group.</p>
            ) : (
                <ListGroup>
                    {questions.map((question) => (
                        <ListGroup.Item key={question._id}>
                            <p><strong>Platform:</strong> {question.platform}</p>
                            <p><strong>Question Name:</strong> {question.questionName}</p>
                            <p><strong>URL:</strong> <a href={question.url} target="_blank" rel="noopener noreferrer">{question.url}</a></p>
                            <p><strong>Note:</strong> {question.note}</p>
                            <Link to={`/discussion/${groupId}/question/${question._id}`} className="btn btn-primary">Discuss</Link>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Container>
    );
};

export default GroupQuestions;
