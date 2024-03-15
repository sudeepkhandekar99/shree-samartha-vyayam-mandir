import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LandingIntro from './LandingIntro';
import ErrorText from '../../components/Typography/ErrorText';
import InputText from '../../components/Input/InputText';

function Login() {
  const INITIAL_LOGIN_OBJ = {
    password: '',
    email: '',
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const apiUrl = 'http://143.110.190.154:8000/users';
        const response = await fetch(apiUrl);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    // Fetch all users when the component mounts
    fetchUsers();
  }, []);

  const submitForm = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (loginObj.email.trim() === '' || loginObj.password.trim() === '') {
      setErrorMessage(
        <span style={{ color: 'yellow' }}>Email and Password are required!</span>
      );
      return;
    }

    // Check if entered email and password match any of the fetched users
    console.log(users);
    console.log(loginObj.email);
    console.log(loginObj.password);
    const matchingUser = users.find(
      (user) => user.email === loginObj.email && user.password === loginObj.password
    );

    console.log("matchingUser");  
    console.log(matchingUser);  

    if (matchingUser) {
      // Authentication successful
      // Save user data or token in localStorage if needed
      localStorage.setItem('token', 'DummyTokenHere');

      // Redirect to the desired location
      window.location.href = '/app/welcome';
    } else {
      // Authentication failed
      setErrorMessage(
        <span style={{ color: 'red' }}>Invalid Email or Password. Please try again.</span>
      );
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage('');
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-rose-900 flex items-center">
      <div className="card mx-auto w-full max-w-5xl shadow-xxl">
        <div className="grid md:grid-cols-2 grid-cols-1 bg-rose-800 bg- rounded-xxl">
          <div className="">
            <LandingIntro />
          </div>
          <div className="py-24 px-10">
            <h2 className="text-2xl font-semibold mb-2 text-center text-white">Login</h2>
            <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4 text-white">
                <InputText
                  type="email"
                  defaultValue={loginObj.email}
                  updateType="email"
                  containerStyle="mt-4"
                  labelTitle="Email Id"
                  updateFormValue={updateFormValue}
                  style={{ color: 'white' }}
                />

                <InputText
                  defaultValue={loginObj.password}
                  type="password"
                  updateType="password"
                  containerStyle="mt-4"
                  labelTitle="Password"
                  updateFormValue={updateFormValue}
                  style={{ color: 'white' }}
                />
              </div>

              <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
              <button
                type="submit"
                className={`btn mt-2 w-full btn-rose-800 btn btn-block text-white${loading ? ' loading' : ''}`}
              >
                Login
              </button>

              <div className='text-center mt-4 text-white'>
                Don't have an account yet?{' '}
                <Link to="/register">
                  <span className=" text-sm inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                    Register
                  </span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
