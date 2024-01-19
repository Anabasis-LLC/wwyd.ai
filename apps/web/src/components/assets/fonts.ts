// 3rd party
import { Inter, Lora } from 'next/font/google';
import localFont from 'next/font/local';

/**
 * Inter
 */

export const inter = Inter({ subsets: ['latin'] });

/**
 * Lora
 */

export const lora = Lora({ subsets: ['latin'], weight: ['500'] });

/**
 * Sofia Pro
 */

export const sofiaPro = localFont({ src: './sofia-pro.woff2' });
