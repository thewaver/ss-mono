<script setup lang="ts">
import { computed, shallowRef, watch } from "vue";

import { Bracket, BracketUtils, Button } from "@thewaver/ss-components-vue";
import type { BracketNode, BracketStep } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";
import { EasingUtils, MathUtils } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import { branch, computeFamilySteps, describeFamily, seed } from "../BracketPage.const";
import type { BracketFamilyExampleProps } from "../BracketPage.types";
import PageBracketLayerHeader from "../PageBracketLayerHeader.vue";
import PageBracketNode from "../PageBracketNode.vue";

const NODE_SIZE = { width: 96, height: 34 };
const ROUND_NAMES = ["Final", "Semifinals", "Quarterfinals", "Entrants"];
const ACROSS_HEADER_SIZE = 24;
const DOWN_HEADER_SIZE = 96;
const SECTION_MARGIN_PX = 12;
const WHOLE = 1;
const HALF = 0.5;
const NO_DURATION = 0;

const DRAW: BracketNode<string> = branch(
    "Final",
    branch("Semi 1", branch("Quarter 1", seed("Ada"), seed("Bo")), branch("Quarter 2", seed("Cai"), seed("Dee"))),
    branch("Semi 2", branch("Quarter 3", seed("Eli"), seed("Fay")), branch("Quarter 4", seed("Gus"), seed("Hal"))),
);

const LAYOUT = BracketUtils.computeLayout(DRAW);

type Props = BracketFamilyExampleProps;

const props = defineProps<Props>();

const family = shallowRef<BracketNode<string>>();
const isZoomedIn = shallowRef(true);

const headerSize = computed(() => (props.orientation === "horizontal" ? ACROSS_HEADER_SIZE : DOWN_HEADER_SIZE));

const geometryOpts = computed(() => ({
    nodeSize: NODE_SIZE,
    layerGap: props.layerGap,
    crossGap: props.crossGap,
    orientation: props.orientation,
    rootSide: props.rootSide,
    headerExtent: headerSize.value,
}));

const frameSize = computed(
    () => BracketUtils.computeGeometry(BracketUtils.computeFamilyExtent(LAYOUT), geometryOpts.value).boardSize,
);

const treeGeometry = computed(() => BracketUtils.computeGeometry(LAYOUT, geometryOpts.value));

const isHorizontal = computed(() => treeGeometry.value.isHorizontal);

const computeSectionBox = () => {
    const anchorId = BracketUtils.findNodeId(DRAW, LAYOUT, family.value);
    const insets = LAYOUT.placements
        .filter((placement) => BracketUtils.getIsInFamily(placement.id, anchorId))
        .map((placement) => BracketUtils.computeInset(treeGeometry.value, placement));
    const left =
        Math.min(...insets.map((inset) => inset.left)) -
        SECTION_MARGIN_PX -
        (isHorizontal.value ? 0 : headerSize.value);
    const top =
        Math.min(...insets.map((inset) => inset.top)) - SECTION_MARGIN_PX - (isHorizontal.value ? headerSize.value : 0);
    const right = Math.max(...insets.map((inset) => inset.left)) + NODE_SIZE.width + SECTION_MARGIN_PX;
    const bottom = Math.max(...insets.map((inset) => inset.top)) + NODE_SIZE.height + SECTION_MARGIN_PX;

    return { left, top, width: right - left, height: bottom - top };
};

const targetCamera = computed(() => {
    const frame = frameSize.value;
    const box = isZoomedIn.value ? computeSectionBox() : { left: 0, top: 0, ...treeGeometry.value.boardSize };
    const scale = Math.min(frame.width / box.width, frame.height / box.height, WHOLE);

    return {
        x: frame.width * HALF - (box.left + box.width * HALF) * scale,
        y: frame.height * HALF - (box.top + box.height * HALF) * scale,
        scale,
    };
});

const camera = shallowRef(targetCamera.value);

watch(targetCamera, (target, _previous, onCleanup) => {
    const from = camera.value;
    const durationMs = props.transitionDurationMs ?? NO_DURATION;
    const startMs = performance.now();

    if (durationMs <= NO_DURATION) {
        camera.value = target;

        return;
    }

    let frameId = requestAnimationFrame(function glide(nowMs) {
        const ratio = EasingUtils.easeInOutCubic(MathUtils.clamp01((nowMs - startMs) / durationMs));

        camera.value = {
            x: MathUtils.lerp(from.x, target.x, ratio),
            y: MathUtils.lerp(from.y, target.y, ratio),
            scale: MathUtils.lerp(from.scale, target.scale, ratio),
        };

        if (ratio < WHOLE) frameId = requestAnimationFrame(glide);
    });

    onCleanup(() => cancelAnimationFrame(frameId));
});

const cameraStyle = computed(() => {
    const { x, y, scale } = camera.value;
    const pin = (offset: number) => `${-offset / scale}px`;

    return {
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        ...assignInlineVars({
            [styles.headerPinXVar]: isHorizontal.value ? "0px" : pin(x),
            [styles.headerPinYVar]: isHorizontal.value ? pin(y) : "0px",
        }),
    };
});

const computeStep = (step: BracketStep) => BracketUtils.computeFamilyStep(DRAW, family.value, step);

const toggleZoom = () => {
    isZoomedIn.value = !isZoomedIn.value;
};

const showStep = (step: BracketStep) => {
    family.value = computeStep(step);
};

watch(family, (next) => props.onFamilyChange(describeFamily(DRAW.value, next?.value)), { immediate: true });
</script>

<template>
    <div :class="styles.familyStage">
        <PageMeasureBox>
            <div
                :class="styles.familyFrame"
                :style="{ width: `${frameSize.width}px`, height: `${frameSize.height}px` }"
            >
                <div :class="styles.familyCamera" :style="cameraStyle">
                    <div :class="styles.board">
                        <Bracket
                            v-model:family="family"
                            :root="DRAW"
                            :node-size="NODE_SIZE"
                            :layer-gap="layerGap"
                            :cross-gap="crossGap"
                            :orientation="orientation"
                            :root-side="rootSide"
                            :layer-header-size="headerSize"
                            ariaLabel="Knockout draw, one family at a time"
                            @activate="props.onActivate"
                        >
                            <template #renderConnector="defs">
                                <component :is="() => renderConnector(defs)" />
                            </template>

                            <template #renderNode="{ node, state }">
                                <PageBracketNode :node="node" :state="state" />
                            </template>

                            <template #renderLayerHeader="{ layer, state }">
                                <PageBracketLayerHeader
                                    :names="ROUND_NAMES"
                                    :layer="layer"
                                    is-pinned
                                    :is-current="state.isCurrent"
                                />
                            </template>
                        </Bracket>
                    </div>
                </div>
            </div>
        </PageMeasureBox>

        <div :class="styles.familyControls">
            <Button id="familyZoom" :ariaLabel="isZoomedIn ? 'Zoom out' : 'Zoom in'" @click="toggleZoom">
                <template #renderContent="flags">
                    <PageControlButtonContent
                        :flags="flags"
                        :glyph="isZoomedIn ? CONTROL_GLYPHS.zoomOut : CONTROL_GLYPHS.zoomIn"
                    />
                </template>
            </Button>

            <Button
                v-for="entry in computeFamilySteps(orientation)"
                :id="`familyStep-${entry.step}`"
                :key="entry.step"
                :is-disabled="!isZoomedIn || computeStep(entry.step) === family"
                :ariaLabel="entry.label"
                @click="showStep(entry.step)"
            >
                <template #renderContent="flags">
                    <PageControlButtonContent :flags="flags" :glyph="entry.glyph" />
                </template>
            </Button>
        </div>
    </div>
</template>
