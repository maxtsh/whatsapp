import Head from 'next/head'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
    <div >
      <Head>
        <title>Max Chat</title>
        <meta name="description" content="A Fast-Lightweight Messenger" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar />
    </div >
  )
}
