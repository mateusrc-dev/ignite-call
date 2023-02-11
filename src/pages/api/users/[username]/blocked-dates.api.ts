import { prisma } from '@/lib/prisma'
// import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username) // query trás dados pelos parâmetros e pelas routes

  const { year, month } = req.query // vamos retornar os dias disponíveis dentro de um mês e ano específicos

  if (!year || !month) {
    return res.status(400).json({ message: 'Year or month not specified.' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      // vamos querer pegar apenas os dias da semana
      week_day: true,
    },
    where: {
      user_id: user.id,
    },
  }) // procurar dias da semana que tenha horários disponíveis - se não tiver horários disponíveis o dia da semana não será incluída no array

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
    return !availableWeekDays.some(
      (availableWeekDays) => availableWeekDays.week_day === weekDay,
    )
  }) // dias da semana que vamos bloquear

  const blockedDatesRaw = await prisma.$queryRaw`
    SELECT * 
    FROM schedulings S /*vamos nomear para S o schedulings*/

    WHERE S.user_id = ${
      user.id
    } /*vamos pegar somente os schedulings de um determinado usuário*/
      AND DATE_FORMAT(S.date, "%Y-%m") = ${`${year}-${month}`}
  ` // vamos fazer uma query mais bruta, por isso o prismaRaw - DATE_FORMAT faz parte do mysql, por isso mudamos o tipo do banco

  return res.json({ blockedWeekDays, blockedDatesRaw })
}
