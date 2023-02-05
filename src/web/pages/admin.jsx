import styles from '/styles/Admin.module.scss'
import Navbar from '/components/Navbar'
import SquadronsSection from '/components/admin/SquadronsSection'
import MissionsSection from '/components/admin/MissionsSection'

import useBackground from '/hooks/useBackground'
import Image from 'next/image'
import { useState, useEffect } from 'react'

// Admin panel page.
export default function Admin(props) {
  const [section, setSection] = useState('Squadrons')
  const [selectedItem, setSelectedItem] = useState(0)
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
              selectedItem={selectedItem} setSelectedItem={setSelectedItem}
            />
          }
          { section == 'Missions' &&
          <MissionsSection
            missions={missions} setMissions={setMissions}
            selectedItem={selectedItem} setSelectedItem={setSelectedItem}
          />
        }
        </div>
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