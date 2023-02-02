import styles from '/styles/UserRow.module.scss'
import Image from 'next/image'

// User row display + current status.
export default function UserRow({ user }) {
  return (
    <div className={styles.user}>
      <div className={styles.left}>
        <Image src={user.avatar} alt="PFP" width="20" height="20" />
        <span>{user.nickname}</span>
      </div>
      <div className={styles.dot}></div>
    </div>
  )
}