<script setup lang="ts">
import { shallowRef } from "vue";

import { PARTICLE_DISSOLVE_DEFAULTS } from "@thewaver/ss-components-vue";
import { ParticleDissolveKnobs } from "@thewaver/ss-playground/App/Knobs/ParticleDissolves.const";
import { ShapeConst } from "@thewaver/ss-utils";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import AngleKnob from "./AngleKnob.vue";
import SvgExample from "./Examples/Svg.vue";
import type { ParticleDissolveExampleProps } from "./ParticleDissolvePageVue.types";

const props = defineProps<ParticleDissolveExampleProps>();

const angleDegrees = shallowRef(PARTICLE_DISSOLVE_DEFAULTS.angleDegrees);
const shapeKind = shallowRef<ShapeConst.DefaultShape>(ParticleDissolveKnobs.STARTING_SHAPE_KIND);
</script>

<template>
    <SvgExample v-bind="props" :angle-degrees="angleDegrees" :shape-kind="shapeKind" />

    <PageExampleKnobs>
        <AngleKnob :value="angleDegrees" @input="(value: number) => (angleDegrees = value)" />

        <PageProp
            item-key="shapeKind"
            controls="Picks the built-in shape drawn into the SVG inside ParticleDissolve"
            label="Shape"
            hint="The SVG shape that dissolves. Particles rise only from inside the shape's fill and along its stroke, however its corners fall in the box."
        >
            <PageSelectField
                :value="shapeKind"
                :values="ShapeConst.DEFAULT_SHAPES"
                ariaLabel="Shape"
                @change="(kind: ShapeConst.DefaultShape) => (shapeKind = kind)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
