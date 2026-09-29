<script setup lang="ts">
import { computed, shallowRef } from "vue";

import {
    Button,
    CellAnimation,
    CellAnimationBreakpointUtils,
    CellAnimationKeyframeUtils,
    CellAnimationOrigins,
    CellAnimationPlaybackUtils,
    CellAnimationWeights,
    MediaQueryMonitorVueUtils,
    useViewportContext,
} from "@thewaver/ss-components-vue";
import type { CellAnimationEvaluationDefs, CellAnimationPlaybackOpts } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.css";
import type { Index2d, Size2d } from "@thewaver/ss-utils";

import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.vue";
import type { CellAnimationExampleProps } from "../CellAnimationPage.types";

const WIPE_CELL_SIZE = 120;
const WIPE_LEG_MS = 600;
const WIPE_COLOR = "black";
const LOZENGE_COVER_PERCENT = 150;
const WIPE_PLAYBACK: CellAnimationPlaybackOpts = { dir: "pipe", holdMs: 400 };
const LOZENGE_GROW = CellAnimationKeyframeUtils.fromStops([
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

const computeCellWeights = (count: Index2d) =>
    CellAnimationWeights.computeCellWeights(props.weightType, count, origin.value, props.weightOpts);

const computeCellAnimation = (defs: CellAnimationEvaluationDefs, timeline: number) =>
    CellAnimationKeyframeUtils.computeAnimation(
        LOZENGE_GROW,
        CellAnimationBreakpointUtils.computeBreakpoints(
            defs.weight,
            CellAnimationPlaybackUtils.computeBreakpointOpts(props.breakpointOpts, timeline, WIPE_PLAYBACK),
        ),
        { ...defs, origin: origin.value },
        CellAnimationPlaybackUtils.computeGlobalTimeline(timeline, legMs.value, WIPE_PLAYBACK),
        props.breakpointOpts.easing,
    );
</script>

<template>
    <Button id="cellAnimationWipe" @click="wipe">
        <template #renderContent="flags">
            <PageButtonContent :flags="flags">Wipe the screen</PageButtonContent>
        </template>
    </Button>

    <Teleport v-if="wipeSize" :to="viewportContext.getPortalRef() ?? 'body'">
        <div :class="styles.wipeOverlay">
            <CellAnimation
                :src="computeSolidSource(wipeSize)"
                :cell-count="cellCount"
                :animation-duration-ms="CellAnimationPlaybackUtils.computeCycleDurationMs(legMs, WIPE_PLAYBACK)"
                :animation-iteration-count="1"
                final-frame="nothing"
                :compute-cell-weights="computeCellWeights"
                :compute-cell-animation="computeCellAnimation"
                @animation-end="wipeSize = undefined"
            />
        </div>
    </Teleport>
</template>
