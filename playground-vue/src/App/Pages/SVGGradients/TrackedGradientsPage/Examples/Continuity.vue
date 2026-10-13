<script setup lang="ts">
import { TRACKED_CELLS } from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.css";

import type { TrackedGradientExampleProps } from "../../SVGGradientsVue.types";
import TrackedShape from "./TrackedShape.vue";

type Props = TrackedGradientExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <div :class="styles.trackedGrid">
        <TrackedShape v-for="cell in TRACKED_CELLS" :key="cell" v-bind="props" :box-class="styles.trackedCell" />
    </div>
</template>
