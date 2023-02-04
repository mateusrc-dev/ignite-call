import { Button, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormAnnotation } from './styles'
import { useRouter } from 'next/router'

const claimUsernameFormSchema = z.object({
  // vamos criar a estrutura dos dados que vamos receber do formulário para fazer a validação - também podemos fazer transformação
  username: z // username é o nome do nosso input
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras!' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário pode ter apenas letras e hifens!',
    }) // para serem aceitos no nosso formulário apenas letras tanto maiúsculas e minúsculas e hifem
    .transform((username) => username.toLowerCase()), // transformando os dados para letras minúsculas
})

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema> // inferindo a partir do nosso schema uma estrutura TypeScript

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema), // temos que passar o schema para o useForm saber como validar o usuário
  })

  const router = useRouter()

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    // é importando essa função ser assincrona para o isSubmitting funcionar
    const { username } = data

    await router.push(`/register?username=${username}`) // o redirecionamento é assíncrono - vamos passar o username como um parametro na rota
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        {/* Box vem da biblioteca como uma 'div', vamos mudar para 'form' */}
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuario"
          {...register('username')}
        />
        <Button size="sm" type="submit" disabled={isSubmitting}>
          Reservar
          <ArrowRight />
        </Button>
      </Form>
      <FormAnnotation>
        <Text size="sm">
          {errors.username ? (
            <span> {errors.username.message} </span>
          ) : (
            'Digite o nome do usuário!'
          )}
        </Text>
      </FormAnnotation>
    </>
  )
}
