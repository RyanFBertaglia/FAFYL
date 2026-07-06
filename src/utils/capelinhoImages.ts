import curiosoImg from '../../assets/images/curioso.png';
import tristeImg from '../../assets/images/triste.png';
import muitofelizImg from '../../assets/images/muitofeliz.png';
import serioImg from '../../assets/images/serio.png';

export const capelinhoCurioso = curiosoImg;
export const capelinhoTriste = tristeImg;
export const capelinhoMuitofeliz = muitofelizImg;
export const capelinhoSerio = serioImg;

export const CAPELINHO_IMAGES: Record<number, string> = {
  1: curiosoImg,
  2: tristeImg,
  3: muitofelizImg,
  4: serioImg,
};

export function getCapelinhoImage(capelinhoId: number | null | undefined): string {
  if (!capelinhoId || !CAPELINHO_IMAGES[capelinhoId]) {
    return CAPELINHO_IMAGES[1];
  }
  return CAPELINHO_IMAGES[capelinhoId];
}
