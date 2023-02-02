import styles from '/styles/Navbar.module.scss'
import LoginStatus from '/components/LoginStatus'
import Image from 'next/image'
import Link from 'next/link'

const pages = [
  { name: 'Home', href: '/' },
  { name: 'Squadrons', href: '/squadrons' },
  { name: 'Missions', href: '/missions' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'DCS Modules', href: '/modules' }
]

// Global header navigation bar.
export default function Navbar({ login, currentPage }) {
  return (
    <nav id={styles.navbar}>
      <Link href="/" id={styles.logo} className="desktop">
        <Image src="/logo.png" alt="Website Logo" width="80" height="80" />
      </Link>
      <div id={styles.center}>
        <div id={styles.title} className="desktop">
          <span>Virtual Pacific Air Command</span>
        </div>
        <div id={styles.title} className="mobile">
          <Image src="/logo.png" alt="Website Logo" className="mobile" width="25" height="25" />
          <span>VPAC</span>
          <LoginStatus login={login} className="mobile" />
        </div>
        <div id={styles.pages}>
          { pages.map(page => {
            return <Link key={page.name} href={page.href} className={currentPage == page.name ? styles.selected : ''}>{page.name}</Link>
          })}
          { login?.isAdmin &&
            <Link href="/admin" className={currentPage == 'Admin' ? styles.selected : ''}>Admin</Link>
          }
        </div>
      </div>
      <LoginStatus login={login} className="desktop" />
    </nav>
  )
}