import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { Container, Form, FormError, Header } from './styles'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { api } from '../../lib/axios'
import { AxiosError } from 'axios'
import { NextSeo } from 'next-seo'

const registerFormSchema = z.object({
  // vamos criar o schema com os campos do nosso formulário para fazer validação
  username: z // username é o nome do nosso input
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras!' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário pode ter apenas letras e hifens!',
    }) // para serem aceitos no nosso formulário apenas letras tanto maiúsculas e minúsculas e hifem
    .transform((username) => username.toLowerCase()), // transformando os dados para letras minúsculas
  name: z
    .string()
    .min(3, { message: 'O nome precisa ter pelo menos 3 letras!' }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }, // isSubmitting retorna quando o formulário está fazendo o processo de submit
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema), // temos que passar o schema para o useForm saber como validar o usuário
    /* defaultValues: { // não vamos usar porque o valor de username tem que mudar dinamicamente, vamos user o setValue
      username: 'mateus',
    }, */
  })

  const router = useRouter()

  useEffect(() => {
    if (router.query.username) {
      setValue('username', String(router.query.username)) // vamos pegar o valor do parâmetro e atualizar o valor do campo username
    }
  }, [router.query?.username, setValue])

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post('/users', { name: data.name, username: data.username }) // enviando os dados no corpo da requisição para nossa api-route users

      await router.push('/register/connect-calendar')
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.message) {
        alert(err.response.data.message)
        return
      }

      console.log(err)
    }
  }

  return (
    <>
      <NextSeo title="Crie uma conta | Ignite Call" />
      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao Ignite Call</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>
          <MultiStep size={4} currentStep={1} />
        </Header>
        <Form as="form" onSubmit={handleSubmit(handleRegister)}>
          <label>
            <Text size="sm">Nome de usuário</Text>
            <TextInput
              prefix="ignite.com/"
              placeholder="seu-usuario"
              {...register('username')}
            />
            {errors.username && (
              <FormError>{errors.username.message}</FormError>
            )}
          </label>
          <label>
            <Text size="sm">Nome completo</Text>
            <TextInput placeholder="Seu nome" {...register('name')} />
            {errors.name && <FormError>{errors.name.message}</FormError>}
          </label>

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo <ArrowRight />
          </Button>
        </Form>
      </Container>
    </>
  )
}
