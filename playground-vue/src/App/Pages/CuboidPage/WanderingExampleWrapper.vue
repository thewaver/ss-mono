<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { CuboidKnobs } from "@thewaver/ss-playground/App/Knobs/Cuboids.const";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/CuboidPage/CuboidPage.const";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import type { CuboidExampleProps } from "./CuboidPage.types";
import WanderingExample from "./Examples/Wandering.vue";

type Props = CuboidExampleProps;

const props = defineProps<Props>();

const yaw = useModel(props, "yaw");
const pitch = useModel(props, "pitch");

const turnIntervalMs = shallowRef(CuboidKnobs.STARTING_TURN_INTERVAL_MS);
const isTurning = shallowRef(CuboidKnobs.STARTING_IS_TURNING);
</script>

<template>
    <WanderingExample
        v-model:yaw="yaw"
        v-model:pitch="pitch"
        :size="size"
        :transition-duration-ms="transitionDurationMs"
        :turn-interval-ms="isTurning ? turnIntervalMs : undefined"
    />

    <PageExampleKnobs>
        <PageProp item-key="isTurning" v-bind="CuboidKnobs.IS_TURNING_TEXT">
            <PageCheckField
                :value="isTurning"
                ariaLabel="Turns by itself"
                @change="(value: boolean) => (isTurning = value)"
            />
        </PageProp>

        <PageProp item-key="turnIntervalMs" v-bind="CuboidKnobs.TURN_INTERVAL_MS_TEXT">
            <PageNumberField
                :value="turnIntervalMs"
                :min="CuboidKnobs.MIN_TURN_INTERVAL_MS"
                :max="CuboidKnobs.MAX_TURN_INTERVAL_MS"
                :step="CuboidKnobs.TURN_INTERVAL_STEP_MS"
                :width="FIELD_WIDTH"
                :is-disabled="!isTurning"
                ariaLabel="Turn interval in milliseconds"
                @input="(value: number) => (turnIntervalMs = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
