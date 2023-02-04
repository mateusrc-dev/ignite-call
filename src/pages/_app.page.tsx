import { globalStyles } from '../styles/global'
import type { AppProps } from 'next/app'

globalStyles() // executando a função dos estilos globais - vamos carregar uma única vez

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
