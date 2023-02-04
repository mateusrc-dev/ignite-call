import { globalCss } from '@ignite-ui/react' // ignite-ui está utilizando o stitches - forma de escrever css in js

export const globalStyles = globalCss({
  // dentro da função globalCss declaramos nossas estilizações globais
  '*': {
    // vai ser um objeto - estamos dentro do JS
    boxSizing: 'border-box',
    padding: 0,
    margin: 0,
  },

  body: {
    backgroundColor: '$gray900',
    color: '$gray100',
    '-webkit-font-smoothing': 'antialiased',
  },
})
