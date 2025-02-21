<template>
  <Toast />
  <ConfirmDialog />
  <div class="p-6">
    <div v-if="project" class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold mb-4">{{ project.project }}</h2>
      <div class="flex space-x-4">
          <Button
          label="Actualizar Proyecto"
          severity="info"
          variant="text"
          raised
          size="small"
          @click="visible = true"
          />
          <Button 
          label="Eliminar Proyecto"
          severity="danger"
          variant="text"
          raised
          size="small"
          @click="confirmDelete()"
          ></Button>
      </div>
    </div>

    <Card class="w-3/4 mx-auto">
      <template #title>Información del Proyecto</template>
      <template #content>
        <div v-if="project">
          <div class="flex flex-col space-y-6  p-4">
            <div class="flex justify-between items-center">
              <label class="text-gray-500">ID del Proyecto:</label>
              <p class="text-gray-700 w-1/2 text-right w-1/2 text-right">{{ project._id }}</p>
            </div>
            <div class="flex justify-between items-center">
              <label class="text-gray-500">Nombre del Proyecto:</label>
              <p class="text-gray-700 w-1/2 text-right">{{ project.project }}</p>
            </div>
            <div class="flex justify-between items-center">
              <label class="text-gray-500">Identificación:</label>
              <p class="text-gray-700 w-1/2 text-right">{{ project.identify }}</p>
            </div>
            <div class="flex justify-between items-center">
              <label class="text-gray-500">Email:</label>
              <p class="text-gray-700 w-1/2 text-right">{{ project.project_id_mail }}</p>
            </div>
            <div class="flex justify-between items-center">
              <label class="text-gray-500">Firma:</label>
              <p class="text-gray-700 w-1/2 text-right">{{ project.sign }}</p>
            </div>
            <div class="flex justify-between items-center">
              <label class="text-gray-500">Contraseña Firma:</label>
              <p class="text-gray-700 w-1/2 text-right">{{ project.sign_pwd }}</p>
            </div>
            <div class="flex justify-between items-center">
              <label class="text-gray-500">Fecha de Expiración:</label>
              <p class="text-gray-700 w-1/2 text-right">{{ formattedDate }}</p>
            </div>
            <div class="flex justify-between items-center">
              <label class="text-gray-500">Estado:</label>
              <Tag :severity="project.active ? 'success' : 'danger'" class="text-sm">
                {{ project.active ? 'Activo' : 'Inactivo' }}
              </Tag>
            </div>

            <div class="flex justify-between items-center">
              <label class="text-gray-500">Logo:</label>
              <div>
                <Image 
                  v-if="project.logo" 
                  :src="project.logo" 
                  alt="Logo del proyecto" 
                  width="150" 
                  preview 
                />
                <span v-else class="text-gray-400 text-sm">Sin logo</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>Cargando información del proyecto...</p>
        </div>
      </template>
    </Card>
  </div>
  <ProjectUpdate v-model:visible="visible" :formData="formData" @update="handleUpdate"/>
</template>
  
<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

import ProjectUpdate from '~/components/project-update.vue'; 
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useNuxtApp } from '#app';
import { useConfirm } from "primevue/useconfirm";

const confirm = useConfirm();
const visible = ref(false);
const route = useRoute();
const router = useRouter(); 
const { $API } = useNuxtApp();
const project = ref<Project | null>(null);

interface Project {
  _id: string;
  project: string;
  identify: string;
  sign: string;
  expires: string | Date;
  active: boolean;
  sign_pwd: string;
  project_id_mail: string;
  logo: string;
  created_at: string;
  updated_at: string;
}

const formData = ref({
  project: '',
  identify: '',
  sign: '',
  expires: null as Date | null,
  sign_pwd: '',
  project_id_mail: '',
  logo: ''
});

const formattedDate = computed(() => {
  return project.value ? new Date(project.value.expires).toISOString().split('T')[0] : '';
});

const getProject = async () => {
  try {
      const response = await $API('GET', `/projects?id=${route.params.id}`);
      project.value = response.data;
      formData.value = { ...response.data };
  } catch (error) {
    console.error('Error al obtener el proyecto:', error);
  }
};

const handleUpdate = (isVisible: boolean) => {
  visible.value = isVisible;
  if (!isVisible) {
    getProject();
  }
};

const confirmDelete = () => {
    confirm.require({
        message: 'Estas seguro de eliminar el proyecto?',
        header: 'Eliminar Proyecto',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: () => {
            deleteProject();
        },
        reject: () => {}
    });
};

const deleteProject = async () => {
  try {
    await $API('DELETE', `/projects?id=${project.value?._id}`);
    router.push('/')
  } catch (error) {
    console.error('Error al eliminar el proyecto:', error);
    
  }
};

onMounted(() => {
  getProject();
});
</script>
  