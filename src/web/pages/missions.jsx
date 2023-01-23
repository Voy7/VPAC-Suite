import styles from '/styles/Missions.module.scss'
import Navbar from '/components/Navbar'

import useBackground from '/hooks/useBackground'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const DEFAULT_MISSIONS_COUNT = 20

// Missions page.
export default function Missions({ login, missions, publicBriefings }) {
  const [missionsCount, setMissionsCount] = useState(DEFAULT_MISSIONS_COUNT)
  
  useEffect(() => useBackground('/assets/bg3.png', 0.75), [])
  
  return (
    <>
      <Navbar login={login} currentPage="Missions" />
      <main id={styles.missions}>
        <h1>UPCOMING MISSION BRIEFINGS</h1>
        { publicBriefings.length <= 0 &&
          <p className={`${styles.no_briefings} animation-grow`}>There are currently no published briefings</p>
        }
        { publicBriefings.map(briefing => {
          return (
            <div className={styles.briefing}>
              <Link href={`/mission/${briefing.name}`}>
                <Image src="/assets/JF17-red.png" alt="Icon" width="40" height="40" />
                <h2>{briefing.name.replaceAll('_', ' ')}</h2>
                <p>View Briefing &rarr;</p>
              </Link>
            </div>
          )
        })}
        <h1>PREVIOUS MISSIONS</h1>
        <div className={styles.container}>
          <table cellSpacing="0" id={styles.missions_list}>
            <tr className={styles.header}>
              <th className={styles.name}>Mission Name</th>
              <th className={styles.participants}>Participants</th>
              <th>A/C Kills</th>
              <th>A/G Kills</th>
              <th>Has Briefing</th>
              <th>Date</th>
            </tr>
            { missions.map((mission, index) => {
              if (index >= missionsCount) return
              return (
                <Link href={`/mission/${mission.name}`} passHref legacyBehavior>
                  <tr className={`${styles.row} animation-fade`}>
                    <td><div>
                      <span className={mission.hasBriefing ? styles.dot_yes : styles.dot_no}></span>
                      {mission.name.replaceAll('_', ' ')}
                    </div></td>
                    <td><div>
                      <Image src="/assets/FA18-blue.png" alt="Icon" width="18" height="18" />
                      {mission.players.length}
                    </div></td>
                    <td><div>
                      <Image src="/assets/SU33-red.png" alt="Icon" width="18" height="18" />
                      {mission.aakills}
                    </div></td>
                    <td><div>
                      <Image src="/assets/motorized-sam-icon-red.png" alt="Icon" width="18" height="18" />
                      {mission.agkills}
                    </div></td>
                    <td><div>
                      <span className={mission.hasBriefing ? styles.dot_yes : styles.dot_no}></span>
                      {mission.hasBriefing ? 'Yes' : 'No'}
                    </div></td>
                    <td>{mission.date}</td>
                  </tr>
                </Link>
              )
            })}
          </table>
        </div>
        { missions.length > DEFAULT_MISSIONS_COUNT &&
          <button
            className={missionsCount == DEFAULT_MISSIONS_COUNT ? styles.btn_less : styles.btn_more}
            onClick={() => setMissionsCount(missionsCount == DEFAULT_MISSIONS_COUNT ? 999 : DEFAULT_MISSIONS_COUNT)}>
              {missionsCount == DEFAULT_MISSIONS_COUNT ? <>&or; More Missions</> : <>&and; Less Missions</>}
          </button>
        }
      </main>
    </>
  )
}

// Fetch login status & info function.
import getLoginInfo from '/functions/getLoginInfo'
import getMissions from '/functions/getMissions'
import getBriefing from '/functions/getBriefing'
export async function getServerSideProps(context) {
  const login = await getLoginInfo(context.req)
  const missions = await getMissions('*')
  const briefings = await getBriefing('*')
  const publicBriefings = briefings.filter(briefing => {
    return briefing.public && !missions.find(f => f.name == briefing.name)
  })
  
  return { props: { login, missions, publicBriefings }}
}