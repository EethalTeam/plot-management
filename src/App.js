import { Route, Routes,Navigate  } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/dashboard";
import Login from "./Pages/login/login";
import ProtectedRoute from './Pages/login/ProtectedRoute';

function App() {
  return (
    <div>
        <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
            <ProtectedRoute>
                <Dashboard />
             </ProtectedRoute>
            } />
        </Routes>
    </div>
  );
}

export default App;