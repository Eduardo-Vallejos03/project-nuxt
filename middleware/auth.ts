// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
    // Esperar hasta que el localStorage esté disponible
    if (process.client) {
      const token = localStorage.getItem('auth_token')
  
      // Si no hay token y estamos intentando acceder a una página protegida (no login ni verify), redirigimos a login
      if (!token && to.path !== '/login' && to.path !== '/verify') {
        return navigateTo('/login')  // Redirigir al login
      }
    }
  })
  