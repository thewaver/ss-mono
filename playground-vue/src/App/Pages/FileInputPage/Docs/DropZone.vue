<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { FileInput } from "@thewaver/ss-components-vue";
import type { FileInputRejection } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    DROP_ZONE_ACCEPT,
    DROP_ZONE_MAX_FILES,
    DROP_ZONE_MAX_SIZE_BYTES,
    DROP_ZONE_REASON_TEXT,
} from "@thewaver/ss-playground/App/Pages/FileInputPage/FileInputPage.const";

import PageFileDropZoneContent from "../../../StyledComponents/FileDropZoneContent/FileDropZoneContent.vue";

const files = shallowRef<File[]>([]);
const rejections = shallowRef<FileInputRejection[]>([]);

const readout = computed(
    () =>
        `Refused: ${
            rejections.value
                .map((rejection) => `${rejection.file.name}, ${DROP_ZONE_REASON_TEXT[rejection.reason]}`)
                .join("; ") || "nothing"
        }`,
);
</script>

<template>
    <FileInput
        v-model:files="files"
        is-multiple
        :max-files="DROP_ZONE_MAX_FILES"
        :max-size-bytes="DROP_ZONE_MAX_SIZE_BYTES"
        :accept="DROP_ZONE_ACCEPT"
        ariaLabel="Gallery images"
        @change="() => (rejections = [])"
        @reject="(next: FileInputRejection[]) => (rejections = next)"
    >
        <template #renderContent="renderProps">
            <PageFileDropZoneContent
                :render-props="renderProps"
                :prompt="renderProps.isDragOver ? 'Let go to add them' : 'Drop images here, or press to choose'"
            />
        </template>
    </FileInput>

    <div :class="exampleStyles.exampleReadout" data-readout>
        {{ readout }}
    </div>
</template>
