import styles from '/styles/Admin.module.scss'

// Admin panel - Text-block input.
export default function InputBlock({ label, value, save }) {
  const id = label.replace(/ /g, '_')
  const [data, setter] = value

  return (
    <div className={styles.input}>
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id} cols="30" rows="10"
        value={data} onChange={(e) => { setter(e.target.value); save(true) }}
      ></textarea>
    </div>
  )
}