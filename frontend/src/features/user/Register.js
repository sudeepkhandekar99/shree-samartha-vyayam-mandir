import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LandingIntro from './LandingIntro';
import ErrorText from '../../components/Typography/ErrorText';
import InputText from '../../components/Input/InputText';

function Register() {
  const INITIAL_REGISTER_OBJ = {
    name: '',
    password: '',
    emailId: '',
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ);

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (registerObj.name.trim() === '') {
      setErrorMessage(<span style={{ color: 'yellow' }}>Name is required! (use any value)</span>);
      return;
    }

    if (registerObj.emailId.trim() === '') {
      setErrorMessage(<span style={{ color: 'yellow' }}>Email Id is required! (use any value)</span>);
      return;
    }

    if (registerObj.password.trim() === '') {
      setErrorMessage(<span style={{ color: 'yellow' }}>Password is required! (use any value)</span>);
      return;
    }

    try {
      const apiUrl = `http://143.110.190.154:8000/users?name=${registerObj.name}&email=${registerObj.emailId}&password=${registerObj.password}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      // Handle the response from the server
      console.log(data);

      // Perform additional actions based on the response if needed

      // Redirect to the desired location
      window.location.href = '/app/welcome';
    } catch (error) {
      // Handle errors
      console.error('Error:', error);
      setErrorMessage(
        <span style={{ color: 'red' }}>An error occurred while registering. Please try again.</span>
      );
    } finally {
      setLoading(false);
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage('');
    setRegisterObj({ ...registerObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-rose-900 flex items-center">
      <div className="card mx-auto w-full max-w-5xl  shadow-xl">
        <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
          <div className="">
            <LandingIntro />
          </div>
          <div className="py-24 px-10 bg-rose-800">
            <h2 className="text-2xl font-semibold mb-2 text-center text-white">Register</h2>
            <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4  text-white">
                <InputText
                  defaultValue={registerObj.name}
                  updateType="name"
                  containerStyle="mt-4"
                  labelTitle="Name "
                  updateFormValue={updateFormValue}
                />
                <InputText
                  defaultValue={registerObj.emailId}
                  updateType="emailId"
                  containerStyle="mt-4"
                  labelTitle="Email Id"
                  updateFormValue={updateFormValue}
                />
                <InputText
                  defaultValue={registerObj.password}
                  type="password"
                  updateType="password"
                  containerStyle="mt-4"
                  labelTitle="Password"
                  updateFormValue={updateFormValue}
                />
              </div>
              <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
              <button
                type="submit"
                className={`btn mt-2 w-full btn-rose-800  text-white${loading ? ' loading' : ''}`}
              >
                Register
              </button>
              <div className="text-center mt-4 text-white">
                Already have an account?{' '}
                <Link to="/login">
                  <span className="  inline-block  hover:white hover:underline hover:cursor-pointer transition duration-200">
                    Login
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

export default Register;
