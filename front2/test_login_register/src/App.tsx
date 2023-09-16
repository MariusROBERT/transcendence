import './App.css';
import Register from './components/Register/register';
import { Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import Login from './components/Login/login';
import AuthGuard from './authguard';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <AuthGuard isAuthenticated>
              <MainPage />
            </AuthGuard>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
