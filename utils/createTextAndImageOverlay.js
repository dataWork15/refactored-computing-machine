import { createCanvas, registerFont } from 'canvas';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import {Buffer as Buffer} from 'safe-buffer'
import fetch from 'node-fetch'
const noLogo = path.resolve('./public/frame/masks/noLogo.png');
const NEXT_PUBLIC_URL = 'https://logoslegend.xyz';
const balan = 'balnance';

export const createTextImageAndOverlay = async (fid) => {
  const roundedMask = Buffer.from(
    '<svg><rect x="0" y="0" width="120" height="120" rx="100" ry="100"/></svg>'
  );

  async function bitmapImg(profileImage) {
    const profileImageBuffer = await profileImage.arrayBuffer();
    return sharp(profileImageBuffer)
      .resize(120, 120)
      .composite([{ input: roundedMask, blend: 'dest-in' }])
      .png()
      .toBuffer()
  }

  async function vectorImg(profileImage) {
    return noLogo;
  }

  async function getImage(url) {
    const profileImage = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
      },
    });

    const contentType = profileImage.headers.get("Content-Type")
    if (contentType.toLowerCase().includes("svg")) {
      return vectorImg(profileImage)
    }
    return bitmapImg(profileImage)
  }

  async function getMasks() {
    const [dataBalance, dataRank, dataLogo] = await Promise.allSettled([
      fetch('https://app.masks.wtf/api/balance?fid=' + fid).then(res => {return res.json()}),
      fetch('https://app.masks.wtf/api/rank?fid=' + fid).then(res => {return res.json()}),
      fetch('https://hub.pinata.cloud/v1/userDataByFid?fid=' + fid + '&user_data_type=1').then(res => {return res.json()}),
    ]).then(res => {
      return res;
    })

    function checkDataMasks(data) {
      if (data.status !== 'rejected') {
        if (!data.value.hasOwnProperty('error')) {
          return data.value;
        }
        return 404;
      }
      return 503;
    }

    const balance = checkDataMasks(dataBalance)
    const rank = checkDataMasks(dataRank)
    const urlImage = dataLogo.value?.data?.userDataBody.value || 404;

    return [balance, rank, urlImage];
  }

  const [balance, rank, urlImage] = await getMasks();

  if (balance === 503) return `${NEXT_PUBLIC_URL}/frame/masks/errorImage.png`
  if (balance === 404) return `${NEXT_PUBLIC_URL}/frame/masks/notFound.png`

  const {username, weeklyAllowance, remainingAllowance, masks} = balance;
  const currentRank = rank !== 503 && rank !== 404 ? rank.rank : 'unknown';
  const logo = urlImage !== 404 ? await getImage(urlImage) : noLogo;

  const canvas = createCanvas(1000, 1000);
  const ctx = canvas.getContext('2d');

  registerFont(path.resolve('./public/fonts/Anton-Regular.ttf'), {
    family: 'Anton',
  });

  ctx.fillStyle = '#FFF';
  ctx.font = '44px "Anton"';
  ctx.fillText('@' + username, 373, 333);
  ctx.font = '33px "Anton"';
  ctx.fillText('FID: ' + fid, 373, 381);
  ctx.font = '67px "Anton"';
  ctx.fillText(weeklyAllowance, 90, 603);
  ctx.fillText(remainingAllowance, 90, 773);
  ctx.textAlign = "right";
  ctx.fillText(masks, 910, 603);
  ctx.fillText('#' + currentRank, 910, 773);

  const textBuffer = canvas.toBuffer('image/png');

  const mainMasksImagePath = path.resolve('./public/frame/masks/main.png');
  const newImageBuffer = await sharp(mainMasksImagePath)
    .composite([{ input: textBuffer }, { input: logo, top: 278, left: 243 }])
    .toBuffer();

  const base64Image = newImageBuffer.toString('base64');
  const dataUrl = `data:image/png;base64,${base64Image}`;
  return dataUrl;
};