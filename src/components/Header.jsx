import React from 'react'
import { useCookies } from 'react-cookie'
import { useSelector, useDispatch } from 'react-redux' // 末尾の"/es/exports"を削除
import { useNavigate } from 'react-router-dom'
import { signOut } from '../authSlice'
import './header.scss'

const Header = () => {
  const auth = useSelector((state) => state.auth.isSignIn)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [,,removeCookie] = useCookies([]) // "cookies, setCookie," を削除
  const handleSignOut = () => {
    dispatch(signOut())
    removeCookie('token')
    navigate('/signin')
  }

  return (
    <header className="header">
      <h1>Todoアプリ</h1>
      {auth ? (
        <button onClick={handleSignOut} className="sign-out-button">
          サインアウト
        </button>
      ) : (
        <></>
      )}
    </header>
  )
}

export default Header
