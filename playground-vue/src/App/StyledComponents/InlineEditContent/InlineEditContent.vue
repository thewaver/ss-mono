<script setup lang="ts">
import { computed } from "vue";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/InlineEditContent/InlineEditContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { InlineEditContentProps } from "./InlineEditContent.types";

const props = defineProps<InlineEditContentProps>();

const layerClass = useLayerClass();

const isHinted = computed(
    () => !props.flags.isDisabled && (props.flags.isHovered === true || props.flags.isFocusVisible === true),
);
</script>

<template>
    <div
        :class="[
            styles.inlineEditContent,
            layerClass,
            isHinted && styles.isHinted,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <span :class="styles.inlineEditText"><slot /></span>

        <span :class="styles.inlineEditGlyph" aria-hidden="true">✎</span>
    </div>
</template>
