// essa rota vai ser responsável por receber o nosso formulário da page time-intervals e salvar essas informações dentro do registro do usuário -  dados do usuário logado através do google estão dentro dos cookies da aplicação

import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // essa rota vai ser chamada para cadastrar os intervalos de tempo disponíveis pelo usuário
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res), // devolve nossas opções de autenticação
  ) // usamos o getServerSession em serverSide para acessar os dados da sessão - dados do usuário logado - vamos precisar do id para colocar os intervalos disponíveis de determinado usuário

  return res.json({
    session,
  })
}
