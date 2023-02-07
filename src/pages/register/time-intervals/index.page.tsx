import { getWeekDays } from '@/utils/get-week-days'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useFieldArray, useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { Container, Header } from '../styles'
import {
  FormError,
  IntervalBox,
  IntervalContainer,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
} from './styles'

const timeIntervalsFormSchema = z.object({
  // vamos colocar o schema dos dados que vamos validar - no caso nossos dados vão ser um array com objetos
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7) // validação de que sempre vamos receber 7 objetos do array (7 dias da semana)
    .transform((intervals) => intervals.filter((interval) => interval.enabled)) // transform serve para modificar o formato do array
    .refine((intervals) => intervals.length > 0, {
      message: 'Você precisa selecionar pelo menos um dia da semana!',
    }), // após transform para fazer validação no zod temos que usar o refine que retorna true ou false
})

type TimeIntervalsFormData = z.infer<typeof timeIntervalsFormSchema>

export default function TimeInterval() {
  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
    watch,
  } = useForm({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        // array com valores padrão de cada dia da semana
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
      ],
    },
  })

  const weekDays = getWeekDays()

  const { fields } = useFieldArray({
    control, // para saber qual formulário esse método está lidando
    name: 'intervals', // nome do campo
  }) // esse hook nos permite iterar um campo do formulário que é um array

  async function handleSetTimeIntervals(data: TimeIntervalsFormData) {
    console.log(data)
  }

  const intervals = watch('intervals') // para assistir a mudança dos campos do formulário em tempo real

  return (
    <Container>
      <Header>
        <Heading as="strong">Quase lá!</Heading>
        <Text>
          Defina o intervalo de horários que você está disponível em cada dia da
          semana.
        </Text>
        <MultiStep size={4} currentStep={3} />
      </Header>

      <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
        <IntervalContainer>
          {fields.map((field, index) => {
            return (
              <IntervalItem key={field.id}>
                <IntervalDay>
                  <Controller
                    name={`intervals.${index}.enabled`}
                    control={
                      control
                    } /* é uma api que nos permite fazer qualquer coisa nos campos (alterar, pegar valor de campo, registrar) */
                    render={({ field }) => {
                      return (
                        <Checkbox
                          onCheckedChange={(checked) => {
                            field.onChange(checked === true) // para o valor de onCheckedChange não ser indeterminado
                          }}
                          checked={field.value} // para recuperar o valor inicial de enabled
                        />
                      )
                    }} // essa propriedade renderiza o checkbox - função do render recebe propriedades
                  />
                  <Text>{weekDays[field.weekDay]}</Text>
                </IntervalDay>
                <IntervalInputs>
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    disabled={intervals[index].enabled === false}
                    {...register(`intervals.${index}.startTime`)}
                  />
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    disabled={intervals[index].enabled === false}
                    {...register(`intervals.${index}.endTime`)}
                  />
                </IntervalInputs>
              </IntervalItem>
            )
          })}
        </IntervalContainer>

        {errors.intervals && (
          <FormError size="sm">{errors.intervals.message}</FormError>
        )}

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo! <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  )
}