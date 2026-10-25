<script setup lang="ts">
import { shallowRef } from "vue";

import { FileInput } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import PageFileInputContent from "../../../StyledComponents/FileInputContent/FileInputContent.vue";

const files = shallowRef<File[]>([]);
const rejection = shallowRef("");

const handleChange = (picked: File[]) => {
    const spaced = picked.find((file) => file.name.includes(" "));

    rejection.value = spaced ? `"${spaced.name}" has a space in its name, rename it and pick again` : "";

    if (spaced) files.value = [];
};
</script>

<template>
    <FileInput v-model:files="files" :has-error="rejection !== ''" ariaLabel="Attachment" @change="handleChange">
        <template #renderContent="renderProps">
            <PageFileInputContent :render-props="renderProps" />
        </template>
    </FileInput>

    <div :class="exampleStyles.exampleReadout" data-readout>
        {{ rejection || "A file whose name has a space in it is refused" }}
    </div>
</template>
