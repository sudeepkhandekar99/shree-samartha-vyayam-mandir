import {useState, useRef} from 'react'
import {Link} from 'react-router-dom'
import LandingIntro from './LandingIntro'
import ErrorText from  '../../components/Typography/ErrorText'
import InputText from '../../components/Input/InputText'

function Login(){

    const INITIAL_LOGIN_OBJ = {
        password : "",
        emailId : ""
    }

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ)

    const submitForm = (e) =>{
        e.preventDefault()
        setErrorMessage("")

        if (loginObj.emailId.trim() === "") {
            setErrorMessage(<span style={{ color: 'yellow' }}>Email Id is required! (use any value)</span>);
            return;
          }
          
          if (loginObj.password.trim() === "") {
            setErrorMessage(<span style={{ color: 'yellow' }}>Password is required! (use any value)</span>);
            return;
          }
          
        else{
            setLoading(true)
            // Call API to check user credentials and save token in localstorage
            localStorage.setItem("token", "DumyTokenHere")
            setLoading(false)
            window.location.href = '/app/welcome'
        }
    }

    const updateFormValue = ({updateType, value}) => {
        setErrorMessage("")
        setLoginObj({...loginObj, [updateType] : value})
    }

    return(
        <div className="min-h-screen bg-rose-900 flex items-center">
            <div className="card mx-auto w-full max-w-5xl  shadow-xxl">
                <div className="grid  md:grid-cols-2 grid-cols-1 bg-rose-800 bg- rounded-xxl">
                <div className=''>
                        <LandingIntro />
                </div>
                <div className='py-24 px-10'>
                    <h2 className='text-2xl font-semibold mb-2 text-center text-white'>Login</h2>
                    <form onSubmit={(e) => submitForm(e)}>

                        <div className="mb-4   text-white">

                            <InputText type="emailId" defaultValue={loginObj.emailId} updateType="emailId" containerStyle="mt-4" labelTitle="Email Id" updateFormValue={updateFormValue}  style={{ color: 'white' }} />

                            <InputText defaultValue={loginObj.password} type="password" updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue}  style={{ color: 'white' }} />

                        </div>

                        <div className='text-right text-white'><Link to="/forgot-password"><span className="text-sm  inline-block  hover:text-white hover:underline hover:cursor-pointer transition duration-200">Forgot Password?</span></Link>
                        </div>

                        <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                        <button type="submit" className={"btn mt-2 w-full btn-rose-800  btn btn-block text-white" + (loading ? " loading" : "")}>Login</button>

                        <div className='text-center mt-4  text-white'>Don't have an account yet? <Link to="/register"><span className=" text-sm   inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Register</span></Link></div>
                    </form>
                </div>
            </div>
            </div>
        </div>
    )
}

export default Login