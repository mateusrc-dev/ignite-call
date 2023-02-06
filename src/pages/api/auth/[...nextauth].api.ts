import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '', // para que seja possível a conexão do usuário com o google provider
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          scope:
            'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar', // aqui é para pedir a autorização do google calendar e dados do usuário
        },
      },
    }),
  ],

  callbacks: {
    // funções que podemos usar no momento de autenticação do usuário
    async signIn({ account }) {
      // essa função precisa ter pelo menos dois retornos
      // no momento que o usuário volta pra aplicação após autenticação essa função é ativada
      if (
        !account?.scope?.includes('https://www.googleapis.com/auth/calendar')
      ) {
        return '/register/connect-calendar/?error=permissions' // vamos redirecionar o usuário caso não existir o escopo de calendário
      }

      return true
    },
  },
}
export default NextAuth(authOptions)
