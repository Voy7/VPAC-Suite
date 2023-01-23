import '/styles/globals.scss'

export default function App({ Component, pageProps }) {
  return (
    <>
      <div id="bg"></div>
      <Component {...pageProps} />
    </>
  )
}
