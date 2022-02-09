import type { NextPage } from 'next'
import Head from 'next/head'
import Navbar from '../components/layout/Navbar'
import PrivateRoute from '../components/PrivateRoute'
const Home: NextPage = () => {
  return (
    <PrivateRoute>
      <div className='h-screen w-screen flex bg-slate-200 flex-col'>
        <Head>
          <title>Tele Cloud</title>
          <link rel="icon" href="/favicon.svg" />
        </Head>
        <Navbar />

      </div>
    </PrivateRoute>
  )
}

export default Home
