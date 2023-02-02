import styles from '/styles/Gallery.module.scss'
import Navbar from '/components/Navbar'
import GalleryImage from '/components/GalleryImage'

import useBackground from '/hooks/useBackground'

// Image gallery page.
export default function Gallery({ login, images }) {
  useBackground('/backgrounds/bg5.png', 0.7)
  
  const shuffled = images
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
  let count = 0

  return (
    <>
      <Navbar login={login} currentPage="Gallery" />
      <main id={styles.gallery}>
        <h1>IMAGE GALLERY</h1>
        <div id={styles.images}>
          { shuffled.map(image => {
            count++
            if (count > 96) return // Max amount of images.
            return (
              <GalleryImage image={image} />
            )
          })}
        </div>
      </main>
    </>
  )
}

// Pass login info to props and any other needed data.
import getGuild from '/functions/getGuild'
export async function getServerSideProps(context) {
  const guild = await getGuild()
  const images = guild.galleryImages ? guild.galleryImages : []
  return { props: { login: context.res.login, images }}
}