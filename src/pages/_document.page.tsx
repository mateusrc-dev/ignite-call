// no next esse será o documento html da nossa aplicação onde podemos colocar nossas fontes

import { getCssText } from '@ignite-ui/react'
import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* antes estava 'crossorigin' */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <style
          id="stitches"
          dangerouslySetInnerHTML={{ __html: getCssText() }}
        />
        {/* para que o Server Side Rendering(SSR) funcione - com isso mesmo com JS desativado a aplicação vai ter css - vai gerar tudo no servidor node e devolver tudo pronto */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
