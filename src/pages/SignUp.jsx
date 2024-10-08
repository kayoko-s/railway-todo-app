import axios from 'axios'
import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Navigate } from 'react-router-dom'
import { signIn } from '../authSlice'
import Header from '../components/Header'
import { url } from '../const'
import './signUp.scss'

const SignUp = () => {
  const navigate = useNavigate()
  const auth = useSelector((state) => state.auth.isSignIn)
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('') // 修正: useState()に初期値を設定
  const [, setCookie] = useCookies(['token'])
  const handleEmailChange = (e) => setEmail(e.target.value)
  const handleNameChange = (e) => setName(e.target.value)
  const handlePasswordChange = (e) => setPassword(e.target.value)
  const onSignUp = () => {
    const data = {
      email: email,
      name: name,
      password: password,
    }

    axios
      .post(`${url}/users`, data)
      .then((res) => {
        const token = res.data.token
        dispatch(signIn())
        setCookie('token', token, { path: '/' }) // , { path: '/' }を追記
        navigate('/')
      })
      .catch((err) => {
        setErrorMessage(`サインアップに失敗しました。 ${err}`)
      })

    if (auth) return <Navigate to="/" />
  }
  return (
    <div>
      <Header />
      <main className="signup">
        <h2>新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="signup-form">
          <label htmlFor="emailAdd">メールアドレス</label>
          <br />
          <input
            id="emailAdd"
            type="email"
            onChange={handleEmailChange}
            className="email-input"
          />
          <br />
          <label htmlFor="namae">ユーザ名</label>
          <br />
          <input
            id="namae"
            type="text"
            onChange={handleNameChange}
            className="name-input"
          />
          <br />
          <label htmlFor="pass">パスワード</label>
          <br />
          <input
            id="pass"
            type="password"
            onChange={handlePasswordChange}
            className="password-input"
          />
          <br />
          <button type="button" onClick={onSignUp} className="signup-button">
            作成
          </button>
        </form>
      </main>
    </div>
  )
}

export default SignUp
