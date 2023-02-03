import styles from '/styles/Admin.module.scss'

// Admin panel - Color picker input.
export default function InputColor({ label, value, save }) {
  const id = label.replace(/ /g, '_')
  const [data, setter] = value

  return (
    <div className={styles.input}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id} type="color"
        value={data} onChange={(e) => { setter(e.target.value); save(true) }}
      />
    </div>
  )
}