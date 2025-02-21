<template>
  <div class="flex flex-col bg-white p-16 px-6 space-y-10 w-1/2 mx-auto mt-10 rounded-xl">
    <div class="flex flex-col items-center space-y-8">
      <Avatar icon="pi pi-envelope" style="background-color: #0EA5E9; color: white;" size="xlarge" shape="circle" />
      <h2 class="text-2xl font-bold mb-4">Revisa tu correo electrónico</h2>
      <div class="text-center" v-if="email">
        <p  class="mt-2">Hemos enviado un enlace de inicio de sesión a <b>{{ email }}</b></p>
        <p class="mt-2">Haga clic en el enlace para iniciar sesión</p>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, useNuxtApp } from '#app'
import { useToast } from 'primevue/usetoast'

const route = useRoute()
const router = useRouter()
const { $API } = useNuxtApp()
const toast = useToast()
const error = ref(false)
const success = ref(false)

const email = ref(route.query.email as string | undefined) // Obtener el email desde la URL
const token = route.query.token as string | undefined // Obtener el token desde la URL

const validateToken = async () => {
  if (!token) {
    console.error('No se encontró el token en la URL')
    error.value = true
    return
  }

  try {
    // Envía el token al backend para validar
    const response = await $API('POST', '/auth/validate-token', { token })

    if (!response || response.error) {
      throw new Error('Token inválido')
    }

    localStorage.setItem('auth_token', token) // Guardar el token en localStorage en caso de éxito

    toast.add({
      severity: 'success',
      summary: 'Bienvenido',
      detail: 'Has iniciado sesión con éxito.',
      life: 3000,
    })

    success.value = true

    // Redirigir con parámetro 'auth_success=true' para mostrar notificacion de login
    router.push({ path: '/', query: { auth_success: 'true' } })
  } catch (err) {
    console.error('Error al validar token:', err)
    error.value = true
  }
}

// Llamar a la función solo si hay un token en la URL
onMounted(() => {
  if (token) {
    validateToken()
  }
})
</script>
  