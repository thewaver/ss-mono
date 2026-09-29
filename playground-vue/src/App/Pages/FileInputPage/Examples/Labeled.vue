<script setup lang="ts">
import { useModel } from "vue";

import { FileInput, Label } from "@thewaver/ss-components-vue";

import PageFileInputContent from "../../../StyledComponents/FileInputContent/FileInputContent.vue";
import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";
import type { FileInputExampleProps } from "../FileInputPage.types";

const LABEL_GAP = 5;

type Props = FileInputExampleProps;

const props = defineProps<Props>();

const files = useModel(props, "files");
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
