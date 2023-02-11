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

  return res.json({ blockedWeekDays })
}
