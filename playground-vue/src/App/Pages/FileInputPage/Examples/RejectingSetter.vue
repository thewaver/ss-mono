<script setup lang="ts">
import { useModel } from "vue";

import { FileInput } from "@thewaver/ss-components-vue";
import { MAX_ATTACHMENT_BYTES } from "@thewaver/ss-playground/App/Pages/FileInputPage/FileInputPage.const";

import PageFileInputContent from "../../../StyledComponents/FileInputContent/FileInputContent.vue";
import type { FileInputRejectingExampleProps } from "../FileInputPage.types";

type Props = FileInputRejectingExampleProps;

const props = defineProps<Props>();

const files = useModel(props, "files");

const handleChange = (picked: File[]) => {
    const tooBig = picked.filter((file) => file.size > MAX_ATTACHMENT_BYTES);

    props.onRejectionChange(tooBig.length ? `${tooBig[0].name} is too big, pick again` : "");

    if (tooBig.length) files.value = [];
};
</script>

<template>
    <FileInput v-model:files="files" :has-error="rejection !== ''" ariaLabel="Small attachment" @change="handleChange">
        <template #renderContent="renderProps">
            <PageFileInputContent :render-props="renderProps" />
        </template>
    </FileInput>
</template>
