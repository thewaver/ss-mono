<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ScrollerBarContent/ScrollerBarContent.css";

import type { ScrollerBarContentProps } from "./ScrollerBarContentVue.types";

defineProps<ScrollerBarContentProps>();
</script>

<template>
    <div
        :class="[
            styles.scrollerBar,
            styles.scrollerBarVariants[renderProps.axis],
            !renderProps.isShown && styles.isHidden,
        ]"
    >
        <div
            :ref="setTrackRef"
            :class="[styles.scrollerBarTrack, styles.scrollerBarTrackVariants[renderProps.axis]]"
            :style="{ flex: trackLength === undefined ? undefined : `0 0 ${trackLength}px` }"
        >
            <div
                :ref="setThumbRef"
                :class="[
                    styles.scrollerBarThumb,
                    styles.scrollerBarThumbVariants[renderProps.axis],
                    renderProps.isDragging && styles.isDragging,
                ]"
                :style="
                    renderProps.axis === 'x'
                        ? {
                              insetInlineStart: `${renderProps.thumbOffset}px`,
                              width: `${renderProps.thumbLength}px`,
                          }
                        : { top: `${renderProps.thumbOffset}px`, height: `${renderProps.thumbLength}px` }
                "
            />
        </div>
    </div>
</template>
