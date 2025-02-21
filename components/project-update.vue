<template>
    <Dialog v-model:visible="visible" modal header="Actualizar Proyecto" :style="{ width: '40rem' }">
        <Form @submit="updateProject" class="flex flex-col gap-4 w-full">
            <div class="flex flex-col gap-1">
                <label for="project">Nombre del Proyecto</label>
                <InputText id="project" v-model="formData.project" />
            </div>
            <div class="flex flex-col gap-1">
                <label for="identify">Identificación</label>
                <InputText id="identify" v-model="formData.identify" />
            </div>
            <div class="flex flex-col gap-1">
                <label for="sign">Firma</label>
                <InputText id="sign" v-model="formData.sign" />
            </div>
            <div class="flex flex-col gap-1">
                <label for="expires">Fecha de expiración</label>
                <Calendar id="expires" v-model="formData.expires" dateFormat="yy-mm-dd"/>
            </div>
            <div class="flex flex-col gap-1">
                <label for="sign_pwd">Contraseña Firma</label>
                <Password id="sign_pwd" v-model="formData.sign_pwd" type="text" :feedback="false" toggleMask fluid />
            </div>
            <div class="flex flex-col gap-1">
                <label for="project_id_mail">Email</label>
                <InputText id="project_id_mail" v-model="formData.project_id_mail" type="email"/>
            </div>
            <div class="flex flex-col gap-1">
                <label for="logo">Logo</label>
                <FileUpload ref="fileupload" mode="basic" name="logo" :customUpload="true" accept="image/*" 
                            :maxFileSize="1000000" @select="onFileSelect" />
            </div>
            <div class="flex justify-end gap-2">
                <Button type="submit" label="Actualizar" severity="info"></Button>
            </div>
        </Form>
    </Dialog>
</template>
  
<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { useToast } from 'primevue/usetoast';

const { $API } = useNuxtApp()
const visible = ref(false);
const toast = useToast();
const emit = defineEmits(['update']);
const fileupload = ref();

const props = defineProps({
    formData: {
        type: Object,
        required: true
    }
});

const selectedFile = ref<File | null>(null);

const onFileSelect = (event: any) => {
    const file = event.files[0]; 
    if (file) {
        selectedFile.value = file;
        toast.add({
            severity: 'info',
            summary: 'Archivo seleccionado',
            detail: `Logo: ${file.name}`,
            life: 3000
        });
    }
};

const updateProject = async () => {
    try {
        const formDataUpload = new FormData();

        const formattedExpires = props.formData.expires 
            ? new Date(props.formData.expires).toISOString().split('T')[0] 
            : '';

        formDataUpload.append('project', props.formData.project);
        formDataUpload.append('identify', props.formData.identify);
        formDataUpload.append('sign', props.formData.sign);
        formDataUpload.append('sign_pwd', props.formData.sign_pwd);
        formDataUpload.append('project_id_mail', props.formData.project_id_mail);
        formDataUpload.append('expires', formattedExpires);

        if (selectedFile.value) {
            formDataUpload.append('logo', selectedFile.value);
        }

        const response = await $API('PUT', `/projects?id=${props.formData._id}`, formDataUpload);
        
        toast.add({
        severity: 'success',
        summary: 'Actualizado Correctamente',
        life: 3000
        });

        emit('update', false);

    } catch (error) {
        console.error('Error al actualizar el proyecto:', error);
        toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo actualizar el proyecto',
        life: 3000
        });
    }
};
</script>
  