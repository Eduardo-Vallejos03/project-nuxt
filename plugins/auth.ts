import { defineNuxtPlugin, useNuxtApp, useRouter } from '#app'

export default defineNuxtPlugin(() => {
  const { $API } = useNuxtApp()
  const router = useRouter() 
  
  const sendMagicLink = async (email: string) => {
    try {
        const response = await $API('POST', '/users/auth', { email })
  
        if (response.error) {
          throw new Error(response.error)
        }
  
        // Redirigir al usuario a la página de espera (verify)
        router.push(`/verify?email=${encodeURIComponent(email)}`) 
      } catch (error) {
        console.error('Error al enviar Magic Link:', error)
      }
  }

  return {
    provide: {
      auth: {
        sendMagicLink,
      },
    },
  }
})
