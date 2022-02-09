import type { NextPage } from 'next'
import Head from 'next/head'
import PrivateRoute from '../components/PrivateRoute'
const Home: NextPage = () => {
  return (
    <PrivateRoute>
      <div className='h-screen w-screen flex justify-center items-center bg-slate-200'>
        <Head>
          <title>Tele Cloud</title>
          <link rel="icon" href="/favicon.svg" />
        </Head>
        Jsi in bracho
      </div>
    </PrivateRoute>
  )
}

export default Home
