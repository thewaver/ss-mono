<script setup lang="ts">
import { shallowRef } from "vue";

import { FileInput, Label } from "@thewaver/ss-components-vue";

import PageFileInputContent from "../../../StyledComponents/FileInputContent/FileInputContent.vue";
import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";

const LABEL_GAP = 5;

const files = shallowRef<File[]>([]);
</script>

<template>
    <Label orientation="vertical" :gap="LABEL_GAP">
        <PageLabelCaption>Contract</PageLabelCaption>

        <FileInput v-model:files="files">
            <template #renderContent="renderProps">
                <PageFileInputContent :render-props="renderProps" />
            </template>
        </FileInput>
    </Label>
</template>
