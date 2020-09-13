import '../css/antd.less'

import Head from 'next/head'
import dynamic from 'next/dynamic'

import Githubcorner from '../components/Githubcorner'

const Main = dynamic(() => import('../components/Main'), { ssr: false })

export default function Index() {
  return (
    <div>
      <Head>
        <title>BORA visual</title>
        <meta
          name="description"
          content="Data science y visualizaciones aplicadas al Boletín Oficial de la República Argentina, para poder entender un poquito mejor qué esta pasando ahí adentro"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="BORA Visual" />
        <meta
          property="og:description"
          content="Data science y visualizaciones aplicadas al Boletín Oficial de la República Argentina, para poder entender un poquito mejor qué esta pasando ahí adentro"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://boravisual.vercel.app/og.png" />
        <meta property="og:image:width" content="620" />
        <meta property="og:image:height" content="620" />
      </Head>
      <Githubcorner />
      <Main />
    </div>
  )
}
