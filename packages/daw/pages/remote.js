import Head from 'next/head';
import dynamic from 'next/dynamic';

const Remote = dynamic(
  () => import('../components/remote').then((mod) => mod.Remote),
  { ssr: false }
);

export default function RemotePage () {
  return (
    <div>
      <Head>
        <title>@composer/web</title>
      </Head>
      <Remote />
    </div>
  )
}
