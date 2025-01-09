// Updated MyQuestions.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import io from "socket.io-client";
import "./MyQuestions.css";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { UserContext } from '../context/UserContext';

const socket = io("http://localhost:4000"); 

const MyQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState("");
  const userEmail = localStorage.getItem("email");
  const { user } = useContext(UserContext);

    // State to hold groups data and loading state
    const [groups, setGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/questions/details-questions",
          { userEmail },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 200) {
          setQuestions(response.data.questions);
          setMessage("");
        } else {
          setMessage(response.data.message);
          setQuestions([]);
        }
      } catch (error) {
        setMessage("An error occurred while fetching your questions.");
        console.error("Error fetching questions:", error);
      }
    };

    socket.on(`newQuestion-${userEmail}`, (newQuestion) => {
      setQuestions((prevQuestions) => [newQuestion, ...prevQuestions]);
      fetchQuestions();
    });

    fetchQuestions();

    return () => {
      socket.off(`newQuestion-${userEmail}`);
    };
  }, [userEmail]);

  const toggleStatus = async (questionId, currentStatus) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/questions/status/${questionId}`,
        { status: !currentStatus },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q._id === questionId ? { ...q, status: !currentStatus } : q
          )
        );
      } else {
        console.error("Failed to update question status");
      }
    } catch (error) {
      console.error("Error updating question status:", error);
    }
  };

  const deleteQuestion = async (questionId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/questions/${questionId}`
      );

      if (response.status === 200) {
        setQuestions((prevQuestions) =>
          prevQuestions.filter((q) => q._id !== questionId)
        );
      } else {
        console.error("Failed to delete question");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

    // Fetch groups when "My Groups" button is clicked
    const handleMyGroupsClick = async () => {
        try {
          setLoadingGroups(true);
          // Retrieve username from the context or local storage
          const username = user?.username || localStorage.getItem('username');
          
          // Make the API call with the username as a query parameter
          const response = await axios.get(`http://localhost:5000/api/groups/my-groups?username=${username}`);
          
          setGroups(response.data);
        //   setShowDropdown(true);
          setLoadingGroups(false);
        } catch (error) {
          console.error('Error fetching groups:', error);
          setLoadingGroups(false);
        }
      };

    const shareQuestion = async (questionId, groupId) => {
    try {
        const response = await axios.post("http://localhost:5000/api/groups/share-question", {
        questionId,
        groupId,
        });
        if (response.status === 200) {
        alert("Question shared successfully!");
        } else {
        alert("Failed to share the question.");
        }
    } catch (error) {
        console.error("Error sharing question:", error);
    }
    };  
  

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">My Questions</h1>
      {message && <div className="alert alert-danger">{message}</div>}
      {questions.length > 0 ? (
        <ul className="list-group">
          {questions.map((question) => (
            <li key={question._id} className="list-group-item mb-3">
              <p><strong>Platform:</strong> {question.platform}</p>
              <p><strong>Question Name:</strong> {question.questionName || "N/A"}</p>
              <p><strong>URL:</strong> <a href={question.url} target="_blank" rel="noopener noreferrer">{question.url}</a></p>
              <p><strong>Note:</strong> {question.note}</p>
              <p><strong>Question ID:</strong> {question._id}</p>
              <p><strong>Status:</strong> {question.status ? "Solved" : "Unsolved"}</p>

              <DropdownButton title="Share" variant="success" className="mr-2" onClick={handleMyGroupsClick}>
                {loadingGroups ? (
                  <Dropdown.Item>Loading...</Dropdown.Item>
                ) : groups.length === 0 ? (
                  <Dropdown.Item disabled>No Groups Available</Dropdown.Item>
                ) : (
                  groups.map((group) => (
                    <Dropdown.Item
                      key={group.groupId}
                      onClick={() => shareQuestion(question._id, group.groupId)}
                    >
                      {group.groupName}
                    </Dropdown.Item>
                  ))
                )}
              </DropdownButton>

              <button
                onClick={() => toggleStatus(question._id, question.status)}
                className="btn btn-primary mr-2"
              >
                Mark as {question.status ? "Unsolved" : "Solved"}
              </button>
              <button
                onClick={() => deleteQuestion(question._id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No questions saved.</p>
      )}
    </div>
  );
};

export default MyQuestions;
