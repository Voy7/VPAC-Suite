import styles from '/styles/Modules.module.scss'
import Navbar from '/components/Navbar'

import useBackground from '/hooks/useBackground'

// DCS modules page.
export default function Modules({ login, developers }) {
  useBackground('/backgrounds/bg8.png', 0.75)

  return (
    <>
      <Navbar login={login} currentPage="DCS Modules" />
      <main id={styles.modules}>
        <h1>DCS MODULES</h1>
        <div id={styles.developers}>
          { developers.map((developer, index) => {
            return (
              <div
                key={developer.name}
                className={`${styles.developer} animation-slide-${index % 2}`}
                style={{ animationDuration: index <= 5 ? `${(index + 1) * 250}ms` : `${5 * 250}ms` }}
              >
                <header style={{ backgroundColor: developer.color }}>
                    <img src={developer.image} alt="Developer image" width="40" height="40" />
                    <h2>{developer.name}</h2>
                </header>
                <div className={styles.body}>
                  <ModulesList title="AIRCRAFT" modules={developer.aircraft} />
                  <ModulesList title="MAPS" modules={developer.maps} />
                  <ModulesList title="MISC" modules={developer.others} />
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}

// Each type of module section list.
function ModulesList({ title, modules }) {
  return (
    <>
      { modules.length > 0 &&
        <>
          <h3>{title} ({modules.length})::</h3>
          <table cellSpacing="0">
            { modules.map(module => {
              return (
                // Class will include first word of status, example: "In" or "Released".
                <tr className={styles[module.split(', ')[2].split(" ")[0]]}>
                  <td className={styles.name}>{module.split(', ')[1]}</td>
                  <td className={styles.status}>
                    { module.split(', ')[3] && <a className={styles.source} href={module.split(', ')[3]}>{module.split(', ')[2]}</a> }
                    { !module.split(', ')[3] && <a>{module.split(', ')[2]}</a> }
                  </td>
                </tr>
              )
            })}
          </table>
        </>
      }
    </>
  )
}

// Pass login info to props and any other needed data.
import getDCSModules from '/functions/getDCSModules'
export async function getServerSideProps(context) {
  const rawDevelopers = await getDCSModules()
  const developers = rawDevelopers.map(developer => {
    return {
      name: developer.name,
      image: developer.image,
      color: developer.color,
      aircraft: developer.modules.split('\r\n').filter(module => module[0] == 'A'),
      maps: developer.modules.split('\r\n').filter(module => module[0] == 'M'),
      others: developer.modules.split('\r\n').filter(module => module[0] == 'O')
    }
  })
  return { props: { login: context.res.login, developers }}
}