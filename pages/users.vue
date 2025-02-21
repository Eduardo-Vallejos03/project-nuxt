<template>
  <ConfirmDialog />
  <div class="flex justify-end mb-6 space-x-4">
      <Button 
      label="Crear Usuario"
      severity="success"
      variant="text"
      raised
      icon="pi pi-plus" 
      @click="visible=true"/>
  </div>
  <div class="p-6">
  <DataTable 
    :value="users" 
    v-model:filters="filters"
    class="shadow-lg"
    :globalFilterFields="['_id', 'name', 'email']"
    >
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between mb-2">
          <h2 class="text-2xl font-bold">Lista de Usuarios</h2>
          <IconField>
              <InputIcon>
                  <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Buscar..." />
          </IconField>
        </div>
      </template>
      <Column field="_id" header="ID"/>
      <Column field="name" header="Nombre"/>
      <Column field="email" header="Email"/>
      <Column header="Acciones">
        <template v-slot:body="slotProps">
          <Button 
            icon="pi pi-pen-to-square" 
            severity="info" 
            rounded
            class="mr-2"
            @click="openDialogEdit(slotProps.data._id)" />
          <Button 
            icon="pi pi-trash" 
            severity="danger" 
            rounded
            @click="confirmDelete(slotProps.data._id)" />
        </template>
      </Column>
    </DataTable>
  </div>

  <UserNew v-model:visible="visible" :userId="selectedUser" @update="handleCreate"/>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

import UserNew from '~/components/UserNew.vue';
import { ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useConfirm } from "primevue/useconfirm";

interface Users {
  _id: string;
  name: string;
  email: string;
}

const { $API } = useNuxtApp()
const confirm = useConfirm();
const visible = ref(false)
const users = ref<Users[]>([]);
const selectedUser = ref<string | null>(null)
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const getData = async () => {
  try {
    const response = await $API('GET', '/users');
    users.value = response.data || [];
    console.log('Datos obtenidos:', users.value);
  } catch (error) {
    console.error('Error al obtener los datos:', error);
  }
};

const openDialogEdit = (userId: string | null = null) => {
  selectedUser.value = userId;
  visible.value = true;
};

const confirmDelete = (id: string) => {
      confirm.require({
          message: 'Estas seguro de eliminar el usuario?',
          header: 'Eliminar Usuario',
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
              deleteUser(id);
          },
          reject: () => {}
      });
  };
  
const deleteUser = async (id: string) => {
  try {
    await $API('DELETE', `/users/${id}`);
    getData();
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    
  }
};

const handleCreate = (isVisible: boolean) => {
  visible.value = isVisible;
  if (!isVisible) {
    getData();
  }
};

onMounted(() => {
  getData();
});
</script>