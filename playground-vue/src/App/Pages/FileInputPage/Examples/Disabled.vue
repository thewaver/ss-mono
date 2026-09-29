<script setup lang="ts">
import { useModel } from "vue";

import { FileInput } from "@thewaver/ss-components-vue";

import PageFileInputContent from "../../../StyledComponents/FileInputContent/FileInputContent.vue";
import type { FileInputExampleProps } from "../FileInputPage.types";

type Props = FileInputExampleProps;

const props = defineProps<Props>();

const files = useModel(props, "files");
</script>

<template>
    <FileInput v-model:files="files" is-disabled ariaLabel="Disabled attachment">
        <template #renderContent="renderProps">
            <PageFileInputContent :render-props="renderProps" />
        </template>
    </FileInput>
</template>
