import styles from '/styles/Admin.module.scss'
import { useState, useEffect } from 'react'

// Admin panel - Save changes button.
export default function SaveChanges({ savable, setSavable, onClick }) {
  const [saving, setSaving] = useState(false)

  return (
    <>
      {savable &&
        <div id={styles.save_changes}>
          <span>You have unsaved changes.</span>
          <button onClick={onClick}>Save Changes</button>
        </div>
      }
    </>
  )
}