export default defineNuxtPlugin(() => {
  const API = async (method: string, url: string, data?: any) => {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBase || 'http://localhost:3001'

    // Recuperar el token desde localStorage
    const token = localStorage.getItem('auth_token')

    // Determinar si `data` es un FormData
    const isFormData = data instanceof FormData

    const headers: Record<string, string> = {}

    // Si hay un token, agregarlo
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Agregar Content-Type solo si no es FormData
    if (!isFormData) {
      headers['Content-Type'] = 'application/json'
    }

    try {
      const response = await fetch(`${baseURL}${url}`, {
        method,
        headers,
        body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error en la solicitud')
      }

      return await response.json()
    } catch (error) {
      console.error('Error en API:', error)
      throw error
    }
  }

  return {
    provide: {
      API
    }
  }
})
