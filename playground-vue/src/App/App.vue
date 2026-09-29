<script setup lang="ts">
import { computed, onScopeDispose, shallowRef } from "vue";

import { ViewportWrapper } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/App.css";
import { FunctionUtils, type Size2d } from "@thewaver/ss-utils";

import { FIXED_ANCHOR_RATIO } from "./App.const";
import { DEFAULT_VIEWPORT_ANCHOR } from "./PageComponents/NavSettings/NavSettings.const";
import type { ViewportAnchor } from "./PageComponents/NavSettings/NavSettings.types";

const SCREEN_HEIGHT = window.screen.height;

const getWindowInnerSize = () => ({ width: window.innerWidth, height: window.innerHeight });

const windowSize = shallowRef<Size2d>(getWindowInnerSize());
const viewportAnchor = shallowRef<ViewportAnchor>(DEFAULT_VIEWPORT_ANCHOR);

const viewportSize = computed(() => {
    const anchor = viewportAnchor.value;

    if (anchor === "none") return windowSize.value;

    if (anchor !== "auto") {
        return {
            width: Math.round((anchor * FIXED_ANCHOR_RATIO.width) / FIXED_ANCHOR_RATIO.height),
            height: anchor,
        };
    }

    const ratio = windowSize.value.width / windowSize.value.height;

    return ratio >= 1
        ? { width: Math.round(SCREEN_HEIGHT * ratio), height: SCREEN_HEIGHT }
        : { width: SCREEN_HEIGHT, height: Math.round(SCREEN_HEIGHT / ratio) };
});

const throttleResize = FunctionUtils.trailingThrottle(() => {
    windowSize.value = getWindowInnerSize();
}, 10);

window.addEventListener("resize", throttleResize);

onScopeDispose(() => {
    window.removeEventListener("resize", throttleResize);
    throttleResize.cancel();
});
</script>

<template>
    <div id="app" :class="styles.appRoot">
        <RouterView v-slot="{ Component }">
            <ViewportWrapper v-if="Component" :size="viewportSize">
                <component :is="Component" v-model:viewport-anchor="viewportAnchor" />
            </ViewportWrapper>
        </RouterView>
    </div>
</template>
