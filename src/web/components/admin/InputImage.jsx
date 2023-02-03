import styles from '/styles/Admin.module.scss'
import cropImage from '/functions/cropImage'

// Admin panel - Image input.
export default function InputImage({ label, value, darkness, save, type }) {
  const id = label.replace(/ /g, '_')
  const [data, setter] = value
  const [dark, setDark] = darkness

  // Transform image based on type prop.
  async function parseImage(file) {
    let [resolution, ratio] = [300, 1] // Default: Square
    if (type == 'banner') [resolution, ratio] = [500, 16/9] // Banner
    setter(await cropImage(file, resolution, ratio))
  }

  return (
    <div className={styles.image_input}>
      <div className={styles.input}>
        <label htmlFor={id}>{label}</label>
        <input
          id={id} type="file" accept="image/*"
          onChange={(e) => { parseImage(e.target.files[0]); save(true) }}
        />
      </div>
      <div className={styles.input}>
        <label htmlFor={`${id}-darkness`}>Darkness</label>
        <input
          id={`${id}-darkness`} type="range" min="0" max="100"
          value={dark} onChange={(e) => { setDark(e.target.value); save(true) }}
        />
      </div>
      <div
        className={`${styles.image} ${styles[type]}`}
        style={{backgroundImage: `url(${data})`, backgroundColor: `rgba(0, 0, 0, ${dark / 100})`}}
      ></div>
    </div>
  )
}