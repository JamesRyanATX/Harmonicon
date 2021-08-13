import Head from 'next/head';
import dynamic from 'next/dynamic';

const Player = dynamic(
  () => import('../components/player').then((mod) => mod.Player),
  { ssr: false }
);

export default function Home() {
  return (
    <div>
      <Head>
        <title>@composer/web</title>
      </Head>
      <Player />
    </div>
  )
}
