import React, { useState, useEffect } from 'react';
import '../login/login.css';
// import Plot from '../../Assets/Images/ivm.png'
import { RiUserSharedFill } from "react-icons/ri";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
// import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Toaster, toast } from 'react-hot-toast';
import { decode as base64_decode, encode as base64_encode, 
  // version
 } from "base-64";
import { useNavigate } from "react-router-dom";
import { config } from '../../Components/CustomComponents/config';
import Loading from '../../Components/CustomComponents/Loading';


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '', show: false });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    const savedUsername = localStorage.getItem('EmployeeName');
    const savedPassword = localStorage.getItem('password');
    const RememberMe = localStorage.getItem('rememberMe')

    if (savedUsername && savedPassword) {
      try {
        setUsername(base64_decode(savedUsername));
        setPassword(base64_decode(savedPassword));
      } catch (error) {
        console.error("Decoding error:", error);
        localStorage.removeItem('EmployeeName'); // Clear corrupted values
        localStorage.removeItem('password');
      }
    }
    setRememberMe(localStorage.getItem('rememberMe') === 'true');
      if(savedUsername && savedPassword && RememberMe){
            navigate("/dashboard");
        }
  }, []);

  useEffect(() => {
    if (alert.show) {
      if (alert.type === 'error') {
        toast.error(alert.message);
      } else if (alert.type === 'success') {
        toast.success(alert.message);
      } else {
        toast(alert.message); // Default toast
      }
    }
  }, [alert]);
  const loginUser = async () => {
    try {
      setLoading(true);
      let url = config.Api + "Auth/login";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          EmployeeCode: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const result = await response.json();
      setLoading(false);

      // Assuming the API returns a token
      if (result.data.EmployeeName) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("EmployeeID", result.data._id)
        localStorage.setItem("EmployeeCode", base64_encode(result.data.EmployeeCode));
        localStorage.setItem("EmployeeName", result.data.EmployeeName);
        localStorage.setItem("departmentId", result.data.departmentId);
        localStorage.setItem("departmentName", result.data.departmentName)
        localStorage.setItem("lastLogin", result.data.lastLogin);
        localStorage.setItem("unitId", result.data.unitId);
        localStorage.setItem("unitName",result.data.unitName)
        localStorage.setItem("role", base64_encode(result.data.role));
        localStorage.setItem("rememberMe", rememberMe.toString());
        localStorage.setItem("password", base64_encode(result.data.password))
        setAlert({ type: "success", message: result.message, show: true });
        navigate("/dashboard");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      setAlert({ type: "error", message: error.message, show: true });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username) {
      setAlert({ type: "error", message: "Please enter Username", show: true });
      return;
    }
    if (!password) {
      setAlert({ type: "error", message: "Please enter Password", show: true });
      return;
    }
    loginUser();
  };


  return (
    <Loading loading={loading}>
      <div className="login">
        <div className='loginpageparent'>
          <div className="branch2">
            <div className="welcom">
              <p>Welcome</p>
              <p>Login to manage plots</p>
            </div>

            <form className='formParent' onSubmit={handleSubmit}>
              <div className="LoginInputParentSec">
                <div className="UserNameInputDiv">
                  <span className="UserNameText"><b>User Name</b></span>
                  <div className="InputContainer">
                    <span className="UserIcon">
                      <RiUserSharedFill />
                    </span>
                    <input
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="UserNameInput"
                    />
                  </div>
                </div>

                <div className="PasswordInputDiv">
                  <span className="UserNameText"><b>Password</b></span>
                  <div className="InputContainer">
                    <span className="UserIcon">
                      <FaLock />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="PasswordInput"
                    />
                    <span className="PasswordIcon" onClick={togglePasswordVisibility}>
                      {showPassword ? <FaEye className="UserNamePNG" /> : <FaEyeSlash className="UserNamePNG" />}
                    </span>
                  </div>
                </div>
                <div className='chckbox'>
                  <FormControlLabel
                    className="control-label"
                    control={
                      <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 16 } }}
                        className="control-checkbox"
                        checked={rememberMe}
                        onClick={(e) => setRememberMe(e.target.checked)}
                      />
                    }
                    label="Remember Me"
                    sx={{ '& .MuiTypography-root': { fontSize: '12px' } }}

                  />
                </div>
                <div className="LoginButton">
                  <button type="submit" className="button">Login</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <Toaster
        position="top-center" 
        toastOptions={{
          style: {
            maxWidth: '500px',  
            whiteSpace: 'pre-wrap', 
            wordBreak: 'break-word', 
            fontSize: '14px', 
          },
          error: {
            style: {
              border: '1px solid red',
              padding: '6px'
            }
          }
        }}
      />

      </div>
    </Loading>
  );
};

export default Login;