// src/api.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Function to login user
export const login = (email, password) => apiClient.post('/auth/login', { email, password });
