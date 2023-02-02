import styles from '/styles/Admin.module.scss'
import SaveChanges from '/components/admin/SaveChanges'

import Image from 'next/image'
import { useState, useEffect } from 'react'

// Admin panel - Squadrons section.
export default function SquadronsSection(
  { squadrons, setSquadrons, selectedItem, setSelectedItem }
) {
  const [itemData, setItemData] = useState()
  const [description, setDescription] = useState()
  const [callsigns, setCallsigns] = useState()
  const [airframes, setAirframes] = useState()
  const [checkride, setCheckride] = useState()
  const [savable, setSavable] = useState(false)

  useEffect(() => {
    setSavable(false)
    const squadron = squadrons.find(f => f.short == selectedItem)
    setItemData(squadron)
    setDescription(squadron?.description)
    setCallsigns(squadron?.callsigns)
    setAirframes(squadron?.airframes)
    setCheckride(squadron?.checkride)
  }, [selectedItem])

  // Update squadron info.
  async function update() {
    setSavable(false)
    const res = await fetch('/api/updateSquadron', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: itemData.short,
        description,
        callsigns,
        airframes,
        checkride
      })
    })

    const { success, newSquadrons } = await res.json()
    if (success) setSquadrons(newSquadrons)
  }

  return (
    <>
      <SaveChanges savable={savable} setSavable={setSavable} onClick={update} />
      <nav className={styles.items}>
        <header>Squadrons</header>
        { squadrons.map(squadron => {
          return (
            <button
              key={squadron.short}
              onClick={() => setSelectedItem(squadron.short)}
              className={selectedItem == squadron.short ? styles.selected : ''}
            >
              <Image src={squadron.icon} alt="" width="20" height="20" />
              <span>{squadron.name}</span>
            </button>
          )
        })}
      </nav>

      { itemData && // Options
        <div id={styles.options}>
          <h2>{itemData.name}</h2>
          <label htmlFor="description">Squadron Description</label>
          <textarea
            id="description" cols="30" rows="10"
            value={description}
            onChange={(e) => { setDescription(e.target.value); setSavable(true) }}
          ></textarea>
          <label htmlFor="callsigns">Squadron Callsigns</label>
          <input
            type="text" id="callsigns"
            value={callsigns}
            onChange={(e) => { setCallsigns(e.target.value); setSavable(true) }}
          />
          <label htmlFor="airframes">Squadron Airframes</label>
          <input
            type="text" id="airframes"
            value={airframes}
            onChange={(e) => { setAirframes(e.target.value); setSavable(true) }}
          />
          <label htmlFor="checkride">Squadron Checkride Info</label>
          <textarea
            id="checkride" cols="30" rows="10"
            value={checkride}
            onChange={(e) => { setCheckride(e.target.value); setSavable(true) }}
          ></textarea>
        </div>
      }
      { !itemData && <h6 className={styles.no_item}>No item currently selected.</h6> }
    </>
  )
}