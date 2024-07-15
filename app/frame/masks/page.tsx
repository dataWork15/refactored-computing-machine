import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import '../../style.css'

const NEXT_PUBLIC_URL = 'https://logoslegend.xyz';
const SHARE_URL = `https://warpcast.com/~/compose?text=🎭 Check your MASKS STATS 🎭 Frame created by %40logoslegend&embeds%5B%5D=${NEXT_PUBLIC_URL}/frame/masks`;

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Check Masks',
    },
    {
      label: 'Share',
      action: 'link',
      target: SHARE_URL
    },
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/frame/masks/previewImage.png`,
    aspectRatio: '1:1',
  },
  postUrl: `${NEXT_PUBLIC_URL}/frame/masks/stats`,
});

export const metadata: Metadata = {
  metadataBase: new URL(NEXT_PUBLIC_URL),
  title: 'MASKS STATS',
  openGraph: {
    title: 'MASKS STATS',
    images: [`${NEXT_PUBLIC_URL}/frame/masks/previewImage.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <a className="link" href="https://warpcast.com/logoslegend">@LogosLegend</a>
    </>
  );
}
