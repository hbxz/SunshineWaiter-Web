import React, { useState } from 'react'
import { message } from 'antd'

import './default.css'
// import GoogleAuth from './GoogleAuth'
import BaseProvider from '../apis/BaseProvider'
import { setCookie, getCookie } from './Cookies'

const renderSignUp = (username, setUsername) => {
  return (
    <div className="field">
      <label htmlFor="username">Username</label>
      <div className="ui left icon input">
        <input
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <i className="user icon" />
      </div>
      <small>Username has to be as least 5 letters</small>
    </div>
  )
}

// const renderGoogleAuth = () => {
//   return (
//     <div>
//       <div className="ui horizontal divider">Or</div>
//       {/* <GoogleAuth /> */}
//     </div>
//   )
// }

const onAuth = ([param, onAuthenticated, showSignUp]) => event => {
  event.preventDefault()
  const URL = showSignUp ? '/users' : '/users/login'

  const emailValidator = email => {
    // return email.includes('@') && email.includes('.com')
    return true
  }

  if (!param.password || !param.email || (showSignUp && !param.name)) {
    message.warning('Information is incomplete!', 3)
  } else if (showSignUp && param.name.length < 5) {
    message.warning('Username is less than 5 letters!', 3)
  } else if (!emailValidator(param.email)) {
    message.warning('Email is invalid!', 3)
  } else if (param.password.length < 10) {
    message.warning('Password is less than 10 letters!', 3)
  } else {
    BaseProvider.post(URL, param)
      .then(res => {
        const token = showSignUp ? res.data.accessToken : res.data
        setCookie('token', token)
        getCookie('token') !== undefined && onAuthenticated(true)
      })
      .catch(({ response }) => {
        if (response !== undefined) {
          message.error(response.data.error, 3)
        } else {
          message.error('The server is down!', 3)
        }
      })
  }
}

const AuthCard = ({ onAuthenticated, onCloseAuthCard }) => {
  const [showSignUp, setShowSignUp] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const signUpParam = {
    name: username,
    email: email,
    password: password,
  }

  const signInParam = {
    email: email,
    password: password,
  }

  const param = showSignUp ? signUpParam : signInParam

  return (
    <div className="auth-card">
      <div className="ui placeholder segment">
        <span onClick={onCloseAuthCard}>
          <i className="right clickable close icon"></i>
        </span>
        <div className="column">
          <form
            className="ui form"
            onSubmit={onAuth([param, onAuthenticated, showSignUp])}
          >
            <div className="field">
              {showSignUp && renderSignUp(username, setUsername)}
              <label htmlFor="email">Email</label>
              <div className="ui left icon input">
                <input
                  type="text"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <i className="envelope icon" />
              </div>
              <small>Email has to be valid</small>
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="ui left icon input">
                <input
                  type="text"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <i className="lock icon" />
              </div>
              <small>Password has to be as least 10 letters</small>
            </div>
            <button
              className="ui blue submit button"
              style={{ width: '210px' }}
            >
              {showSignUp ? 'Sign up' : 'Login'}
            </button>
            {/* {showSignUp ? renderGoogleAuth() : null} */}
          </form>
        </div>
        {!showSignUp ? (
          <span
            className="clickable"
            onClick={() => setShowSignUp(true)}
            style={{
              fontSize: '10px',
              color: 'blue',
              paddingTop: '10px',
              left: '20px',
            }}
          >
            >>register?
          </span>
        ) : (
          <span
            className="clickable"
            onClick={() => setShowSignUp(false)}
            style={{
              fontSize: '10px',
              color: 'blue',
              paddingTop: '10px',
              left: '20px',
            }}
          >
            >>sign in?
          </span>
        )}
      </div>
    </div>
  )
}

export default AuthCard
