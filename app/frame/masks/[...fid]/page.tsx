import { cache } from 'react';
import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { createTextImageAndOverlay } from '../../../../utils/createTextAndImageOverlay.js';
import '../../../style.css'

type Params = {
  params: {
    fid: [fid: string]
  }
}

const NEXT_PUBLIC_URL = 'https://logoslegend.xyz';
const SHARE_URL = `https://warpcast.com/~/compose?text=🎭 Check your MASKS STATS 🎭 Frame created by %40logoslegend&embeds%5B%5D=${NEXT_PUBLIC_URL}/frame/masks`;

const regExp = /^\d+$/; //only number
let pasteImage: string;

const getImage = cache(async (fid: string) => {
  const currentNumber = regExp.test(fid) && +fid < 2000000;
  if (currentNumber) {
    const userImage = await createTextImageAndOverlay(fid);
    return userImage;
  } else {
    return `${NEXT_PUBLIC_URL}/frame/masks/notFound.png`;
  }
});

  export async function generateMetadata({params: {fid: [fid]}}: Params) {

    const isCurrentNumber = regExp.test(fid) && +fid < 2000000;

    const newImage = await getImage(fid);
    const shareUrl = isCurrentNumber ? `${SHARE_URL}/${fid}/${Date.now()}` : SHARE_URL;
    
    const frameMetadata = getFrameMetadata({
      buttons: [
        {
          label: 'Check Masks',
        },
        {
          label: 'Share',
          action: 'link',
          target: shareUrl
        },
      ],
      image: {
        src: newImage,
        aspectRatio: '1:1',
      },
      postUrl: `${NEXT_PUBLIC_URL}/frame/masks/stats`,
    });
    
    return {
      metadataBase: new URL(NEXT_PUBLIC_URL),
      title: 'MASKS STATS',
      openGraph: {
        title: 'MASKS STATS',
        images: [`${NEXT_PUBLIC_URL}/frame/masks/previewImage.png`],
      },
      other: {
        ...frameMetadata,
      },
    }
  }

export default async function Page({params: {fid: [fid]}}: Params) {
  const pasteImage = await getImage(fid);
  return (
    <>
      <img className="img" src={pasteImage}/>
      <div className="link-container">
        <a className="link" href="https://warpcast.com/logoslegend">@LogosLegend</a>
      </div>
    </>
  );
}