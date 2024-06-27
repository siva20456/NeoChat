# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

# Simple Chat Application

## Setup Instructions

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/chat-app.git
    cd chat-app
    ```

2. Install backend dependencies:
    ```bash
    cd server
    npm install
    ```

3. Configure environment variables:
    - Create a `.env` file in the `server` directory and add your MongoDB connection string and JWT secret.
    
4. Run the backend server:
    ```bash
    npm start
    ```

5. Open  in your browser to access the chat application.

## Overview

This application demonstrates a simple chat application using WebSockets for real-time communication. The backend is built with Node.js and Express, and MongoDB is used for storing user credentials. User authentication is handled using JWT.

## Features

- User registration and login with JWT-based authentication.
- Real-time messaging with WebSockets.
- Simple and intuitive user interface.

## Security Measures

- Passwords are hashed before storing in the database.
- JWT is used for securing API endpoints and WebSocket connections.

## Author

Your Name
