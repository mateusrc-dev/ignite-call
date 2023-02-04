import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({ log: ['query'] }) // exportando constante que vai ter métodos do prisma - prisma ler automaticamente o arquivo .env quando instanciamos o PrismaClient e vai saber as informações da conexão com banco de dados - vamos colocar o log para acompanhar inserções no banco de dados, etc.
