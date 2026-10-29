<script setup lang="ts">
import { computed, shallowRef } from "vue";

import {
    Button,
    CellAnimation,
    CellAnimationOrigins,
    MediaQueryMonitorVueUtils,
    SliceAnimationKeyframeUtils,
    SliceAnimationWeights,
    useViewportContext,
} from "@thewaver/ss-components-vue";
import type { SliceAnimationPlaybackOpts } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.css";
import type { Index2d, Size2d } from "@thewaver/ss-utils";

import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import type { CellAnimationExampleProps } from "../CellAnimationPage.types";

const WIPE_CELL_SIZE = 120;
const WIPE_LEG_MS = 600;
const WIPE_COLOR = "black";
const LOZENGE_COVER_PERCENT = 150;
const WIPE_PLAYBACK: SliceAnimationPlaybackOpts = { dir: "pipe", holdMs: 400 };
const LOZENGE_GROW = SliceAnimationKeyframeUtils.fromStops([
    { at: 0, rotate: 45, scaleX: 0, scaleY: 0 },
    { at: 1, rotate: 45, scaleX: LOZENGE_COVER_PERCENT, scaleY: LOZENGE_COVER_PERCENT },
]);

const computeSolidSource = (size: Size2d) =>
    `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}"><rect width="100%" height="100%" fill="${WIPE_COLOR}"/></svg>`,
    )}`;

type Props = Pick<CellAnimationExampleProps, "originType" | "weightType" | "weightOpts" | "breakpointOpts">;

const props = defineProps<Props>();

const viewportContext = useViewportContext();

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const wipeSize = shallowRef<Size2d>();

const cellCount = computed<Index2d>(() => ({
    col: Math.ceil((wipeSize.value?.width ?? 0) / WIPE_CELL_SIZE),
    row: Math.ceil((wipeSize.value?.height ?? 0) / WIPE_CELL_SIZE),
}));

const origin = computed(() => CellAnimationOrigins.computeOrigin(props.originType, cellCount.value));

const legMs = computed(() => (prefersReducedMotion.value ? 0 : WIPE_LEG_MS));

const wipe = () => {
    if (wipeSize.value) return;

    wipeSize.value = { ...viewportContext.getSize() };
};

const computeSliceWeights = (count: Index2d) =>
    SliceAnimationWeights.computeSliceWeights(props.weightType, count, origin.value, props.weightOpts);
</script>

<template>
    <Button id="cellAnimationWipe" @click="wipe">
        <template #renderContent="flags">
            <PageControlButtonContent :flags="flags">Wipe the screen</PageControlButtonContent>
        </template>
    </Button>

    <Teleport v-if="wipeSize" :to="viewportContext.getPortalRef() ?? 'body'">
        <div :class="styles.wipeOverlay">
            <CellAnimation
                :src="computeSolidSource(wipeSize)"
                :cell-count="cellCount"
                :origin="origin"
                :breakpoint-opts="breakpointOpts"
                :playback-opts="WIPE_PLAYBACK"
                :animation-duration-ms="legMs"
                :animation-iteration-count="1"
                final-frame="nothing"
                :compute-slice-weights="computeSliceWeights"
                :compute-slice-animation="LOZENGE_GROW"
                @animation-end="wipeSize = undefined"
            />
        </div>
    </Teleport>
</template>
