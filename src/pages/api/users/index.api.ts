import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    // se o método for diferente de post vai dar erro - no next temos que fazer esse if para conseguir especificar o método da rota - get, post, put, delete
    return res.status(405).end() // retornando um erro de que o método não é suportado pela rota
  }

  const { name, username } = req.body // pegando os dados da requisição

  const user = await prisma.user.create({
    // vamos criar um novo usuário com método post
    data: {
      name,
      username,
    },
  })

  return res.status(201).json(user) // 201 significa que o post teve êxito
}
