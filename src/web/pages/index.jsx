import styles from '/styles/Home.module.scss'
import Navbar from '/components/Navbar'

import useBackground from '/hooks/useBackground'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'

// Shuffled background images:
const BACKGROUNDS = [
  { src: '/backgrounds/bg1.png', opacity: 0.65 },
  { src: '/backgrounds/bg2.png', opacity: 0.75 },
  { src: '/backgrounds/bg3.png', opacity: 0.65 },
  { src: '/backgrounds/bg6.png', opacity: 0.65 },
  { src: '/backgrounds/bg8.png', opacity: 0.7 }
]

// Home page.
export default function Home({ login, squadrons, guild }) {
  // Shuffle through background images.
  useEffect(() => {
    useBackground('/backgrounds/bg8.png', 0.7)
    let bg = null
    const loop = setInterval(() => {
      const list = BACKGROUNDS.filter(f => f.src != bg?.src)
      bg = list[Math.floor(Math.random() * list.length)]
      useBackground(bg.src, bg.opacity)
    }, 5000) // Every 5 seconds.
    return () => clearInterval(loop)
  })

  return (
    <>
      <Navbar login={login} currentPage="Home" />
      <main id={styles.home}>
        <div id={styles.showcase}>
          <h1 id={styles.title}>VIRTUAL PACIFIC AIR COMMAND</h1>
          <h2 id={styles.subtitle}>Come to learn, stay because your aircraft won’t start.</h2>
          <Link href="/squadrons" id={styles.squadrons}>
            { squadrons.map((squadron, index) => {
              return (
                <div
                  key={squadron.short}
                  className={`${styles.squadron} animation-grow`}
                  style={{ animationDelay: `${(index + 1) * 150}ms` }}
                >
                  <Image src={squadron.icon} alt="Squadron emblem" width="80" height="80" />
                  <h4>{squadron.short}</h4>
                </div>
              )
            })}
          </Link>
          <div id={styles.discord}>
            <div id={styles.top}>
              <Image src="/discord.png" alt="Logo" width="45" height="45" />
              <h3>
                VPAC Discord Server<br />
                <span>{guild.members.length} Members</span>
              </h3>
            </div>
            <a href="https://discord.gg/pGauzjDVNs">Join Discord</a>
          </div>
        </div>
        <div id={styles.info}>
          <h2>About The Group</h2>
          <p>
            Welcome to The Virtual Pacific Air Command! Our group aims to be a place for individuals to come together and fly in a semi-realistic environment. The minimum requirement to fly is passing the Checkride for your airframe of choice. New to DCS? No problem. The Commanding Officer of each squadron will walk individuals through training/procedures and documents to help you become the best pilot you can be.<br /><br />
            We are a US Based group made up of the following squadrons:
            <ul>
              { squadrons.map(squadron => {
                return <li key={squadron.name}>{squadron.name} ({squadron.airframes})</li>
              })}
            </ul><br />
            We fly each weekend, with missions on Fridays & Saturdays 10:00pm EST.<br /><br />
            Our requirements for joining are:
            <ul>
              <li>Age must be 16 or over</li>
              <li>Complete a checkride</li>
            </ul>
            <br />
            To join VPAC, please fill out our <a href="https://docs.google.com/forms/d/e/1FAIpQLSf-H5NMl-YfozsIPrCmYUjR2pfxfgvsltpepioKya4A0YSTNg/viewform">application form</a>. Once you have filled out the application, the CO of the airframe you are looking to fly will reach out to you at his earliest convenience (Please allow up to 48 hours for your application to be processed). Please check out our FAQ section below as well as the <Link href="/squadrons">Squadrons</Link> tab to learn more about our group. 
          </p>
        </div>
        <div id={styles.faq}>
          <h2>FAQ: For New Members</h2>
          <div id={styles.questions}>
            <div>
              <p className={styles.question}>Q: How serious are we about milsim?</p>
              <p className={styles.answer}>A: About a 5/10 or 6/10. However, we don't feel the word "milsim" to be an accurate description of our gameplay. We aim to be realistic in most aspects, but do not expect anyone to fly by the book. We understand people are on different skill levels and just want you to try your best. As long as you can communicate with your flight members effectively and operate your aircraft safely, you will be fine!</p>
            </div>
            <div>
              <p className={styles.question}>Q: What do the missions look like</p>
              <p className={styles.answer}>A: We fly 2-3 hour long missions every Friday and Saturday night. Typically 1 mission will be on a free map, while the other will most likely be on Syria or Persian Gulf. There may also be mid-week missions at the discretion of squadron leaders. For information on mission times, see the #mission-announcements channel on Discord.</p>
            </div>
            <div>
              <p className={styles.question}>Q: How do I start flying with VPAC?</p>
              <p className={styles.answer}>A: Before you can join a squadron and start flying in our missions, you will need to schedule and fly a checkride flight with your squadron leader. Once you have filled out <a href="https://docs.google.com/forms/d/e/1FAIpQLSf-H5NMl-YfozsIPrCmYUjR2pfxfgvsltpepioKya4A0YSTNg/viewform">an application</a>, your squadron leader will contact you to schedule a time. Information on the checkride requirements can be found on the <Link href="/squadrons">Squadrons</Link> page.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

// Pass login info to props and any other needed data.
import getSquadrons from '/functions/getSquadrons'
import getGuild from '/functions/getGuild'
export async function getServerSideProps(context) {
  const squadrons = await getSquadrons()
  const guild = await getGuild()
  return { props: { login: context.res.login, squadrons, guild }}
}