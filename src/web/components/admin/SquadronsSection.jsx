import styles from '/styles/Admin.module.scss'
import SaveChanges from '/components/admin/SaveChanges'
import InputText from '/components/admin/InputText'
import InputBlock from '/components/admin/InputBlock'
import InputImage from '/components/admin/InputImage'
import InputColor from '/components/admin/InputColor'

import Image from 'next/image'
import { useState, useEffect } from 'react'

// Admin panel - Squadrons section.
export default function SquadronsSection(
  { squadrons, setSquadrons, selectedItem, setSelectedItem }
) {
  const [itemData, setItemData] = useState()
  const [banner, setBanner] = useState()
  const [darkness, setDarkness] = useState()
  const [color, setColor] = useState()
  const [callsigns, setCallsigns] = useState()
  const [airframes, setAirframes] = useState()
  const [description, setDescription] = useState()
  const [checkride, setCheckride] = useState()
  const [savable, setSavable] = useState(false)

  useEffect(() => {
    console.log('selected item')
    setSavable(false)
    const squadron = squadrons.find(f => f.short == selectedItem)
    setItemData(squadron)
    setBanner(squadron?.banner)
    setDarkness(squadron?.darkness)
    setColor(squadron?.color)
    setDescription(squadron?.description)
    setCallsigns(squadron?.callsigns)
    setAirframes(squadron?.airframes)
    setCheckride(squadron?.checkride)
  }, [selectedItem])

  // useEffect(() => setSelectedItem(squadrons[0]?.short), [])

  // Update squadron info.
  async function update() {
    setSavable(false)
    const res = await fetch('/api/updateSquadron', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: itemData.short,
        banner,
        darkness,
        color,
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

      { itemData &&
        <div id={styles.options}>
          <h2>{itemData.name}</h2>
          <div className={styles.row}>
            <InputImage label="Banner Image" value={[banner, setBanner]} darkness={[darkness, setDarkness]} save={setSavable} type="banner" />
            <InputColor label="Border Color" value={[color, setColor]} save={setSavable} />
          </div>
          <div className={styles.row}>
            <InputText label="Callsigns" value={[callsigns, setCallsigns]} save={setSavable} />
            <InputText label="Airframes" value={[airframes, setAirframes]} save={setSavable} />
          </div>
          <InputBlock label="Description" value={[description, setDescription]} save={setSavable} />
          <InputBlock label="Checkride Info" value={[checkride, setCheckride]} save={setSavable} />
        </div>
      }
      { !itemData && <h6 className={styles.no_item}>No item currently selected.</h6> }
    </>
  )
}