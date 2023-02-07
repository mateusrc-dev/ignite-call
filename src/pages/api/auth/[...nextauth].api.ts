import { PrismaAdapter } from '@/lib/auth/prisma-adapter'
import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'

export function buildNextAuthOptions(
  req: NextApiRequest,
  res: NextApiResponse,
): NextAuthOptions {
  return {
    adapter: PrismaAdapter(req, res),

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
        profile: (profile: GoogleProfile) => {
          // esse método podemos acessar o perfil do usuário retornado pelo google
          return {
            // esse profile server para mapear os campos internos do nextauth (do usuário) com o perfil que foi retornado do google
            id: profile.sub,
            name: profile.name,
            username: '', // não pode ficar nulo, e deixar vazio não faz diferença porque nao vamos atualizar o username
            email: profile.email,
            avatar_url: profile.picture,
          }
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

      async session({ session, user }) {
        // tudo que for retornado dessa função é passado pro frontend no hook useSession
        return {
          ...session, // name, email, expires
          user,
        }
      },
    },
  }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, buildNextAuthOptions(req, res)) // vamos usar essa função para retornar o req e o res
}