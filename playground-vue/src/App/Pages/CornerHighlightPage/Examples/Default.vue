<script setup lang="ts">
import { CornerHighlight } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/CornerHighlightPage/CornerHighlightPage.css";

import type { CornerHighlightExampleProps } from "../CornerHighlightPageVue.types";

type Props = CornerHighlightExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.frame">
        <CornerHighlight
            :color="color"
            :corner-length="cornerLength"
            :stroke-thickness="strokeThickness"
            :transition-duration-ms="transitionDurationMs"
            :visible-corners="visibleCorners"
        >
            <div :class="styles.frameBody">Whatever it is put around</div>
        </CornerHighlight>
    </div>
</template>
