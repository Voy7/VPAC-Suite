import styles from '/styles/Admin.module.scss'
import useCloseModal from '/hooks/useCloseModal'
import { useState, useEffect } from 'react'

// Admin panel - Delete item button.
export default function DeleteItem({ label, onClick }) {
  const [openModal, setOpenModal] = useState(false)
  const [saving, setSaving] = useState(false)

  useCloseModal(close)

  function close() {
    setOpenModal(false)
  }

  return (
    <>
      <button id={styles.delete_button} onClick={() => setOpenModal(true)}>{label}</button>
      { openModal &&
        <div className="modal_bg" onClick={close}>
          <div id={styles.delete_modal} onClick={(e) => e.stopPropagation()}>
            <h2>{label}?</h2>
            <p>Are you sure you want to delete this?</p>
            <button id={styles.cancel} onClick={close}>No, Cancel</button>
            <button id={styles.delete} onClick={onClick}>Yes, Delete It</button>
          </div>
        </div>
      }
    </>
  )
}