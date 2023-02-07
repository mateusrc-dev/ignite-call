import { Box, styled, Text } from '@ignite-ui/react'

export const IntervalBox = styled(Box, {
  marginTop: '$6',
  display: 'flex',
  flexDirection: 'column',
})

export const IntervalContainer = styled('div', {
  border: '1px solid $gray600',
  borderRadius: '$md',
  marginBottom: '$4',
})

export const IntervalItem = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '$3 $4',

  '& + &': {
    // vamos aplicar css somente no IntervalItem que tiver um IntervalItem antes dele
    borderTop: '1px solid $gray600',
  },
})

export const IntervalDay = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
})

export const IntervalInputs = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',

  'input::-webkit-calendar-picker-indicator': {
    // vamos estilizar o reloginho dentro do input
    filter: 'invert(100%) brightness(40%)',
  },
})

export const FormError = styled(Text, {
  color: '#f75a68',
  marginBottom: '$4',
})
