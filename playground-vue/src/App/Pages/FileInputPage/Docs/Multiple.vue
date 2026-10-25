<script setup lang="ts">
import { shallowRef } from "vue";

import { FileInput } from "@thewaver/ss-components-vue";

import PageFileInputContent from "../../../StyledComponents/FileInputContent/FileInputContent.vue";

const files = shallowRef<File[]>([]);
</script>

<template>
    <FileInput v-model:files="files" is-multiple ariaLabel="Attachments">
        <template #renderContent="renderProps">
            <PageFileInputContent :render-props="renderProps" />
        </template>
    </FileInput>
</template>
