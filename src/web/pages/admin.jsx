import styles from '/styles/Admin.module.scss'
import Navbar from '/components/Navbar'
import SquadronsSection from '/components/admin/SquadronsSection'
import MissionsSection from '/components/admin/MissionsSection'
import BriefingsSection from '/components/admin/BriefingsSection'

import useBackground from '/hooks/useBackground'
import Image from 'next/image'
import { useState, useEffect } from 'react'

// Admin panel page.
export default function Admin(props) {
  const [section, setSection] = useState('Squadrons')
  const [selectedItem, setSelectedItem] = useState(0)
  const [error, setError] = useState()
  const [squadrons, setSquadrons] = useState(props.squadrons)
  const [missions, setMissions] = useState(props.missions)
  const [briefings, setBriefings] = useState(props.briefings)

  useBackground('/backgrounds/bg7.png', 0.4)

  return (
    <>
      <Navbar login={props.login} currentPage="Admin" />
      <main id={styles.admin}>
        <nav id={styles.sections}>
          <button className={section == 'Squadrons' ? styles.selected : ''} onClick={() => setSection('Squadrons')}>Squadrons</button>
          <button className={section == 'Missions' ? styles.selected : ''} onClick={() => setSection('Missions')}>Missions</button>
          <button className={section == 'Briefings' ? styles.selected : ''} onClick={() => setSection('Briefings')}>Briefings</button>
          <button className={section == 'Modules' ? styles.selected : ''} onClick={() => setSection('Modules')}>DCS Modules</button>
        </nav>
        <div id={styles.body}>
          { section == 'Squadrons' &&
            <SquadronsSection
              squadrons={squadrons} setSquadrons={setSquadrons}
              selectedItem={selectedItem} setSelectedItem={setSelectedItem} setError={setError}
            />
          }
          { section == 'Missions' &&
            <MissionsSection
              missions={missions} setMissions={setMissions}
              selectedItem={selectedItem} setSelectedItem={setSelectedItem} setError={setError}
            />
          }
          { section == 'Briefings' &&
            <BriefingsSection
              briefings={briefings} setBriefings={setBriefings}
              selectedItem={selectedItem} setSelectedItem={setSelectedItem} setError={setError}
            />
          }
        </div>
        { error &&
          <div className="modal_bg" onClick={() => setError(null)}>
            <div id={styles.error_modal} onClick={(e) => e.stopPropagation()}>
              <h2>An Error Occurred</h2>
              <p>{error}</p>
              <button id={styles.cancel} onClick={() => setError(null)}>Ok</button>
            </div>
          </div>
        }
      </main>
    </>
  )
}

// Pass login info to props and any other needed data.
import getSquadrons from '/functions/getSquadrons'
import getMissions from '/functions/getMissions'
import getBriefings from '/functions/getBriefings'
export async function getServerSideProps(context) {
  const squadrons = await getSquadrons('*')
  const missions = await getMissions('*')
  const briefings = await getBriefings('*')
  return { props: { login: context.res.login, squadrons, missions, briefings }}
}