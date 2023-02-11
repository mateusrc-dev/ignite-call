import { Calendar } from '@/components/Calendar'
import { api } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  TimePickerItem,
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerList,
} from './styles'

interface Availability {
  possibleTimes: number[] // horários possíveis
  availableTimes: number[] // horários disponíveis
}

export function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  // const [availability, setAvailability] = useState<Availability | null>(null)
  const router = useRouter()

  const isDateSelected = !!selectedDate
  const username = String(router.query.username)

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null // retornando o dia da semana
  const describedDate = selectedDate // retornando dia e mês
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  const { data: availability } = useQuery<Availability>( // vamos usar o useQuery para melhorar a performance das requisições - vão ficar guardadas em cache
    ['availability', selectedDateWithoutTime], // passamos aqui a chave key e os parâmetros usados na requisição
    async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        }, // fazendo a requisição para pegar os hórarios da data do usuário
      })
      return response.data
    },
    {
      enabled: !!selectedDate, // só vai ser executado essa requisição caso exista um horário selecionado
    },
  )

  /* useEffect(() => {
    if (!selectedDate) {
      return
    }

    api
      .get(`/users/${username}/availability`, {
        params: {
          date: dayjs(selectedDate).format('YYYY-MM-DD'),
        }, // fazendo a requisição para pegar os hórarios da data do usuário
      })
      .then((response) => {
        setAvailability(response.data)
      })
  }, [selectedDate, username]) */

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{describedDate}</span>
          </TimePickerHeader>
          <TimePickerList>
            {availability?.possibleTimes.map((hour) => {
              return (
                <TimePickerItem
                  key={hour}
                  disabled={!availability.availableTimes?.includes(hour)} // se não existir o 'hour' dentro de availableTimes é porque o horário não está disponível
                >
                  {String(hour).padStart(2, '0')}:00h
                </TimePickerItem>
              )
            })}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}
