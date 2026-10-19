<script setup lang="ts">
import { computed, shallowRef, watch } from "vue";

import { Bracket, BracketUtils, Button } from "@thewaver/ss-components-vue";
import type { BracketNode, BracketStep } from "@thewaver/ss-components-vue";
import { BracketKnobs } from "@thewaver/ss-playground/App/Knobs/Brackets.const";
import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageCheckField from "../../../PageComponents/Field/PageCheckField.vue";
import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.vue";
import type { BracketFamilyExampleProps } from "../BracketPage.types";
import { branch, computeFamilySteps, describeFamily, seed } from "../BracketPageVue.const";
import PageBracketLayerHeader from "../PageBracketLayerHeader.vue";
import PageBracketNode from "../PageBracketNode.vue";

const NODE_SIZE = { width: 96, height: 34 };
const ROUND_NAMES = ["Final", "Semifinals", "Quarterfinals", "Entrants"];
const ACROSS_HEADER_SIZE = 24;
const DOWN_HEADER_SIZE = 96;

const DRAW: BracketNode<string> = branch(
    "Final",
    branch("Semi 1", branch("Quarter 1", seed("Ada"), seed("Bo")), branch("Quarter 2", seed("Cai"), seed("Dee"))),
    branch("Semi 2", branch("Quarter 3", seed("Eli"), seed("Fay")), branch("Quarter 4", seed("Gus"), seed("Hal"))),
);

const LAYOUT = BracketUtils.computeLayout(DRAW);

type Props = BracketFamilyExampleProps;

const props = defineProps<Props>();

const family = shallowRef<BracketNode<string>>();
const isSnapping = shallowRef(BracketKnobs.STARTING_IS_SNAPPING_TO_FAMILY);

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

const computeFamilyView = () =>
    BracketUtils.computeFamilyView(
        LAYOUT,
        treeGeometry.value,
        BracketUtils.findNodeId(DRAW, LAYOUT, family.value),
        BracketKnobs.FAMILY_MARGIN,
    );

const view = shallowRef(computeFamilyView());

const isZoomedIn = computed(
    () =>
        BracketUtils.computeFamilyInView(
            LAYOUT,
            treeGeometry.value,
            view.value,
            frameSize.value.height / frameSize.value.width,
            BracketKnobs.FAMILY_MARGIN,
        ) !== undefined,
);

const computeStep = (step: BracketStep) => BracketUtils.computeFamilyStep(DRAW, family.value, step);

const toggleZoom = () => {
    view.value = isZoomedIn.value ? BracketUtils.computeWholeView(treeGeometry.value) : computeFamilyView();
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
                <Bracket
                    v-model:family="family"
                    v-model:view="view"
                    :root="DRAW"
                    :node-size="NODE_SIZE"
                    is-following-family
                    :is-snapping-to-family="isSnapping"
                    :family-margin="BracketKnobs.FAMILY_MARGIN"
                    :transition-duration-ms="transitionDurationMs"
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
                        <PageBracketLayerHeader :names="ROUND_NAMES" :layer="layer" :is-current="state.isCurrent" />
                    </template>
                </Bracket>
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

        <PageExampleKnobs>
            <PageProp
                item-key="isSnappingToFamily"
                controls="Sets BracketProps.isSnappingToFamily"
                label="Snap to family"
                hint="Glides the window to frame the family in it once a drag, a pinch or the wheel is over."
            >
                <PageCheckField
                    :value="isSnapping"
                    ariaLabel="Snap to family"
                    @change="(value: boolean) => (isSnapping = value)"
                />
            </PageProp>
        </PageExampleKnobs>
    </div>
</template>
