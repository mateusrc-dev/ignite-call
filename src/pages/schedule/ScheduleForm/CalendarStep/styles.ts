import { Box, styled, Text } from '@ignite-ui/react'

export const Container = styled(Box, {
  margin: '$6 auto 0',
  padding: 0,
  display: 'grid',
  maxWidth: '100%',
  position: 'relative',

  variants: {
    isTimePickerOpen: {
      // vamos criar uma propriedade que pode ser passada pra esse componente
      true: {
        gridTemplateColumns: '1fr 280px', // cada coluna vai ter 280px

        '@media(max-width: 900px)': {
          gridTemplateColumns: '1fr', // para ficar apenas uma coluna
        },
      },
      false: {
        width: 540,
        gridTemplateColumns: '1fr',
      },
    },
  },
})

export const TimePicker = styled('div', {
  borderLeft: '1px solid $gray600',
  padding: '$6 $6 0', // o padding em baixo não funciona quando tem scroll - vamos usar marginBottom no último filho
  overflowY: 'scroll',
  position: 'absolute',
  top: 0, // colocando 0 em top e bottom a altura desse componente vai ser definida de acordo com a altura do calendar
  bottom: 0,
  right: 0,
  width: 280,
  '&::-webkit-scrollbar': {
    width: '15px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '$gray100',
    borderRadius: '10px',
    width: '0px',
    backgroundClip: 'padding-box',
    border: '3px solid transparent',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '$gray200',
    width: '0px',
    borderRadius: '10px',
    backgroundClip: 'padding-box',
    border: '3px solid transparent',
  },
})

export const TimePickerHeader = styled(Text, {
  fontWeight: '$medium',
  span: {
    color: '$gray200',
  },
})

export const TimePickerList = styled('div', {
  marginTop: '$3',
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '$2',

  '@media(max-width: 900px)': {
    gridTemplateColumns: '2fr',
  },
})

export const TimePickerItem = styled('button', {
  border: 0,
  backgroundColor: '$gray600',
  padding: '$2 0',
  cursor: 'pointer',
  color: '$gray100',
  borderRadius: '$sm',
  fontSize: '$sm',
  lineHeight: '$base',

  '&:last-child': {
    marginBottom: '$6',
  },

  '&:disabled': {
    background: 'none',
    cursor: 'default',
    opacity: 0.4,
  },

  '&:not(:disabled):hover': {
    background: '$gray500',
  },

  '&:focus': {
    boxShadow: '0 0 0 2px $colors$gray100',
  },
})
