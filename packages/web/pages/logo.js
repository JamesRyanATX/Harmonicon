import Head from 'next/head';
import { Logo } from '../components/logo';

export default function LogoPage () {
  return (
    <div>
      <Head>
        <title>Harmonicon</title>
      </Head>
      <Logo speed={5} />
    </div>
  )
}
