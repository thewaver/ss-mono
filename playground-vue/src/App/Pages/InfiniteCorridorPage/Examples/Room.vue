<script setup lang="ts">
import type { InfiniteCorridorItemState } from "@thewaver/ss-components-vue";
import { HUE_STEP_DEGREES } from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/InfiniteCorridorPage/InfiniteCorridorPage.css";

type Props = {
    name: string;
    state: InfiniteCorridorItemState;
};

defineProps<Props>();
</script>

<template>
    <button
        type="button"
        :class="styles.room"
        :style="{ backgroundColor: `hsl(${state.index * HUE_STEP_DEGREES} 55% 28%)` }"
    >
        {{ name }}
    </button>
</template>
