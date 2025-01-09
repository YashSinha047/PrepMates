# PrepMates - Collaborative Coding and Job Application Management Platform

## Project Overview
PrepMates is a web application designed to help students collaboratively prepare for coding interviews and efficiently manage job applications. The platform facilitates a seamless user experience where students can share coding resources, engage in group discussions, and track their job application progress. Built with real-time features for collaboration, this platform aims to be the go-to tool for students preparing for coding interviews.

## Key Features
- **User Authentication:** Secure user registration and login functionality implemented using JWT (JSON Web Tokens).
- **Primary User Dashboard:** A central hub where users can manage coding questions and job postings, create and join groups, save questions, and track job applications.
- **Real-Time Features:** Real-time group chats and discussion forums for collaborative problem-solving, powered by WebSockets.
- **Browser Extensions:** Extensions developed for saving coding questions and job postings, with personalized notes for enhanced user organization.
- **Deployment:** Deployed using Docker for containerization on AWS EC2 with the frontend hosted on Vercel to ensure scalability and reliability.
- **Future Enhancements:** The application will include a reminder system for job postings, sharing features for job postings, and uploading study resources for collaborative learning.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Frontend:** React.js
- **Database:** MongoDB
- **Real-Time Communication:** WebSockets
- **Authentication:** JWT (JSON Web Tokens)
- **Deployment:** AWS EC2, Docker, Vercel

## Installation Guide

### Prerequisites
- Node.js installed on your machine.
- MongoDB Atlas or a local instance of MongoDB.
- Docker (optional, for containerization).

### Clone the Repository
```bash
git clone https://github.com/YashSinha/PrepMates.git
cd PrepMates
```

### Install the backend and frontend dependencies.

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

### Environment Variables
### backend.env
```bash
MONGO_URI=<Your MongoDB URI>
JWT_SECRET=<Your Secret Key>
PORT=5000
```
### fronend.env
```bash
REACT_APP_API_URL=<API URL for the backend>
```

### Running the Application
### Start the Backend
```bash
cd backend
npm start
```

### Start the Frontend
```bash
cd frontend
npm start
```

## Usage
Once the application is running, you can:

- Register or log in to the platform.
- On the **Dashboard**, create and join groups, manage coding questions, and track job applications.
- Use the **Real-Time Chat** and **Discussion Forums** to collaborate with others on coding problems.
- Use **browser extensions** to save coding questions and job postings with personalized notes.

## Contributing
Feel free to fork the repository, make changes, and submit pull requests. Please make sure your changes align with the project’s goals and maintain code quality.

### Steps for Contributing:
1. Fork this repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

## Future Work
- Implement reminder system for job postings.
- Enhance job posting sharing features.
- Enable study resource uploads for collaborative learning.


