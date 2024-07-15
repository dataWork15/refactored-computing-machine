import type { Metadata } from 'next';
import './style.css'

export const metadata: Metadata = {
  title: 'Logos',
};

export default function Page() {
  return (
    <>
      <a className="link" href="https://warpcast.com/logoslegend">@LogosLegend</a>
    </>
  );
}
