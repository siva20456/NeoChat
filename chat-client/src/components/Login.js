

import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { TiTick } from 'react-icons/ti';
import '../OverAll.css';

const Login = () => {
    const PORT = 3005;
    const navigate = useNavigate();
    
    const [currentState, setCurrentState] = useState('SignIn');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registrationDetails, setRegistrationDetails] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

   

    const handleRegistrationDetailsChange = (e) => {
        const { name, value } = e.target;
        setRegistrationDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        if (username === "" || password === "") {
            alert('Please provide valid inputs');
            return;
        }

        try {
            const options = {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            };
            const res = await fetch(`http://localhost:${PORT}/login`, options);
            if (res.status === 200) {
                const data = await res.json();
                Cookies.set('jwt_token', data.jwt, { expires: 30 });
                Cookies.set('user', username, { expires: 30 });
                navigate('/');
            } else {
                const data = await res.json();
                alert(data.data);
            }
        } catch (error) {
            console.error('Error signing in:', error);
            alert('Error signing in. Please try again later.');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const { username, email, password } = registrationDetails;
        if (username === "" || email === "" || password === "") {
            alert('Please provide valid inputs');
            return;
        }

        try {
            const options = {
                method: 'POST',
                body: JSON.stringify({ username, email, password }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            };
            const res = await fetch(`http://localhost:${PORT}/register`, options);
            if (res.status === 201) {
                const data = await res.json();
                Cookies.set('jwt_token', data.jwt_token, { expires: 30 });
                Cookies.set('user', username, { expires: 30 });
                navigate('/');
            } else {
                const data = await res.json();
                alert(data.error);
            }
        } catch (error) {
            console.error('Error registering:', error);
            alert('Error registering. Please try again later.');
        }
    };

    const renderSignIn = () => (
        <form className="form-cont" onSubmit={handleSignIn}>
            <div className="input-cont">
                <label htmlFor="username" className="form-label">USERNAME</label>
                <input type="text" id="username" className="form-input" placeholder="Username" value={username} onChange={handleUsernameChange} />
            </div>
            <div className="input-cont">
                <label htmlFor="password" className="form-label">PASSWORD</label>
                <input type="password" id="password" className="form-input" placeholder="Password" value={password} onChange={handlePasswordChange} />
            </div>
            <button type="submit" className="submit-btn">Login</button>
        </form>
    );

    const renderRegister = () => (
        <form className="form-cont" onSubmit={handleRegister}>
            <div className="input-cont">
                <label htmlFor="username" className="form-label">USERNAME <span style={{ color: 'red' }}>*</span></label>
                <input type="text" id="username" className="form-input" placeholder="Username" value={registrationDetails.username} onChange={handleRegistrationDetailsChange} name="username" />
            </div>
            <div className="input-cont">
                <label htmlFor="email" className="form-label">E-Mail <span style={{ color: 'red' }}>*</span></label>
                <input type="text" id="email" className="form-input" placeholder="E-mail" value={registrationDetails.email} onChange={handleRegistrationDetailsChange} name="email" />
            </div>
            <div className="input-cont">
                <label htmlFor="password" className="form-label">SET PASSWORD <span style={{ color: 'red' }}>*</span></label>
                <input type="password" id="password" className="form-input" placeholder="Password" value={registrationDetails.password} onChange={handleRegistrationDetailsChange} name="password" />
            </div>
            <button type="submit" className="submit-btn">Register Now</button>
        </form>
    );

    const renderContext = () => {
        switch (currentState) {
            case 'SignIn':
                return renderSignIn();
            case 'Register':
                return renderRegister();
            default:
                return null;
        }
    };

    return (
        <div className="mainCont">
            <img src='' alt='Brand Logo' className="logo" />
            <div className="rowCont">
                <button className="state-btn" onClick={() => setCurrentState('SignIn')}>
                    <span className="states" style={{ color: currentState === 'SignIn' ? 'blue' : 'grey', textDecoration: 'none' }}>
                        Sign In <AiOutlineArrowRight fontSize={10} className="arrow-mark" />
                    </span>
                </button>
                <button className="state-btn" onClick={() => setCurrentState('Register')}>
                    <span className="states" style={{ color: currentState === 'Register' ? 'blue' : 'grey', textDecoration: 'none' }}>
                        Register <AiOutlineArrowRight fontSize={10} className="arrow-mark" />
                    </span>
                </button>
            </div>
            {renderContext()}
        </div>
    );
};

export default Login;
