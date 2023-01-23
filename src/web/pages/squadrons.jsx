import styles from '/styles/Squadrons.module.scss'
import Navbar from '/components/Navbar'

import useBackground from '/hooks/useBackground'
import Image from 'next/image'

// Home page.
export default function Squadrons({ login, squadrons }) {
  useBackground('/assets/bg3.png', 0.7)
  
  console.log(squadrons)
  return (
    <>
      <Navbar login={login} currentPage="Squadrons" />
      <main id={styles.squadrons}>
        <h1>SQUADRONS</h1>
        <div id={styles.squadrons_list}>
          { squadrons.map((squadron, index) => {
            return (
              <div
                key={squadron.short}
                data-squadron={squadron.short}
                className={`${styles.squadron} animation-fade`}
                style={{ animationDelay: `${(index + 1) * 150}ms` }}
              >
                <div>
                  <header data-squadron={squadron.short}>
                    <h2>{squadron.name}</h2>
                    <h3>{squadron.airframes.join(', ')}</h3>
                  </header>
                  <p>{squadron.description}</p>
                </div>
                <div>
                  <h4>SQUADRON MEMBERS ({squadron.members.length}):</h4>
                  <div className={styles.members}>
                    {squadron.members.map(member => {
                      return (
                        <Image src={member.avatar} alt="PFP" width="20" height="20" />
                      )
                    })}
                  </div>
                  <h4>COMMON CALLSIGNS:</h4>
                  <div className={styles.callsigns}>
                    { squadron.callsigns.map(callsign => {
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

// Fetch login status & info function.
import getLoginInfo from '/functions/getLoginInfo'
import getSquadrons from '/functions/getSquadrons'
export async function getServerSideProps(context) {
  const login = await getLoginInfo(context.req)
  const squadrons = await getSquadrons()
  return { props: { login, squadrons }}
}