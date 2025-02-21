<template>
    <Dialog v-model:visible="visible" modal header="Nuevo Proyecto" :style="{ width: '40rem' }">
    <Toast/>
    <div>
        <Form @submit="save" class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
                <label for="project">Nombre del Proyecto</label>
                <InputText id="project" v-model="formData.project" placeholder="Innovación Tecnológica"/>
            </div>
            <div class="flex flex-col gap-1">
                <label for="identify">Identificación</label>
                <InputText id="identify" v-model="formData.identify" placeholder="PROJ-2025-1234" />
            </div>
            <div class="flex flex-col gap-1">
                <label for="project_id_mail">Email</label>
                <InputText id="project_id_mail" v-model="formData.project_id_mail" type="email" placeholder="proyecto@email.com"/>
            </div>
            <div class="flex flex-col gap-1">
                <label for="sign">Firma</label>
                <InputText id="sign" v-model="formData.sign" placeholder="Firma del Proyecto" />
            </div>
            <div class="flex flex-col gap-1">
                <label for="expires">Fecha de expiración</label>
                <DatePicker id="expires" v-model="formData.expires" dateFormat="yy-mm-dd" showIcon fluid placeholder="Seleccione la fecha de expiración"/>
            </div>
            <div class="flex flex-col gap-1">
                <label for="sign_pwd">Contraseña Firma</label>
                <Password id="sign_pwd" v-model="formData.sign_pwd" type="text" :feedback="false" toggleMask fluid />
            </div>
            <div class="flex flex-col gap-1">
                <label for="logo">Logo</label>
                <FileUpload ref="fileupload" mode="basic" name="logo" :customUpload="true" accept="image/*" 
                            :maxFileSize="1000000" @select="onFileSelect" />
            </div>
            <Button type="submit" severity="success" label="Guardar" class='mt-4'
            :disabled="!formData.project || !formData.identify || !formData.sign || !formData.sign_pwd || !formData.project_id_mail || !formData.expires" 
            />
        </Form>
    </div>
    </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

const { $API } = useNuxtApp()
const visible = ref(false);
const toast = useToast();
const emit = defineEmits(['update']);
const fileupload = ref();

const formData = ref({
    project: '',
    identify: '',
    sign: '',
    expires: null as Date | null,
    sign_pwd: '',
    project_id_mail: '',
    logo: null as File | null
});

const onFileSelect = (event: any) => {
    const file = event.files[0]; // Obtener el primer archivo
    if (file) {
        formData.value.logo = file;
        toast.add({
            severity: 'info',
            summary: 'Archivo seleccionado',
            detail: `Logo: ${file.name}`,
            life: 3000
        });
    }
};

const save = async () => {
    try {
        const formDataUpload = new FormData();

        const formattedExpires = formData.value.expires 
            ? formData.value.expires.toISOString().split('T')[0] 
            : '';

        // Agregar datos normales al FormData
        formDataUpload.append('project', formData.value.project);
        formDataUpload.append('identify', formData.value.identify);
        formDataUpload.append('sign', formData.value.sign);
        formDataUpload.append('sign_pwd', formData.value.sign_pwd);
        formDataUpload.append('project_id_mail', formData.value.project_id_mail);
        formDataUpload.append('expires', formattedExpires);

        // Agregar el archivo solo si existe
        if (formData.value.logo) {
            formDataUpload.append('logo', formData.value.logo);
        }

        const response = await $API('POST', '/projects', formDataUpload);

        toast.add({
            severity: 'success',
            summary: 'Creado correctamente',
            life: 3000
        });

        formData.value = {
            project: '',
            identify: '',
            sign: '',
            expires: null,
            sign_pwd: '',
            project_id_mail: '',
            logo: null
        };

        emit('update', false);

    } catch (error) {
        console.error('Error al guardar el proyecto:', error);

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo guardar el proyecto',
            life: 3000
        });
    }
};
</script>
