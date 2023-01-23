import styles from '/styles/Navbar.module.scss'
import UserModal from '/components/UserModal'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

// Login button or current profile.
export default function LoginStatus({ login, className }) {
  const [userModal, setUserModal] = useState(null)

  async function openUserModal(id) {
    setUserModal({ loading: true })
    const result = await fetch(`/api/getUserInfo/${id}`)
    const data = await result.json()
    setUserModal(data)
  }

  return (
    <>
      { userModal && <UserModal user={userModal} close={() => setUserModal(null)} /> }
      { login &&
        <div onClick={() => openUserModal(login.id)} className={`${styles.login_button} ${className}`}>
          <span>{login.nickname}</span>
          <Image src={login.avatar} alt="PFP" width="27" height="27" />
        </div>
      }
      { !login &&
        <div className={`${styles.login_button} ${className}`}>
          <span>Not Logged In</span>
          <Link href="/login">Login</Link>
        </div>
      }
    </>
  )
}