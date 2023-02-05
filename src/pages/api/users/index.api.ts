import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    // se o método for diferente de post vai dar erro - no next temos que fazer esse if para conseguir especificar o método da rota - get, post, put, delete
    return res.status(405).end() // retornando um erro de que o método não é suportado pela rota
  }

  const { name, username } = req.body // pegando os dados da requisição

  const userExists = await prisma.user.findUnique({
    // findUnique é para encontrar um registro por um campo que seja único
    where: {
      username,
    },
  })

  if (userExists) {
    // testando se o usuário existe
    return res.status(400).json({ message: 'Username already taken.' })
  }

  const user = await prisma.user.create({
    // vamos criar um novo usuário com método post
    data: {
      name,
      username,
    },
  })

  setCookie({ res }, '@ignitecall:userId', user.id, {
    maxAge: 60 * 60 * 24 * 7, // aqui vamos colocar a validade do cookie - 7 days
    path: '/', // todas as rotas da aplicação podem acessar esse cookie
  }) // criando um header na resposta com o cookie

  return res.status(201).json(user) // 201 significa que o post teve êxito
}
