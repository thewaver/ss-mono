<script setup lang="ts">
import type { OdometerSlotFlags } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/OdometerPage/OdometerPage.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

type FadeProps = {
    className: string;
    flags: OdometerSlotFlags;
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
