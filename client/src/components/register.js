import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function Register() {
    const [ serverError, setServerError ] = useState(false);
    const [ serverErrorMsg, setServerErrorMsg ] = useState({});
    const [ error, setError ] = useState(false);
    const [ email, setEmail ] = useState('');
    const [ username, setUsrname ] = useState('');
    const [ password, setPassword ] = useState('');
    const nav = useNavigate();
    const ENDPOINT = 'https://lago-chess.herokuapp.com/' 
    const register = async () => {
        if (email === '' || username === '' || password === '' ) {
            setError(true)
        }
        else {
            await axios.post(ENDPOINT + '/signup', {
                email,
                username,
                password
            },{
                withCredentials: true
            })
            .then(res => nav('/?p=register'))
            .catch(e => {
                setServerError(true)
                if (e.response) {
                    setServerErrorMsg(e.response.data.errors)
                }
            })
        }
    }
    return (
        <div className="register_page">
            <div className='register'>
                <input 
                    type="email" 
                    placeholder="email" 
                    required 
                    style={(error && email === '') ? {border: '1px solid red'}: {border: '0'}}
                    onChange={(e) => {
                        setEmail(e.target.value)
                        setServerError(false)
                }} />
                <input 
                    type="text"     
                    placeholder="username" 
                    required 
                    style={(error && username === '') ? {border: '1px solid red'}: {border: '0'}}
                    onChange={(e) => {
                        setUsrname(e.target.value)
                        setServerError(false)
                }} />
                <input 
                    type="password" 
                    placeholder="password" 
                    required 
                    style={(error && password === '') ? {border: '1px solid red'} : {border: '0'}}
                    onChange={(e) => {
                        setPassword(e.target.value)
                        setServerError(false)
                }} />
                <Link to='/' onClick={e=> e.preventDefault()}>
                    <button onClick={register} >Register</button> 
                </Link>
                {serverError && <p style={{color: 'red'}}>{serverErrorMsg.email}</p>}
                {serverError && <p style={{color: 'red'}}>{serverErrorMsg.username}</p>}
                {serverError && <p style={{color: 'red'}}>{serverErrorMsg.password}</p>}
            </div>
        </div>
    )
}

export default Register
