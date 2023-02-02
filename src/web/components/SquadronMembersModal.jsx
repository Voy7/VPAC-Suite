import styles from '/styles/Squadrons.module.scss'
import UserRow from '/components/UserRow'

import useCloseModal from '/hooks/useCloseModal'
import Image from 'next/image'

// Squadrons members & recruits list modal.
export default function SquadronMembersModal({ squadron, close }) {
  useCloseModal(close)
  console.log(squadron)

  return (
    <div className="modal_bg" onClick={close}>
      <div id={styles.members_modal} onClick={(e) => e.stopPropagation()}>
        <h2>{squadron.name}</h2>
        <h3>MEMBERS ({squadron.members.length}):</h3>
        { squadron.members.map(member => {
          return <UserRow user={member} />
        })}
        <h3>RECRUITS ({squadron.recruits.length}):</h3>
        { squadron.recruits.map(recruit => {
          return <UserRow user={recruit} />
        })}
      </div>
    </div>
  )
}