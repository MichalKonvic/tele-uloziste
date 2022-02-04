import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react';
import DotLoader from '../components/loaders/DotLoader';
import Router from 'next/router';

interface responseDataI {
  statusCode: number,
  message: string,
  token: string,
  expiresIn: number,
  email: string,
  permissions: Object
}

const getAccessTokenRequest = async () => {
  const requestResponse: responseDataI = await (await fetch(`/api/auth/accessToken`, {
    method: 'POST',
    credentials: "include",
    headers: {
      'Content-Type': 'application/json'
    }
  })).json();
  // TODO save response
  setTimeout(() => {
    getAccessTokenRequest();
  }, requestResponse.expiresIn * 1000);
}

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState({
    email: "",
    permissions: "",
    accessToken: "",
    loginRequired: undefined
  });
  // TODO handle access token
  // @ts-ignore
  if (user.loginRequired === undefined) return (<div className='flex justify-center items-center w-screen h-screen'><DotLoader></DotLoader></div>);
  // @ts-ignore
  if (user.loginRequired === true) {
    Router.push("/login");
    return <Component {...pageProps} />;
  }
  return <Component {...pageProps} />
}

export default MyApp
