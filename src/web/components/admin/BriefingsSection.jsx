import styles from '/styles/Admin.module.scss'
import DeleteItem from '/components/admin/DeleteItem'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// Admin panel - Briefings section.
export default function BriefingsSection(
  { briefings, setBriefings, selectedItem, setSelectedItem, setError }
) {
  const [itemData, setItemData] = useState()
  
  useEffect(() => setSelectedItem(briefings[0]?.id), [])

  useEffect(() => {
    const briefing = briefings.find(f => f.id == selectedItem)
    setItemData(briefing)
  }, [selectedItem])

  // Delete selected briefing.
  async function remove() {
    const res = await fetch('/api/deleteBriefing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: itemData.id })
    })

    const { success, err, newBriefings } = await res.json()
    if (success) {
      setBriefings(newBriefings)
      setSelectedItem(null)
    }
    else setError(err)
  }

  return (
    <>
      <nav className={styles.items}>
        <header>
          Briefings
          <span>{briefings.length}</span>
          <button>+ Add New</button>
        </header>
        { briefings.map(briefing => {
          return (
            <button
              key={briefing.id}
              onClick={() => setSelectedItem(briefing.id)}
              className={selectedItem == briefing.id ? styles.selected : ''}
            >
              <div className={briefing.public ? styles.dot_blue : styles.dot_gray}></div>
              <span>{briefing.name.replace(/_/g, ' ')}</span>
            </button>
          )
        })}
      </nav>

      { itemData &&
        <div id={styles.options}>
          <h2>{itemData.name.replace(/_/g, ' ')}</h2>
          <ul>
            <li>Is Public: {itemData.public ? 'TRUE' : 'FALSE'}</li>
            <li>ID: {itemData.id}</li>
          </ul>
          <div className={styles.row}>
            <Link href={`/briefing-editor/${itemData.id}`}>
              <button
                id={styles.save_button}
                className={styles.savable}
              >Open Editor</button>
            </Link>
            <DeleteItem label="Delete Briefing" onClick={remove} />
          </div>
        </div>
      }
      { !itemData && <h6 className={styles.no_item}>No item currently selected.</h6> }
    </>
  )
}