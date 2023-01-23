import styles from '/styles/Login.module.scss'
import Navbar from '/components/Navbar'

import Router from 'next/router'
import { useState } from 'react'

// Login page.
export default function Login({ login }) {
  const [wrongPassword, setWrongPassword] = useState(false)

  async function submitLogin(event) {
    event.preventDefault()
    const result = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: event.target[0].value })
    })
    
    const data = await result.json()
    if (data.success == true) Router.reload()
    else setWrongPassword(true)
  }

  return (
    <>
      <Navbar login={login} currentPage="Login" />
      <h2 id="header-text">LOGIN</h2>
      <main id={styles.login}>
        <form onSubmit={submitLogin}>
          <label htmlFor="login">Enter your secret key / password</label>
          <input type="password" id="key" name="key" required />
          <button type="submit">Login</button>
          { wrongPassword && <p>Invalid Password / Key.</p> }
        </form>
      </main>
    </>
  )
}

// Fetch login status & info function.
import getLoginInfo from '/functions/getLoginInfo'
export async function getServerSideProps(context) {
  const login = await getLoginInfo(context.req)
  return { props: { login }}
}