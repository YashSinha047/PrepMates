const Group = require('../models/Group');
const Question = require('../models/Question');
const { v4: uuidv4 } = require('uuid');  // to generate unique group ID
const mongoose = require('mongoose');

// Create Group function
exports.createGroup = async (req, res) => {
    const { groupName, userName } = req.body;

    console.log('groupName :', groupName);
    console.log('userName :', userName);
  
    if (!userName) {
      return res.status(400).json({ msg: 'User name is required' });
    }
  
    try {
      const existingGroup = await Group.findOne({ groupName });
      if (existingGroup) {
        return res.status(400).json({ msg: 'Group name already taken' });
      }
  
      const groupId = uuidv4();
      const newGroup = new Group({
        groupName,
        groupId,
        members: [userName],
      });

      console.log('newGroup :', newGroup);
  
      await newGroup.save();
      res.status(201).json({ groupId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error', error: error.message });
    }
  };

// Join Group function
exports.joinGroup = async (req, res) => {
    const { username, groupName, groupId } = req.body;
  
    try {
      // Check if the group exists with the provided name
      const group = await Group.findOne({ groupName: groupName });
  
      if (!group) {
        return res.status(404).json({ msg: 'No group with this name exists.' });
      }
  
      // Check if the provided group ID matches the found group
      if (group.groupId !== groupId) {
        return res.status(400).json({ msg: 'Incorrect group ID.' });
      }
  
      // Check if the user is already a member of the group
      if (group.members.includes(username)) {
        return res.status(400).json({ msg: 'You are already a member of this group.' });
      }
  
      // Add the user to the group members list
      group.members.push(username);
      await group.save();
  
      // Respond with the group name and ID
      return res.status(200).json({ groupName: group.groupName, groupId: group.groupId });
  
    } catch (error) {
      return res.status(500).json({ msg: 'Server error.', error: error.message });
    }
  };

// Controller to fetch groups where the user is a member
exports.myGroup = async (req, res) => {
    const { username } = req.query;
  
    try {
      // Find groups where the username is in the members list
      const userGroups = await Group.find({ members: username });
  
      if (userGroups.length === 0) {
        // If no groups found, send an error message
        return res.status(404).json({ message: 'You are not a member of any group.' });
      }
  
      // Map to send back group name and ID only
      const groupsData = userGroups.map(group => ({
        groupId: group.groupId,
        groupName: group.groupName
      }));
  
      // Send the list of groups with names and IDs in response
      res.status(200).json(groupsData);
  
    } catch (error) {
      console.error('Error fetching user groups:', error);
      res.status(500).json({ message: 'Error fetching user groups' });
    }
  };

// Controller to leave a group
exports.leaveGroup = async (req, res) => {
    const { groupName, username } = req.body;
  
    try {
      // Find the group by name
      const group = await Group.findOne({ groupName });
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
  
      // Remove the user from the group's member list
      group.members = group.members.filter(member => member !== username);
      await group.save();
  
      // If the group has no members left, delete the group
      if (group.members.length === 0) {
        await Group.deleteOne({ groupName });
        console.log(`Deleted group ${groupName} as it has no remaining members`);
      }
  
      res.status(200).json({ message: 'You have successfully left the group' });
    } catch (error) {
      console.error('Error leaving group:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };  

// Endpoint to get shared questions for a group
exports.shareQuestion = async (req, res) => {
  const { groupId, questionId } = req.body;

  try {
      // Convert questionId to ObjectId using 'new' keyword
      const questionObjectId = new mongoose.Types.ObjectId(questionId);

      // Find the group by groupId
      const group = await Group.findOne({ groupId });
      if (!group) {
          return res.status(404).json({ error: 'Group not found' });
      }

      // Add the question ObjectId to sharedQuestions
      group.sharedQuestions.push(questionObjectId);
      await group.save();

      res.status(200).json({ message: 'Question shared successfully!' });
  } catch (error) {
      console.error('Error sharing question:', error);
      res.status(500).json({ error: 'An error occurred while sharing the question' });
  }
};


// Controller method to get shared questions without status and sorted by most recent
exports.getSharedQuestions = async (req, res) => {
  const { groupId } = req.params;

  try {
    // Find the group and populate sharedQuestions while excluding the 'status' field
    const group = await Group.findOne({ groupId })
      .populate({
        path: 'sharedQuestions',
        select: '-status', // Exclude the 'status' field in populated questions
        options: { sort: { createdAt: -1 } } // Sort by createdAt in descending order
      })
      .exec();

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Return the shared questions without 'status' and sorted by most recent
    res.status(200).json({ sharedQuestions: group.sharedQuestions });
  } catch (error) {
    console.error("Error fetching shared questions:", error);
    res.status(500).json({ message: "Server error" });
  }
};




  