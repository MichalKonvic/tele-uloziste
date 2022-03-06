import { AnimatePresence } from 'framer-motion'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { directoryI } from '../interfaces/DirCards'
import CreateFileMenu from '../src/components/layout/main/Index/CreateFileMenu'
import DirectoryCards from '../src/components/layout/main/Index/DirectoryCards'
import Navbar from '../src/components/layout/Navbar'
import ContentLoader from '../src/components/loaders/ContentLoader'
import PrivateRoute from '../src/components/PrivateRoute'
const Home: NextPage = () => {
  const [createMenu, setCreateMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [])
  const fakeResponseData: directoryI = {
    id: "123_",
    isDir: true,
    parentDir: "",
    path: "root/",
    Title: "root",
    children: [
      {
        id: "123_",
        isDir: true,
        Author: {
          email: "michal.konvicny@teleinformatika.eu"
        },
        Description: "Tohle je prvni slozka",
        parentDir: "root/",
        path: "root/Folder/",
        hrefURL: "/root/Folder/",
        Title: "Složka",
        children: [
        ]
      },
      {
        id: "24ew",
        Title: "Soubor",
        isDir: false,
        Description: "Toto je prvni soubor tohoto projektu",
        Author: {
          email: "michal.konvicny@teleinformatika.eu"
        },
        filename: "souborek.pptx",
        formatIconUrl: "https://image.pngaaa.com/507/543507-middle.png",
        path: "root/",
        hrefURL: "FILES/root/Folder/Soubor.pptx",
        fileURL: "https://onedrive.com/souborek.pptx"
      },

    ]
  }
  return (
    <PrivateRoute>
      <div className='h-screen w-screen flex bg-slate-200 flex-colo overflow-hidden'>
        <Head>
          <title>Tele Cloud</title>
          <link rel="icon" href="/favicon.svg" />
        </Head>
        <Navbar />
        <main className='mt-14 z-0'>
          {createMenu &&
            <CreateFileMenu showMenu={setCreateMenu} key="CREATE_FILE_MENU" />
          }
          {isLoading &&
            <div className='w-screen h-full flexCenter'>
              <ContentLoader />
            </div>
          }
          {!isLoading && <DirectoryCards openCreateMenu={setCreateMenu} directoryData={fakeResponseData} />}
        </main>
      </div>
    </PrivateRoute>
  )
}

export default Home
