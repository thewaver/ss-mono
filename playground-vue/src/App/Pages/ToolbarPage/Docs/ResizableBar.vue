<script setup lang="ts">
import { shallowRef, watch } from "vue";

import { ElementObserverVueUtils } from "@thewaver/ss-components-vue";
import { NO_WIDTH } from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.css";

import { useLayerClass } from "../../../StyledComponents/Layer/Layer.context";
import type { ResizableBarProps } from "../ToolbarPageVue.types";

const props = defineProps<ResizableBarProps>();

const layerClass = useLayerClass();

const resizerRef = shallowRef<HTMLDivElement>();

const size = ElementObserverVueUtils.useBorderBoxSize(resizerRef, () => props.width === undefined);

watch(
    [resizerRef, () => props.width, () => Math.round(size.value.width)],
    ([resizer, width, measured]) => {
        if (!resizer || width === undefined || measured <= NO_WIDTH) return;

        if (resizer.style.width === `${width}px`) return;

        props.onResize?.(measured);
    },
    { flush: "post" },
);
</script>

<template>
    <div
        ref="resizerRef"
        :class="width === undefined ? styles.docsResizer : styles.resizer"
        :style="{ width: width === undefined ? undefined : `${width}px` }"
    >
        <div :class="[styles.bar, layerClass]"><slot /></div>
    </div>
</template>
