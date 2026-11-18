<script setup lang="ts">
import { h, shallowRef } from "vue";

import { FileInput } from "@thewaver/ss-components-vue";
import type { FileInputRenderProps, InteractionTooltipDefs } from "@thewaver/ss-components-vue";
import { DISABLED_BUT_REACHABLE_ATTACHMENT_LABEL } from "@thewaver/ss-playground/App/Pages/FileInputPage/FileInputPage.const";

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
    renderContent: ({ visibilityTarget, transitionDurationMs, arrowAim }) =>
        h(
            PageTooltipContent,
            { visibilityTarget, transitionDurationMs, arrowAim },
            () => "Focusable so this tooltip can be read, but the file dialog must not open.",
        ),
};
</script>

<template>
    <FileInput
        v-model:files="files"
        :is-disabled="isDisabled"
        :is-reachable-when-disabled="isReachableWhenDisabled"
        :ariaLabel="DISABLED_BUT_REACHABLE_ATTACHMENT_LABEL"
        :tooltip-defs="tooltipDefs"
    >
        <template #renderContent="renderProps">
            <PageFileInputContent :render-props="renderProps" />
        </template>
    </FileInput>
</template>
