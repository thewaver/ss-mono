<script setup lang="ts">
import { useModel } from "vue";

import { FileInput } from "@thewaver/ss-components-vue";
import {
    DROP_ZONE_ACCEPT,
    DROP_ZONE_MAX_FILES,
    DROP_ZONE_MAX_SIZE_BYTES,
} from "@thewaver/ss-playground/App/Pages/FileInputPage/FileInputPage.const";

import PageFileDropZoneContent from "../../../StyledComponents/FileDropZoneContent/FileDropZoneContent.vue";
import type { FileInputDropZoneExampleProps } from "../FileInputPage.types";

type Props = FileInputDropZoneExampleProps;

const props = defineProps<Props>();

const files = useModel(props, "files");
</script>

<template>
    <FileInput
        v-model:files="files"
        is-multiple
        :max-files="DROP_ZONE_MAX_FILES"
        :max-size-bytes="DROP_ZONE_MAX_SIZE_BYTES"
        :accept="DROP_ZONE_ACCEPT"
        ariaLabel="Gallery images"
        @change="props.onRejectionsChange([])"
        @reject="props.onRejectionsChange"
    >
        <template #renderContent="renderProps">
            <PageFileDropZoneContent
                :render-props="renderProps"
                :prompt="renderProps.isDragOver ? 'Let go to add them' : 'Drop images here, or press to choose'"
            />
        </template>
    </FileInput>
</template>
