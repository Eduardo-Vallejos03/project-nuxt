<template>
    <Dialog v-model:visible="visible" modal :header="userId ? 'Editar Usuario' : 'Nuevo Usuario'" :style="{ width: '40rem' }">
    <div>
        <Form @submit="save" class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
                <label for="name">Nombre del Usuario</label>
                <InputText id="name" v-model="formData.name" placeholder="John Doe"/>

            </div>
            <div class="flex flex-col gap-1">
                <label for="email">Email</label>
                <InputText id="email" v-model="formData.email" type="email" placeholder="john.doe@company.com"/>
            </div>
            <div class="flex flex-col gap-1">
                <label for="password">Contraseña</label>
                <Password id="password" v-model="formData.password" type="text" :feedback="false" toggleMask fluid />
            </div>
            <Button 
            class='mt-4'
            type="submit" 
            :severity="userId ? 'info' : 'success'" 
            :label="userId ? 'Actualizar' : 'Guardar'" 
            :disabled="!formData.name || !formData.email || !formData.password" 
            />
        </Form>
    </div>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';

const { $API } = useNuxtApp();
const visible = ref(false);
const toast = useToast();
const emit = defineEmits(['update']);
const props = defineProps<{ userId: string | null }>();

const formData = ref({
    name: '',
    email: '',
    password: '',
});

const fetchUserData = async () => {
    if (props.userId) {
        try {
            const response = await $API('GET', `/users/${props.userId}`);
            formData.value = {
                name: response.data.name,
                email: response.data.email,
                password: response.data.password,
            };
        } catch (error) {
            console.error('Error al obtener los datos del usuario:', error);
        }
    } else {
        formData.value = { name: '', email: '', password: '' };
    }
};

watch(() => props.userId, fetchUserData, { immediate: true });

const save = async () => {
    try {
        if (props.userId) {
            await $API('PUT', `/users/${props.userId}`, formData.value);
            toast.add({
                severity: 'success',
                summary: 'Usuario actualizado correctamente',
                life: 3000
            });
        } else {
            await $API('POST', '/users', formData.value);
            toast.add({
                severity: 'success',
                summary: 'Usuario creado correctamente',
                life: 3000
            });
        }

        emit('update', false);
    } catch (error) {
        console.error('Error al guardar el usuario:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo guardar el usuario',
            life: 3000
        });
    }
};
</script>
