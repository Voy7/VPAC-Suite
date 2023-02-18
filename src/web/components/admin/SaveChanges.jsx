import styles from '/styles/Admin.module.scss'
import { useState, useEffect } from 'react'

// Admin panel - Save changes button.
export default function SaveChanges({ label, onClick, savable, setSavable }) {
  const [saving, setSaving] = useState(false)

  return (
    <>
      <button
        id={styles.save_button}
        className={savable ? styles.savable : ''}
        onClick={savable ? onClick : null}
      >{label}</button>
      { savable &&
        <div id={styles.save_popup}>
          <span>You have unsaved changes.</span>
          <button onClick={onClick}>Save Changes</button>
        </div>
      }
    </>
  )
}