<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SelectGroupContent/SelectGroupContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SelectGroupContentProps } from "./SelectGroupContent.types";

const CHECKED_MARK = "✓";
const MIXED_MARK = "–";

defineProps<SelectGroupContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[styles.selectGroupContent, layerClass]"
        :data-checked-state="flags === undefined ? undefined : String(flags.checkedState)"
        aria-hidden="true"
    >
        <div
            v-if="flags"
            :class="[
                styles.selectGroupMark,
                flags.checkedState === true && styles.isChecked,
                flags.checkedState === 'mixed' && styles.isMixed,
            ]"
        >
            {{ flags.checkedState === "mixed" ? MIXED_MARK : CHECKED_MARK }}
        </div>

        <slot />
    </div>
</template>
