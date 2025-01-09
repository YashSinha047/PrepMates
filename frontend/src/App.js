// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrimaryDashboard from './components/PrimaryDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import CreateGroup from './pages/CreateGroup';
import GroupDashboard from './components/GroupDashboard';
import JoinGroup from './pages/JoinGroup';
import MyQuestions from './pages/MyQuestions';
import GroupQuestions from './pages/GroupQuestions';
import QuestionDiscussion from './pages/QuestionDiscussion';
import JobPostings from './pages/JobPostings';


function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/group/:groupId/questions" element={<GroupQuestions />} />
          <Route exact path="/discussion/:groupId/question/:questionId" element={<QuestionDiscussion />} />

          {/* Protected route for dashboard */}
          <Route 
            path="/primary-dashboard" 
            element={
              <ProtectedRoute>
                <PrimaryDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-group"
            element={
              <ProtectedRoute>
                <CreateGroup />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/group-dashboard" 
            element={
              <ProtectedRoute>
                <GroupDashboard />
              </ProtectedRoute>
            }
          />


          <Route 
            path="/join-group" 
            element={
              <ProtectedRoute>
                <JoinGroup />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/my-questions" 
            element={
              <ProtectedRoute>
                <MyQuestions />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/job-postings"
            element={
              <ProtectedRoute>
                <JobPostings />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;



