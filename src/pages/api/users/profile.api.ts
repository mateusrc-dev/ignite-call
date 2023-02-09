import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'

const updateProfileBodySchema = z.object({
  bio: z.string(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // essa rota vai ser chamada para cadastrar os intervalos de tempo disponíveis pelo usuário
  if (req.method !== 'PUT') {
    return res.status(405).end()
  }

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res), // devolve nossas opções de autenticação
  ) // usamos o getServerSession em serverSide para acessar os dados da sessão - dados do usuário logado - vamos precisar do id para colocar a bio de um determinado usuário

  if (!session) {
    return res.status(401).end() // erro de não autenticado
  }

  const { bio } = updateProfileBodySchema.parse(req.body) // para retornar os dados tipados do body - parse retorna um erro

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      bio,
    },
  })

  return res.status(204).end() // 204 é sucesso mas resposta sem conteúdo
}
