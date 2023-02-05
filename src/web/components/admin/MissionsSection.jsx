import styles from '/styles/Admin.module.scss'
import DeleteItem from '/components/admin/DeleteItem'
import { useState, useEffect } from 'react'

// Admin panel - Missions section.
export default function MissionsSection(
  { missions, setMissions, selectedItem, setSelectedItem }
) {
  const [itemData, setItemData] = useState()
  const [savable, setSavable] = useState(false)

  useEffect(() => {
    const mission = missions.find(f => f.name == selectedItem)
    setItemData(mission)
  }, [selectedItem])

  // useEffect(() => setSelectedItem(squadrons[0]?.short), [])

  // Delete selected mission.
  async function remove() {
    // setSavable(false)
    const res = await fetch(`/api/deleteMission/${itemData.name}`, {
      method: 'POST'
    })

    const { success, newMissions } = await res.json()
    if (success) setMissions(newMissions)
  }

  return (
    <>
      <nav className={styles.items}>
        <header>Missions</header>
        { missions.map(mission => {
          return (
            <button
              key={mission.name}
              onClick={() => setSelectedItem(mission.name)}
              className={selectedItem == mission.name ? styles.selected : ''}
            >
              <div className={mission.hasBriefing ? styles.dot_blue : styles.dot_gray}></div>
              <span>{mission.name.replace(/_/g, ' ')}</span>
            </button>
          )
        })}
      </nav>

      { itemData &&
        <div id={styles.options}>
          <h2>{itemData.name.replace(/_/g, ' ')}</h2>
          <ul>
            <li>Has Briefing: {itemData.hasBriefing ? 'TRUE' : 'FALSE'}</li>
            <li>Start Date: {itemData.date}</li>
            <li>Players: {itemData.players.length}</li>
          </ul>
          <DeleteItem savable={savable} setSavable={setSavable} onClick={remove} />
        </div>
      }
      { !itemData && <h6 className={styles.no_item}>No item currently selected.</h6> }
    </>
  )
}