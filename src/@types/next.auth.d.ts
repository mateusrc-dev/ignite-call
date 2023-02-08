// arquivo específico para sobrescrever tipagens de bibliotecas

import NextAuth from 'next-auth' // temos que importar porque vamos sobrescrever

declare module 'next-auth' {
  export interface User {
    id: string
    name: string
    email: string
    username: string
    avatar_url: string
  }

  interface Session {
    user: User, // para atualizar a tipagem de Session para parar de dar erro no id
  }
}
