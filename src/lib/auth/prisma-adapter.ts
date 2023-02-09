import { NextApiRequest, NextApiResponse, NextPageContext } from 'next'
import { Adapter } from 'next-auth/adapters'
import { prisma } from '../prisma'
import { parseCookies, destroyCookie } from 'nookies' // para buscar os cookies - para apagar os cookies

export function PrismaAdapter(
  req: NextApiRequest | NextPageContext['req'], // vamos receber essas variáveis para ter acesso aos cookies - vamos precisar passar duas tipagens porque no getServerSideProps (servidor node) a tipagem de req é diferente da tipagem do req nas requisições
  res: NextApiResponse | NextPageContext['res'],
): Adapter {
  return {
    async createUser(user) {
      // com os dados de cookies vamos atualizar os dados de usuário
      const { '@ignitecall:userId': userIdOnCookies } = parseCookies({ req }) // pegando o id do usuário nos cookies
      if (!userIdOnCookies) {
        throw new Error('User ID not found on cookies.')
      }

      // vamos atualizar o usuário do prisma (banco de dados) caso exista o id com os dados do google
      const prismaUser = await prisma.user.update({
        where: {
          id: userIdOnCookies,
        },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      })

      destroyCookie({ res }, '@ignitecall:userId', { path: '/' }) // ao buscar cookies usamos red, ao modificar usamos res - o path é para  apagar os cookies para todas as páginas

      return {
        id: prismaUser.id,
        name: prismaUser.name,
        username: prismaUser.username,
        email: prismaUser.email!, // '!' é para informar para o typescript que esse dado vai ser informado
        avatar_url: prismaUser.avatar_url!,
        emailVerified: null,
      }
    },

    async getUser(id) {
      // vamos retornar o usuário a partir do seu id
      const user = await prisma.user.findUnique({
        // findUniqueOrThrow esse método não retorna undefined
        where: {
          id,
        },
      })

      if (!user) {
        return null
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!, // '!' é para informar para o typescript que esse dado vai ser informado
        avatar_url: user.avatar_url!,
        emailVerified: null,
      } // o retorno é um AdapterUser (um formato específico)
    },

    async getUserByEmail(email) {
      // vamos retornar o usuário a partir do seu email
      const user = await prisma.user.findUnique({
        // findUniqueOrThrow esse método não retorna undefined
        where: {
          email,
        },
      })

      if (!user) {
        return null
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!, // '!' é para informar para o typescript que esse dado vai ser informado
        avatar_url: user.avatar_url!,
        emailVerified: null,
      } // o retorno é um AdapterUser (um formato específico)
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        // aqui tem que ser findUnique - esse método (getUserByAccount) é pra saber se o usuário nunca entrou na conta - não podemos usar findUniqueOrThrow para evitar retornar erro
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId,
          },
        },
        include: {
          user: true,
        },
      })

      if (!account) {
        return null
      }

      const { user } = account

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!, // '!' é para informar para o typescript que esse dado vai ser informado
        avatar_url: user.avatar_url!,
        emailVerified: null,
      } // o retorno é um AdapterUser (um formato específico)
    },

    async updateUser(user) {
      const prismaUser = await prisma.user.update({
        where: {
          id: user.id!,
        },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      })

      return {
        id: prismaUser.id,
        name: prismaUser.name,
        username: prismaUser.username,
        email: prismaUser.email!, // '!' é para informar para o typescript que esse dado vai ser informado
        avatar_url: prismaUser.avatar_url!,
        emailVerified: null,
      } // o retorno é um AdapterUser (um formato específico)
    },

    async linkAccount(account) {
      // quando o usuário loga com mais de um provider
      await prisma.account.create({
        data: {
          user_id: account.userId,
          type: account.type,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        },
      })
    },

    async createSession({ sessionToken, userId, expires }) {
      await prisma.session.create({
        data: {
          user_id: userId,
          expires,
          session_token: sessionToken,
        },
      })

      return {
        userId,
        sessionToken,
        expires,
      }
    },

    async getSessionAndUser(sessionToken) {
      const prismaSession = await prisma.session.findUnique({
        where: {
          session_token: sessionToken,
        },
        include: {
          user: true,
        },
      })

      if (!prismaSession) {
        return null
      }

      const { user, ...session } = prismaSession

      return {
        session: {
          userId: session.user_id,
          expires: session.expires,
          sessionToken: session.session_token,
        },
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email!, // '!' é para informar para o typescript que esse dado vai ser informado
          avatar_url: user.avatar_url!,
          emailVerified: null,
        },
      }
    },

    async updateSession({ sessionToken, userId, expires }) {
      const prismaSession = await prisma.session.update({
        where: {
          session_token: sessionToken,
        },
        data: {
          expires,
          user_id: userId,
        },
      })

      return {
        sessionToken: prismaSession.session_token,
        userId: prismaSession.user_id,
        expires: prismaSession.expires,
      } // o retorno é um AdapterUser (um formato específico)
    },

    async deleteSession(sessionToken) {
      await prisma.session.delete({
        where: {
          session_token: sessionToken,
        },
      })
    },
  }
}
