import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { createTextImageAndOverlay } from '../../../../utils/createTextAndImageOverlay.js';

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();

  const { fid } = body.untrustedData;

  const newImage = await createTextImageAndOverlay(fid);

  const NEXT_PUBLIC_URL = 'https://logoslegend.xyz';
  const SHARE_URL = `https://warpcast.com/~/compose?text=🎭 Check your MASKS STATS 🎭 Frame created by %40logoslegend&embeds%5B%5D=${NEXT_PUBLIC_URL}/frame/masks`;


  return new Response(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Check Masks',
        },
        {
          label: 'Share',
          action: 'link',
          target: `${SHARE_URL}/${fid}/${Date.now()}`
        },
      ],
      image: {
        src: newImage,
        aspectRatio: '1:1',
      },
      postUrl: `${NEXT_PUBLIC_URL}/frame/masks/stats`,
    }),
  );
}