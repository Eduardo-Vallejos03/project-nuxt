<template>
  <Toast/>
    <div class="flex flex-col space-y-10 w-1/3 mx-auto">
      <div class="flex flex-col items-center space-y-10">
        <Avatar icon="pi pi-user" style="background-color: #000; color: white;" size="xlarge" shape="circle" />
        <h2 class="text-2xl font-bold mb-4">Bienvenido</h2>
      </div>
      <Form @submit="login" class="flex flex-col space-y-10">
          <InputText id="email" v-model="email" placeholder="example@email.com" fluid type="email"/>
          <Button :disabled="!email" type="submit" severity="primary" rounded label="Log in" class='mt-4'/>
      </Form>
    </div>
</template>
  
<script setup lang="ts">
  import { ref } from 'vue'
  import { useToast } from 'primevue/usetoast'
  
  const email = ref<string>('')
  const toast = useToast()

  const login = async () => {    
    try {
      const { $auth } = useNuxtApp()
      await $auth.sendMagicLink(email.value) // Enviar Magic Link al back
      
    } catch (error) {
      console.log('Error al enviar el Magic Link:', error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Hubo un problema al enviar el Magic Link.',
        life: 3000
      })
    }
  }
  </script>
  