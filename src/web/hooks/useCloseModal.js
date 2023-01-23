import { useEffect } from 'react'

// Run the given function (close modal) when user presses ESCAPE.
export default function useCloseModal(closeFunction) {
  useEffect(() => {
    function handler(event) {
      console.log(event.key)
      if (event.key != 'Escape') return
      closeFunction()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}