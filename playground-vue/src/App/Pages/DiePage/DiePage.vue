<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { DIE_DEFAULTS, DieShapes, MediaQueryMonitorVueUtils, RollerUtils } from "@thewaver/ss-components-vue";
import { DieKnobs } from "@thewaver/ss-playground/App/Knobs/Dice.const";
import {
    CLOUD_SIZE,
    DIE_SIZE,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIRST_NUMBER,
    ICON_CLOUD_EMPTY_LABEL,
    ICON_CLOUD_ICONS,
    ICON_CLOUD_TURN_MS,
    NO_MOTION_DURATION_MS,
    PLANET_ICONS,
    PLANET_SHAPE_KEY,
} from "@thewaver/ss-playground/App/Pages/DiePage/DiePage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import IconCloudExample from "./Examples/IconCloud.vue";
import PlanetExample from "./Examples/Planet.vue";
import TabletopExample from "./Examples/Tabletop.vue";

const shapeKey = shallowRef<DieShapes.SampleKey>(DieKnobs.STARTING_SHAPE_KEY);
const rollDurationMs = shallowRef(DIE_DEFAULTS.rollDurationMs);
const tumbleCount = shallowRef(DIE_DEFAULTS.tumbleCount);

const dieFace = shallowRef(0);
const cloudFace = shallowRef(0);
const cloudAutoSpin = shallowRef(true);
const planetFace = shallowRef(0);
const planetAutoSpin = shallowRef(true);

const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

const shownRollDurationMs = computed(() => (prefersReducedMotion.value ? NO_MOTION_DURATION_MS : rollDurationMs.value));

const shownSettleDurationMs = computed(() =>
    prefersReducedMotion.value ? NO_MOTION_DURATION_MS : DIE_DEFAULTS.settleDurationMs,
);

const shownMomentumMs = computed(() => (prefersReducedMotion.value ? NO_MOTION_DURATION_MS : DIE_DEFAULTS.momentumMs));

const shape = computed(() => DieShapes.SAMPLE_SHAPES[shapeKey.value]);

const cloudIdleDelayMs = computed(() =>
    prefersReducedMotion.value ? undefined : ICON_CLOUD_TURN_MS / shape.value.faces.length,
);

const planetShape = DieShapes.SAMPLE_SHAPES[PLANET_SHAPE_KEY];

const planetIdleDelayMs = computed(() =>
    prefersReducedMotion.value ? undefined : ICON_CLOUD_TURN_MS / planetShape.faces.length,
);

const examples: ExampleDefs[] = [
    {
        key: "tabletop",
        name: EXAMPLE_NAMES.tabletop,
        readout: () =>
            `showing ${dieFace.value + FIRST_NUMBER} of ${DieShapes.SAMPLE_SHAPES[shapeKey.value].faces.length} — the page picks the number, and the die tumbles and lands on it`,
        path: `${EXAMPLES_ROOT}/Tabletop.vue`,
    },
    {
        key: "iconCloud",
        name: EXAMPLE_NAMES.iconCloud,
        readout: () =>
            `${cloudAutoSpin.value ? "turning by itself" : "paused"}, facing ${ICON_CLOUD_ICONS[RollerUtils.clampFace(cloudFace.value, shape.value.faces.length)]?.label ?? ICON_CLOUD_EMPTY_LABEL} — drag it, or focus it and use the arrow keys, and it settles on the nearest icon`,
        path: `${EXAMPLES_ROOT}/IconCloud.vue`,
    },
    {
        key: "planet",
        name: EXAMPLE_NAMES.planet,
        readout: () =>
            `${planetAutoSpin.value ? "turning by itself" : "paused"}, facing ${PLANET_ICONS[RollerUtils.clampFace(planetFace.value, planetShape.faces.length)]?.label ?? ICON_CLOUD_EMPTY_LABEL} — the core stays turned towards you while the icons circle it`,
        path: `${EXAMPLES_ROOT}/Planet.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp item-key="shape" v-bind="DieKnobs.SHAPE_TEXT">
            <PageSelectField
                :value="shapeKey"
                :values="DieShapes.SAMPLE_KEYS"
                ariaLabel="Die"
                @change="(key: DieShapes.SampleKey) => (shapeKey = key)"
            />
        </PageProp>

        <PageProp item-key="rollDurationMs" v-bind="DieKnobs.ROLL_DURATION_MS_TEXT">
            <PageNumberField
                :value="rollDurationMs"
                :min="DieKnobs.MIN_ROLL_DURATION_MS"
                :max="DieKnobs.MAX_ROLL_DURATION_MS"
                :step="DieKnobs.ROLL_DURATION_STEP_MS"
                :is-disabled="prefersReducedMotion"
                ariaLabel="Roll duration in milliseconds"
                @input="(value: number) => (rollDurationMs = value)"
            />
        </PageProp>

        <PageProp item-key="tumbleCount" v-bind="DieKnobs.TUMBLE_COUNT_TEXT">
            <PageNumberField
                :value="tumbleCount"
                :min="DieKnobs.MIN_TUMBLE_COUNT"
                :max="DieKnobs.MAX_TUMBLE_COUNT"
                :step="DieKnobs.TUMBLE_COUNT_STEP"
                ariaLabel="Tumbles"
                @input="(value: number) => (tumbleCount = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #tabletop>
            <TabletopExample
                v-model:face="dieFace"
                :shape="shape"
                :size="DIE_SIZE"
                :roll-duration-ms="shownRollDurationMs"
                :settle-duration-ms="shownSettleDurationMs"
                :tumble-count="tumbleCount"
            />
        </template>

        <template #iconCloud>
            <IconCloudExample
                v-model:face="cloudFace"
                v-model:autoSpin="cloudAutoSpin"
                :shape="shape"
                :size="CLOUD_SIZE"
                :idle-delay-ms="cloudIdleDelayMs"
                :settle-duration-ms="shownSettleDurationMs"
                :momentum-ms="shownMomentumMs"
            />
        </template>

        <template #planet>
            <PlanetExample
                v-model:face="planetFace"
                v-model:autoSpin="planetAutoSpin"
                :shape="planetShape"
                :size="CLOUD_SIZE"
                :idle-delay-ms="planetIdleDelayMs"
                :settle-duration-ms="shownSettleDurationMs"
                :momentum-ms="shownMomentumMs"
            />
        </template>
    </PageExamples>
</template>
