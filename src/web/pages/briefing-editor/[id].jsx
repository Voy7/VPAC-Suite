import styles from '/styles/BriefingEditor.module.scss'
import Navbar from '/components/Navbar'

import useBackground from '/hooks/useBackground'
import { useState, useEffect } from 'react'

// Briefing editor pages.
export default function BriefingEditor({ login, briefing }) {
  const [section, setSection] = useState('Squadrons')
  
  useBackground('/backgrounds/bg7.png', 0.4)

  return (
    <>
      <Navbar login={props.login} currentPage="Briefing Editor" />
      <main id={styles.editor}>
        
      </main>
    </>
  )
}

// Pass login info to props and any other needed data.
import getBriefings from '/functions/getBriefings'
export async function getServerSideProps(context) {
  const briefing = await getBriefings(context.params.id)
  return { props: { login: context.res.login, briefing }}
}

// All paths for server-side rendering.
export async function getStaticPaths() {
  const briefings = await getBriefings('*')
  const paths = briefings.map(briefing => {
    return { params: { id: `${briefing.id}` } }
  })
  return { paths, fallback: 'blocking' }
}