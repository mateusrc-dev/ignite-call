import { styled, Heading, Text } from '@ignite-ui/react'

export const Container = styled('div', {
  maxWidth: 'calc(100vw - (100vw - 1160px) / 2)', // calculando o tamanho do que sobra tirando a largura do nosso container, dividindo por 2 e subtraindo esse resultado de 100vw
  marginLeft: 'auto', // vai jogar nosso elemento completamente para a esquerda se o width for menor (como é o caso acima)
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  gap: '$20',
})

export const Hero = styled('div', {
  maxWidth: 480,
  padding: '0 $10',

  [`${Heading}`]: {
    // vamos estilizar diretamente o Heading (independentemente do valor da propriedade 'as')
    '@media(max-width: 600px)': {
      fontSize: '$6xl',
    },
  },

  [`${Text}`]: {
    // vamos estilizar diretamente o Text (independentemente do valor das propriedade)
    marginTop: '$2',
    color: '$gray200',
  },
})

export const Preview = styled('div', {
  paddingRight: '$8',
  overflow: 'hidden',

  '@media(max-width: 600px)': {
    display: 'none',
  },
})
