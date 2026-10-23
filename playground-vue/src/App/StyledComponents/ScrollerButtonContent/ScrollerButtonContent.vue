<script setup lang="ts">
import {
    SCROLLER_GLYPH_POINTS,
    SCROLLER_GLYPH_VIEW_BOX,
} from "@thewaver/ss-playground/App/StyledComponents/ScrollerButtonContent/ScrollerButtonContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ScrollerButtonContent/ScrollerButtonContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { ScrollerButtonContentProps } from "./ScrollerButtonContentVue.types";

defineProps<ScrollerButtonContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.scrollerButton,
            layerClass,
            flags.isHovered && styles.isHovered,
            flags.isActive && styles.isActive,
            flags.isDisabled && styles.isDisabled,
        ]"
        aria-hidden="true"
    >
        <svg
            :class="[styles.scrollerButtonGlyph, styles.scrollerButtonGlyphVariants[axis ?? 'x'][step]]"
            :viewBox="SCROLLER_GLYPH_VIEW_BOX"
        >
            <polyline :points="SCROLLER_GLYPH_POINTS" />
        </svg>
    </div>
</template>
