<template>
  <Toast />
    <div class="p-6">
      <div class="flex justify-end mb-6 space-x-4">
        <div>
          <Button
          label="Crear Proyecto"
          severity="success"
          variant="text"
          raised
          icon="pi pi-plus"
          @click="visible=true"
          />
        </div>
        <div>
          <Button type="button" icon="pi pi-cog" aria-haspopup="true" aria-controls="overlay_menu" @click="toggle"/>
          <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
        </div>
      </div>

      <DataTable 
      :value="projects" 
      v-model:filters="filters"
      class="shadow-lg"
      :globalFilterFields="['_id', 'project', 'identify']"
      emptyMessage="No hay proyectos registrados"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between mb-2">
            <h2 class="text-2xl font-bold">Lista de Proyectos</h2>
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="filters['global'].value" placeholder="Buscar..." />
            </IconField>
          </div>
        </template>
        <Column field="_id" header="ID"/>
        <Column field="project" header="Proyecto"/>
        <Column field="identify" header="Identificación"/>
        <Column field="active" header="Estado">
          <template v-slot:body="slotProps">
            <Tag :severity="slotProps.data.active ? 'success' : 'danger'">
              {{ slotProps.data.active ? 'Activo' : 'Inactivo' }}
            </Tag>
          </template>
        </Column>
        <Column header="Acciones">
          <template v-slot:body="slotProps">
            <Button 
              icon="pi pi-search" 
              severity="info" 
              rounded
              @click="navigateTo(`/project-detail/${slotProps.data._id}`)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <ProjectsNew v-model:visible="visible" @update="handleCreate" />
  </template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

import { ref, onMounted } from 'vue'
import { useNuxtApp, useRoute } from '#app'
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from '@primevue/core/api';
import ProjectsNew from '~/components/projects-new.vue'
import { useRouter } from 'vue-router';

interface Project {
  _id: string;
  project: string;
  identify: string;
  active: boolean;
}

const { $API } = useNuxtApp()
const route = useRoute()
const router = useRouter();
const visible = ref(false)
const toast = useToast()
const projects = ref<Project[]>([]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const menu = ref();
const items = ref([
    {
        label: 'Options',
        items: [
            {
                label: 'Users',
                icon: 'pi pi-user',
                command: () => {
                router.push('/users');
        }
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: async () => {
                  await logout();  // logout
                }
            }
        ]
    }
]);

const getData = async () => {
  try {
    const response = await $API('GET', '/projects');
    projects.value = response.data || [];
  } catch (error: any) {
    console.error('Error al obtener los datos:', error);
    if (error instanceof Error) {
      console.error('Error al obtener los datos:', error.message);
      if (error.message.includes('Invalid authentication token')) {
        logout();
      }
    } else {
      console.error('Error al obtener los datos');
    }
  }
};

const handleCreate = (isVisible: boolean) => {
  visible.value = isVisible;
  if (!isVisible) {
    getData();
  }
};

const authSuccess = () => {
  const authSuccess = route.query.auth_success  //Validar si la autenticación fue exitosa
  if (authSuccess === 'true') { 
    toast.add({
      severity: 'success',
      summary: 'Autenticado con éxito',
      detail: 'Bienvenido a la aplicación.',
      life: 3000,
    })
  }
}

const logout = () => {
  localStorage.removeItem('auth_token'); // Eliminar el token
  router.push('/login'); // Redirigir al login
};

const toggle = () => {
  menu.value.toggle(event)
}

onMounted( () => {
  authSuccess()
  getData()
});
</script>
