import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { SetStateAction, useEffect, useState } from 'react'
import { displayDataI } from '../../interfaces/DirCards'
import CreateFileMenu from '../../src/components/layout/main/Index/CreateFileMenu'
import DirectoryCards from '../../src/components/layout/main/Index/DirectoryCards'
import PathBar from '../../src/components/layout/main/PathBar'
import Navbar from '../../src/components/layout/Navbar'
import ContentLoader from '../../src/components/loaders/ContentLoader'
import PrivateRoute from '../../src/components/PrivateRoute'
import useAuth from '../../src/hooks/useAuth'
const Home: NextPage = () => {
  const router = useRouter();
  const { dirId, afterReload } = router.query;
  const [createMenu, setCreateMenu] = useState(false);
  const [displayData, setDisplayData] = useState<displayDataI>({
    breadcrumb: [],
    dirs: [],
    files: []
  });
  const [isLoading, setIsLoading] = useState(true);
  // TODO maybe @ts-ignore
  const [, , refreshAccessToken, , tokenGetter]: [any, any, () => Promise<void>, any, () => string] = useAuth()
  useEffect(() => {
    if (!dirId) return;
    //Database display data fetch
    (async () => {
      const requestDirId = dirId == "R" ? "" : dirId;
      const displayDataResponse: {
        statusCode: number,
        message: string,
        data: displayDataI
      } = await (await fetch("/api/data/getDirData", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: tokenGetter(),
          dirId: requestDirId
        })
      })).json();
      if (displayDataResponse.statusCode === 404) {
        router.replace(`/404`);
        return;
      }
      if (displayDataResponse.statusCode === 401) {
        if (afterReload) {
          //TODO show error message
          return;
        }
        await refreshAccessToken();
        router.push(`${dirId}?afterReload=true`);
      }
      if (displayDataResponse.statusCode === 500 || !displayDataResponse.data) {
        //TODO show error message
        return;
      }
      setDisplayData(displayDataResponse.data);
      setIsLoading(false);
    })()
  }, [dirId]);


  return (
    <PrivateRoute>
      <div className='h-screen w-screen flex bg-slate-200 flex-col overflow-hidden'>
        <Head>
          <title>Tele Cloud</title>
          <link rel="icon" href="/favicon.svg" />
        </Head>
        <Navbar />
        <PathBar breadcrumbArray={displayData.breadcrumb} />
        <main className='mt-32 z-0'>
          {createMenu &&
            <CreateFileMenu showMenu={setCreateMenu} key="CREATE_FILE_MENU" />
          }
          {isLoading &&
            <div className='w-screen h-full flexCenter'>
              <ContentLoader />
            </div>
          }
          {!isLoading && <DirectoryCards openCreateMenu={setCreateMenu} directoryData={displayData} />}
        </main>
      </div>
    </PrivateRoute>
  )
}

export default Home
