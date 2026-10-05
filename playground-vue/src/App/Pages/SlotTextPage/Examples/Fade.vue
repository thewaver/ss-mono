<script setup lang="ts">
import type { SlotTextSlotFlags } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

type FadeProps = {
    className: string;
    flags: SlotTextSlotFlags;
    durationMs: number;
};

defineProps<FadeProps>();
</script>

<template>
    <div
        :class="[className, flags.isEntering && styles.isEntering, flags.isLeaving && styles.isLeaving]"
        :style="assignInlineVars({ [styles.fadeDurationVar]: `${durationMs}ms` })"
    >
        <slot />
    </div>
</template>
