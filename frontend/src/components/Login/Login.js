import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../../context/UserContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing icons from react-icons

const Login = () => {
    const { setUser } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // For password visibility toggle
    const navigate = useNavigate();

    // Check if the email is valid Gmail address as the user types
    const handleEmailChange = (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);
        if (emailValue && !emailValue.endsWith('@gmail.com')) {
            setError('Please enter a valid Gmail address.');
        } else {
            setError(''); // Clear error if the email is valid
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate final email input if user skips real-time validation
        if (!email.endsWith('@gmail.com')) {
            setError('Please enter a valid Gmail address.');
            return;
        }

        console.log('Login Submitted:', { email, password });

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const decoded = jwtDecode(data.token);
                const permissions = decodePermissions(decoded.permissions);

                // Store token and permissions in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('permissions', JSON.stringify(permissions));
                localStorage.setItem('userEmail', decoded.email);

                // Set the user context
                setUser({
                    email: decoded.email,
                    permissions,
                    roles: decoded.roles || [],
                });

                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                console.log("Login error:", errorData);
                setError(errorData.message || 'Invalid credentials, please try again.');
            }
        } catch (error) {
            console.error("Error during login request:", error);
            setError('An error occurred, please try again later.');
        }
    };

    const decodePermissions = (permissionsArray) => {
        const permissions = {};
        if (Array.isArray(permissionsArray)) {
            permissionsArray.forEach((perm) => {
                const [category, action] = perm.split(':');
                if (!permissions[category]) {
                    permissions[category] = {};
                }
                permissions[category][action] = true;
            });
        }
        return permissions;
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange} // Updated to handle email validation
                    required
                />
                <div className="password-field">
                    <input
                        type={isPasswordVisible ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="toggle-password-visibility"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        {isPasswordVisible ? <FaEyeSlash /> : <FaEye />} {/* Using icons */}
                    </button>
                </div>
                <button className="login-button" type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
