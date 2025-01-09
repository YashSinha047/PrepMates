// server.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const moment = require('moment');
const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const messageRoutes = require('./routes/messageRoutes');
const questionRoutes = require('./routes/questionRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const jobRoutes = require('./routes/jobRoutes');
const Message = require('./models/Message');
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

// Initialize app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"]
  }
});

// Middleware to parse JSON
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

// Routes
// app.use('/api/discussions', discussionRoutes);
app.use('/api/discussions', (req, res, next) => {
    req.io = io;
    next();
}, discussionRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/messages', messageRoutes);

app.use('/api/jobs', (req, res, next) => {
    req.io = io;
    next();
}, jobRoutes);

// Pass `io` to question routes so that it can be used in controllers
app.use('/api/questions', (req, res, next) => {
    req.io = io;
    next();
}, questionRoutes);

// Socket connection
const onlineUsers = {}; // Object to keep track of online users by groupId
io.listen(4000);
io.on("connection", (socket) => {
    // console.log("User connected:", socket.id);

    // Chat functionality
    socket.on("joinRoom", ({ groupId, username }) => {
        socket.join(groupId);

        if (!onlineUsers[groupId]) {
            onlineUsers[groupId] = {};
        }

        onlineUsers[groupId][username] = socket.id;
        io.to(groupId).emit("onlineUsers", Object.keys(onlineUsers[groupId]));
        // console.log(`${username} joined group ${groupId}`);
    });

    socket.on("sendMessage", async (data) => {
        const { groupId, sender, content } = data;
        const message = new Message({
            groupId,
            senderName: sender,
            content,
            timestamp: new Date()
        });

        try {
            await message.save();
            io.to(groupId).emit("receiveMessage", message);
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    socket.on("leaveGroup", ({ groupId, username }) => {
        if (onlineUsers[groupId]) {
            delete onlineUsers[groupId][username];
            io.to(groupId).emit("onlineUsers", Object.keys(onlineUsers[groupId]));
            // console.log(`${username} left group ${groupId}`);
        }
    });

    socket.on("disconnect", () => {
        for (let groupId in onlineUsers) {
            for (let user in onlineUsers[groupId]) {
                if (onlineUsers[groupId][user] === socket.id) {
                    delete onlineUsers[groupId][user];
                    io.to(groupId).emit("onlineUsers", Object.keys(onlineUsers[groupId]));
                    console.log(`${user} disconnected from group ${groupId}`);
                    break;
                }
            }
        }
    });
});



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected!'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
