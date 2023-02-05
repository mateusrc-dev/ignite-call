import axios from 'axios'

export const api = axios.create({
  baseURL: '/api', // como back e frontend está no mesmo projeto não precisamos colocar localhost porque o axios já vai conhecer
})
