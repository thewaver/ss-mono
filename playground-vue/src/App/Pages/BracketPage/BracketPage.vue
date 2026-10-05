<script setup lang="ts">
import { computed, h, shallowRef } from "vue";

import {
    BRACKET_DEFAULTS,
    BRACKET_ORIENTATIONS,
    BRACKET_ROOT_SIDES,
    BracketConnectors,
    MediaQueryMonitorVueUtils,
} from "@thewaver/ss-components-vue";
import type { BracketOrientation, BracketRootSide } from "@thewaver/ss-components-vue";
import { BracketKnobs } from "@thewaver/ss-playground/App/Knobs/Brackets.const";
import {
    CONNECTOR_FROM_COLOR,
    CONNECTOR_TO_COLOR,
    ROUTE_FROM_COLOR,
    ROUTE_TO_COLOR,
} from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import PageBeam from "../../StyledComponents/Beam/Beam.vue";
import { BEAM_PATHS, NOTHING_PICKED } from "./BracketPage.const";
import type { BracketExampleProps } from "./BracketPage.types";
import FamilyExample from "./Examples/Family.vue";
import KnockoutExample from "./Examples/Knockout.vue";
import OrgChartExample from "./Examples/OrgChart.vue";
import SkillTreeExample from "./Examples/SkillTree.vue";

const EXAMPLES_ROOT = "/src/App/Pages/BracketPage/Examples";

const CONNECTOR_RADIUS = 14;
const CONNECTOR_WIDTH = 2;
const ROUTE_CONNECTOR_WIDTH = 3;
const WIDE_SPAN = 2;
const NO_MOTION_DURATION_MS = 0;

const layerGap = shallowRef(BRACKET_DEFAULTS.layerGap);
const crossGap = shallowRef(BRACKET_DEFAULTS.crossGap);
const orientation = shallowRef<BracketOrientation>(BRACKET_DEFAULTS.orientation);
const rootSide = shallowRef<BracketRootSide>(BRACKET_DEFAULTS.rootSide);
const connector = shallowRef<BracketConnectors.SampleKey>(BracketConnectors.SAMPLE_KEYS[0]);
const picked = shallowRef(NOTHING_PICKED);
const transitionDurationMs = shallowRef(BRACKET_DEFAULTS.transitionDurationMs);
const family = shallowRef("");

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const isBeamPlaying = shallowRef(!prefersReducedMotion.value);

const commonProps = computed<BracketExampleProps>(() => ({
    layerGap: layerGap.value,
    crossGap: crossGap.value,
    orientation: orientation.value,
    rootSide: rootSide.value,
    onActivate: (value, placement) => {
        picked.value = `${value}, node ${placement.id} in layer ${placement.layer}`;
    },
    renderConnector: (defs) => [
        BracketConnectors.SAMPLE_CONNECTORS[connector.value]({
            defs,
            radius: CONNECTOR_RADIUS,
            width: defs.isOnFocusedRoute ? ROUTE_CONNECTOR_WIDTH : CONNECTOR_WIDTH,
            fromColor: defs.isOnFocusedRoute ? ROUTE_FROM_COLOR : CONNECTOR_FROM_COLOR,
            toColor: defs.isOnFocusedRoute ? ROUTE_TO_COLOR : CONNECTOR_TO_COLOR,
        }),
        defs.isOnFocusedRoute
            ? h(PageBeam, {
                  d: BEAM_PATHS[connector.value](defs, CONNECTOR_RADIUS),
                  direction: "backward",
                  isPlaying: isBeamPlaying.value,
              })
            : null,
    ],
}));

const examples: ExampleDefs[] = [
    {
        key: "knockout",
        name: "Knockout",
        span: WIDE_SPAN,
        readout: () =>
            `picked: ${picked.value} — a full draw with its rounds named, every node feeding exactly two, and one seed withdrawn so the walk steps past it; focus a seed and its road to the final lights up`,
        path: `${EXAMPLES_ROOT}/Knockout.vue`,
    },
    {
        key: "orgChart",
        name: "Org chart",
        span: WIDE_SPAN,
        readout: () =>
            "an uneven tree: three under one node, two under another, one that goes no further — a parent still lands between the outermost of the nodes it holds, whichever way round the board is turned",
        path: `${EXAMPLES_ROOT}/OrgChart.vue`,
    },
    {
        key: "skillTree",
        name: "Skill tree",
        readout: () =>
            "a chain of single children, which is what a bye looks like — each one level with the last, under headers that turn with the board",
        path: `${EXAMPLES_ROOT}/SkillTree.vue`,
    },
    {
        key: "family",
        name: "One family at a time",
        span: WIDE_SPAN,
        readout: () =>
            `showing: ${family.value} — focus a node and the board shows what it feeds, it with all its siblings, and what feeds them; walk on with the arrows, or page through with the buttons without leaving them, and the rest folds away`,
        path: `${EXAMPLES_ROOT}/Family.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="connector"
            label="Connectors"
            hint="The line drawn between a match and the one it feeds: straight, elbowed, or curved."
        >
            <PageSelectField
                :value="connector"
                :values="BracketConnectors.SAMPLE_KEYS"
                ariaLabel="Connectors"
                @change="(next: BracketConnectors.SampleKey) => (connector = next)"
            />
        </PageProp>

        <PageProp
            item-key="isBeamPlaying"
            label="Beams moving"
            hint="Whether the pulse runs along the lines between the focused node and the final. It starts stopped while the visitor has asked for reduced motion."
        >
            <PageCheckField
                :value="isBeamPlaying"
                ariaLabel="Beams moving"
                @change="(value: boolean) => (isBeamPlaying = value)"
            />
        </PageProp>

        <PageProp item-key="orientation" label="Orientation" hint="Whether the rounds run across the page or down it.">
            <PageSelectField
                :value="orientation"
                :values="BRACKET_ORIENTATIONS"
                ariaLabel="Orientation"
                @change="(next: BracketOrientation) => (orientation = next)"
            />
        </PageProp>

        <PageProp
            item-key="rootSide"
            label="Root side"
            hint="Which end the final holds, and so which way the rounds read."
        >
            <PageSelectField
                :value="rootSide"
                :values="BRACKET_ROOT_SIDES"
                ariaLabel="Root side"
                @change="(side: BracketRootSide) => (rootSide = side)"
            />
        </PageProp>

        <PageProp item-key="layerGap" label="Layer gap (px)" hint="The space between one round and the next.">
            <PageNumberField
                :value="layerGap"
                :min="BracketKnobs.MIN_LAYER_GAP"
                :max="BracketKnobs.MAX_LAYER_GAP"
                :step="BracketKnobs.LAYER_GAP_STEP"
                ariaLabel="Layer gap in pixels"
                @input="(value: number) => (layerGap = value)"
            />
        </PageProp>

        <PageProp item-key="crossGap" label="Row gap (px)" hint="The space between two matches in the same round.">
            <PageNumberField
                :value="crossGap"
                :min="BracketKnobs.MIN_CROSS_GAP"
                :max="BracketKnobs.MAX_CROSS_GAP"
                :step="BracketKnobs.CROSS_GAP_STEP"
                ariaLabel="Row gap in pixels"
                @input="(value: number) => (crossGap = value)"
            />
        </PageProp>

        <PageProp
            item-key="transitionDurationMs"
            label="Glide (ms)"
            hint="How long the family example takes to glide from one family to the next. It is off while the visitor has asked for reduced motion."
        >
            <PageNumberField
                :value="transitionDurationMs"
                :min="BracketKnobs.MIN_TRANSITION_DURATION_MS"
                :max="BracketKnobs.MAX_TRANSITION_DURATION_MS"
                :step="BracketKnobs.TRANSITION_DURATION_STEP_MS"
                :is-disabled="prefersReducedMotion"
                ariaLabel="Glide in milliseconds"
                @input="(value: number) => (transitionDurationMs = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" layout="flow">
        <template #knockout>
            <PageMeasureBox>
                <KnockoutExample v-bind="commonProps" />
            </PageMeasureBox>
        </template>

        <template #orgChart>
            <PageMeasureBox>
                <OrgChartExample v-bind="commonProps" />
            </PageMeasureBox>
        </template>

        <template #skillTree>
            <PageMeasureBox>
                <SkillTreeExample v-bind="commonProps" />
            </PageMeasureBox>
        </template>

        <template #family>
            <FamilyExample
                v-bind="commonProps"
                :transition-duration-ms="prefersReducedMotion ? NO_MOTION_DURATION_MS : transitionDurationMs"
                @family-change="(next: string) => (family = next)"
            />
        </template>
    </PageExamples>
</template>
