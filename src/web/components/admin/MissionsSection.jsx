import styles from '/styles/Admin.module.scss'
import SaveChanges from '/components/admin/SaveChanges'
import DeleteItem from '/components/admin/DeleteItem'
import InputText from '/components/admin/InputText'
import { useState, useEffect } from 'react'

// Admin panel - Missions section.
export default function MissionsSection(
  { missions, setMissions, selectedItem, setSelectedItem, setError }
) {
  const [itemData, setItemData] = useState()
  const [name, setName] = useState()
  const [savable, setSavable] = useState(false)
  
  useEffect(() => setSelectedItem(missions[0]?.name), [])

  useEffect(() => {
    const mission = missions.find(f => f.name == selectedItem)
    setItemData(mission)
    setName(mission?.name?.replace(/_/g, ' '))
  }, [selectedItem])

  // Update mission info.
  async function update() {
    setSavable(false)
    const res = await fetch('/api/updateMission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: itemData.name, name })
    })

    const { success, err, newMissions } = await res.json()
    if (success) {
      setMissions(newMissions)
      setSelectedItem(name.replace(/ /g, '_'))
    }
    else setError(err)
  }

  // Delete selected mission.
  async function remove() {
    const res = await fetch('/api/deleteMission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: itemData.name })
    })

    const { success, err, newMissions } = await res.json()
    if (success) {
      setMissions(newMissions)
      setSelectedItem(null)
    }
    else setError(err)
  }

  return (
    <>
      <nav className={styles.items}>
        <header>
          Missions
          <span>{missions.length}</span>
        </header>
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
          <InputText label="Mission Name" value={[name, setName]} save={setSavable} />
          <div className={styles.row}>
            <SaveChanges label="Save Changes" onClick={update} savable={savable} setSavable={setSavable} />
            <DeleteItem label="Delete Mission" onClick={remove} />
          </div>
        </div>
      }
      { !itemData && <h6 className={styles.no_item}>No item currently selected.</h6> }
    </>
  )
}