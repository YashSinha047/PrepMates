// controllers/questionController.js
const Question = require('../models/Question');
const User = require('../models/User');

// Controller function to save question
const saveQuestion = async (req, res) => {
    console.log("save question request received");
    try {
        const { userEmail, questionName, platform, url, note } = req.body;
        const io = req.io; // Access the `io` instance from the request

        if (!userEmail || !platform || !url) {
            return res.status(400).json({ message: "User email, platform, and URL are required." });
        }

        // Check if the user exists in the User model
        const userExists = await User.findOne({ email: userEmail });
        if (!userExists) {
            return res.status(404).json({ message: "No account found for this email. Would you like to create one?" });
        }

        // Save the question if the user exists
        const newQuestion = new Question({
            userEmail,
            questionName,
            platform,
            url,
            note,
        });

        await newQuestion.save();

        // Emit a WebSocket event to notify that a question has been saved
        io.emit(`newQuestion-${userEmail}`, newQuestion);

        return res.status(201).json({ message: "Question saved successfully!" });
    } catch (error) {
        console.error("Error saving question:", error);
        return res.status(500).json({ message: "An error occurred while saving the question." });
    }
};

// Fetch questions by user email
const getQuestionsByEmail = async (req, res) => {
    console.log('fetch request received', req.body);
    const { userEmail } = req.body;
  
    try {
      const questions = await Question.find({ userEmail }).sort({ createdAt: -1 });
  
      if (questions.length === 0) {
        return res.status(404).json({ message: 'You have no questions saved.' });
      }
  
      return res.status(200).json({ questions });
    } catch (error) {
      console.error('Error fetching questions:', error);
      return res.status(500).json({ message: 'An error occurred while fetching questions.' });
    }
};

// Toggle question solved/unsolved status
const toggleQuestionStatus = async (req, res) => {
    const { questionId } = req.params;
    const { status } = req.body;

    console.log('Question id ',questionId);
  
    try {
      const question = await Question.findByIdAndUpdate(questionId, { status }, { new: true });

      console.log('Question id status',question);
  
      if (!question) {
        return res.status(404).json({ message: 'Question not found.' });
      }
  
      return res.status(200).json({ message: 'Question status updated successfully.' });
    } catch (error) {
      console.error('Error updating question status:', error);
      return res.status(500).json({ message: 'An error occurred while updating question status.' });
    }
};
  
// Delete a question
const deleteQuestion = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedQuestion = await Question.findByIdAndDelete(id);
  
      if (deletedQuestion) {
        res.status(200).json({ message: "Question deleted successfully." });
      } else {
        res.status(404).json({ message: "Question not found." });
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting question.", error });
    }
  };

module.exports = { saveQuestion, getQuestionsByEmail, toggleQuestionStatus, deleteQuestion };
