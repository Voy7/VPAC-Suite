import styles from '/styles/Squadrons.module.scss'
import Navbar from '/components/Navbar'
import SquadronMembersModal from '/components/SquadronMembersModal'

import useBackground from '/hooks/useBackground'
import Image from 'next/image'
import { useState } from 'react'

// Home page.
export default function Squadrons({ login, squadrons }) {
  const [membersModal, setMembersModal] = useState(null)

  useBackground('/backgrounds/bg3.png', 0.7)
  
  return (
    <>
      <Navbar login={login} currentPage="Squadrons" />

      { membersModal && <SquadronMembersModal squadron={membersModal} close={() => setMembersModal(null)} /> }

      <main id={styles.squadrons}>
        <h1>SQUADRONS</h1>
        <div id={styles.squadrons_list}>
          { squadrons.map((squadron, index) => {
            return (
              <div
                key={squadron.short}
                data-squadron={squadron.short}
                className={`${styles.squadron} animation-fade`}
                style={{ borderColor: squadron.color, animationDelay: `${(index + 1) * 150}ms` }}
              >
                <div>
                  <header data-squadron={squadron.short} style={{backgroundImage: `url(${squadron.banner})`, backgroundColor: `rgba(0, 0, 0, ${squadron.darkness / 100})`}}>
                    <h2>{squadron.name}</h2>
                    <h3>{squadron.airframes}</h3>
                  </header>
                  <p>{squadron.description}</p>
                </div>
                <div>
                  <h4>SQUADRON MEMBERS ({squadron.members.length}):</h4>
                  <div className={styles.members} onClick={() => setMembersModal(squadron)}>
                    { squadron.members.map(member => {
                      return (
                        <Image src={member.avatar} alt="PFP" width="20" height="20" />
                      )
                    })}
                  </div>
                  <h4>COMMON CALLSIGNS:</h4>
                  <div className={styles.callsigns}>
                    { squadron.callsigns.split(',').map(callsign => {
                      return (
                        <span>{callsign}</span>
                      )
                    })}
                  </div>
                  <div className={styles.buttons}>
                    <a href="/">APPLY TO JOIN</a>
                    <button>CHECKRIDE INFO</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}

// Pass login info to props and any other needed data.
import getSquadrons from '/functions/getSquadrons'
export async function getServerSideProps(context) {
  const squadrons = await getSquadrons()
  return { props: { login: context.res.login, squadrons }}
}