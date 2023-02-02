import styles from '/styles/Admin.module.scss'

import Image from 'next/image'
import { useState, useEffect } from 'react'

// Admin panel - Missions section.
export default function MissionsSection(props) {
  const [section, setSection] = useState('Squadrons')
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