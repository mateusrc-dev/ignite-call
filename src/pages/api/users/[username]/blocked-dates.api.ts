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

  const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
    SELECT
      EXTRACT(DAY FROM S.date) AS date, /* vamos extrair somente o dia que temos schedules */
      COUNT(S.date) AS amount, /* para contar quantos schedules (horários ocupados) tem no dia */
      ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60) AS size /* quantos horários vamos ter disponíveis no dia*/
    FROM schedulings S /*vamos nomear para S*/

    LEFT JOIN user_time_intervals UTI /*unindo com a tabela userTimeIntervals pelas datas*/
      ON UTI.week_day = WEEKDAY(DATE_ADD(S.date, INTERVAL 1 DAY)) /*WEEKDAY - função do mysql - vamos igualar os dias da semana do JS e MySql*/

    WHERE S.user_id = ${
      /* vamos fazer uma query mais bruta, por isso o prismaRaw - DATE_FORMAT faz parte do mysql, por isso mudamos o tipo do banco */
      user.id
    } 
      AND DATE_FORMAT(S.date, "%Y-%m") = ${`${year}-${month}`} /*vamos pegar somente os schedulings de um determinado usuário*/

      GROUP BY EXTRACT(DAY FROM S.date),
        ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)

      HAVING amount >= size /*HAVING é para retornar todos os registros que sobraram da listagem em que o amount seja maior ou igual que o size*/
  `

  const blockedDates = blockedDatesRaw.map((item) => item.date) // vamos pegar somente os dias em que o amount seja maior ou igual que o size

  return res.json({ blockedWeekDays, blockedDates })
}
