<script setup lang="ts">
import { shallowRef } from "vue";

import { FileInput } from "@thewaver/ss-components-vue";

import PageFileInputContent from "../../StyledComponents/FileInputContent/FileInputContent.vue";
import type { PageFileFieldProps } from "./Field.types";

const props = defineProps<PageFileFieldProps>();

const files = shallowRef<File[]>([]);

const handleChange = (picked: File[]) => {
    if (!picked.length) return;

    props.onPick(picked[0]);
};
</script>

<template>
    <FileInput
        v-model:files="files"
        :accept="accept"
        :is-disabled="isDisabled"
        :ariaLabel="ariaLabel"
        @change="handleChange"
    >
        <template #renderContent="renderProps">
            <PageFileInputContent :render-props="renderProps" />
        </template>
    </FileInput>
</template>
