import dynamic from 'next/dynamic';

const DAW = dynamic(
  () => import('../components/daw').then((mod) => mod.DAW),
  { ssr: false }
);

export default function IndexPage () {
  return (
    <DAW />
  );
}
