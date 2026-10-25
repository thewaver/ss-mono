<script setup lang="ts">
import { shallowRef } from "vue";

import { FileInput } from "@thewaver/ss-components-vue";

import PageFileInputContent from "../../../StyledComponents/FileInputContent/FileInputContent.vue";
import type { FileInputBasicDocsExampleProps } from "../FileInputPageVue.types";

type Props = FileInputBasicDocsExampleProps;

defineProps<Props>();

const files = shallowRef<File[]>([]);
</script>

<template>
    <FileInput v-model:files="files" :has-error="hasError" :is-disabled="isDisabled" ariaLabel="Attachment">
        <template #renderContent="renderProps">
            <PageFileInputContent :render-props="renderProps" />
        </template>
    </FileInput>
</template>
