<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { ElementObserverVueUtils, ViewportWrapper } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/PageComponents/Preview/Preview.css";

import { providePreviewContext } from "./Preview.context";
import type { PagePreviewProps } from "./Preview.types";

defineProps<PagePreviewProps>();

providePreviewContext(true);

const bodyRef = shallowRef<HTMLElement>();

const bodySize = ElementObserverVueUtils.useBorderBoxSize(bodyRef);

const size = computed(() => ({
    width: styles.PREVIEW_WIDTH,
    height: Math.max(styles.PREVIEW_MIN_HEIGHT, bodySize.value.height + styles.PREVIEW_PADDING * 2),
}));
</script>

<template>
    <ViewportWrapper :size="size">
        <div :class="styles.previewContent">
            <div ref="bodyRef" :class="styles.previewBody"><component :is="component" /></div>
        </div>
    </ViewportWrapper>
</template>
