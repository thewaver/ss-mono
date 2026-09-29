<script setup lang="ts">
import { computed, shallowRef, useModel } from "vue";

import { ParticleFieldKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleFields.const";
import { ShapeConst } from "@thewaver/ss-utils";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import ShapedExample from "./Examples/Shaped.vue";
import type { ParticleFieldExampleProps } from "./ParticleFieldPage.types";

const SHAPED_BOX_SIZE = 320;

const props = defineProps<ParticleFieldExampleProps>();

const playback = useModel(props, "playback");

const shapeKind = shallowRef<ShapeConst.DefaultShape>(ParticleFieldKnobs.STARTING_SHAPE_KIND);
const joinRadius = shallowRef(ParticleFieldKnobs.STARTING_JOIN_RADIUS);

const fieldProps = computed(() => ({
    cellCount: props.cellCount,
    spawnChance: props.spawnChance,
    animationIterationDelayMs: props.animationIterationDelayMs,
    animationDurationMs: props.animationDurationMs,
    particleLifetimeMs: props.particleLifetimeMs,
    originType: props.originType,
    weightType: props.weightType,
    animationType: props.animationType,
    holdShare: props.holdShare,
    isScattered: props.isScattered,
}));
</script>

<template>
    <PageMeasureBox :width="SHAPED_BOX_SIZE" :height="SHAPED_BOX_SIZE">
        <ShapedExample
            v-bind="fieldProps"
            v-model:playback="playback"
            :shape-kind="shapeKind"
            :join-radius="joinRadius"
        />
    </PageMeasureBox>

    <PageExampleKnobs>
        <PageProp
            item-key="shapeKind"
            label="Shape"
            hint="The area particles may appear in. A cell spawns only when its center is inside it."
        >
            <PageSelectField
                :value="shapeKind"
                :values="ShapeConst.DEFAULT_SHAPES"
                ariaLabel="Shape"
                @change="(kind: ShapeConst.DefaultShape) => (shapeKind = kind)"
            />
        </PageProp>

        <PageProp
            item-key="joinRadius"
            label="Corner radius"
            hint="How far each corner of the area is rounded, as the Shape page rounds them."
        >
            <PageNumberField
                :value="joinRadius"
                :min="ParticleFieldKnobs.MIN_JOIN_RADIUS"
                :max="ParticleFieldKnobs.MAX_JOIN_RADIUS"
                :step="ParticleFieldKnobs.JOIN_RADIUS_STEP"
                ariaLabel="Corner radius"
                @input="(value: number) => (joinRadius = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
