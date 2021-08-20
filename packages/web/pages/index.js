import dynamic from 'next/dynamic';
import { Logo } from '../components/logo';

const DAW = dynamic(
  () => import('../components/daw').then((mod) => mod.DAW),
  { ssr: false }
);

export default function IndexPage () {
  return (
    <DAW logo={Logo} />
  );
}
