<script setup lang="ts">
import { h, shallowRef } from "vue";

import { FileInput } from "@thewaver/ss-components-vue";
import type { FileInputRenderProps, InteractionTooltipDefs } from "@thewaver/ss-components-vue";

import PageFileInputContent from "../../../StyledComponents/FileInputContent/FileInputContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { FileInputTooltipDocsExampleProps } from "../FileInputPageVue.types";

type Props = FileInputTooltipDocsExampleProps;

defineProps<Props>();

const files = shallowRef<File[]>([]);

const tooltipDefs: InteractionTooltipDefs<FileInputRenderProps> = {
    placement: { x: "center", y: "top_out" },
    offset: { x: 0, y: 10 },
    hoverShowDelayMs: 0,
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(
            PageTooltipContent,
            { visibilityTarget, transitionDurationMs },
            () => "Focusable so this tooltip can be read, but the file dialog must not open.",
        ),
};
</script>

<template>
    <FileInput
        v-model:files="files"
        :is-disabled="isDisabled"
        :is-reachable-when-disabled="isReachableWhenDisabled"
        ariaLabel="Disabled but reachable attachment"
        :tooltip-defs="tooltipDefs"
    >
        <template #renderContent="renderProps">
            <PageFileInputContent :render-props="renderProps" />
        </template>
    </FileInput>
</template>
