<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.css";

import PagePaintAreaGroup from "../../../../PageComponents/PaintAreaGroup/PaintAreaGroup.vue";
import { TRACKED_CELLS } from "../../SVGGradients.const";
import type { TrackedGradientExampleProps } from "../../SVGGradients.types";
import TrackedShape from "./TrackedShape.vue";

type Props = TrackedGradientExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <PagePaintAreaGroup :group-class="styles.trackedGrid" :cell-count="TRACKED_CELLS.length">
        <template #cell="cell">
            <TrackedShape
                v-bind="props"
                :box-class="styles.trackedCell"
                :group-element="cell.groupElement"
                :group-size="cell.groupSize"
            />
        </template>
    </PagePaintAreaGroup>
</template>
