import styles from '/styles/Home.module.scss'
import Navbar from '/components/Navbar'

import useBackground from '/hooks/useBackground'
import Image from 'next/image'

// Admin panel page.
export default function Admin({ login }) {
  useBackground('/assets/bg7.png', 0.4)

  return (
    <>
      <Navbar login={login} currentPage="Admin" />
      <main id={styles.home}>
        <h1>ADMIN PANEL</h1>
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