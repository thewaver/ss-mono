<script setup lang="ts">
import { shallowRef, useModel } from "vue";

import { CuboidKnobs } from "@thewaver/ss-playground/App/Knobs/Cuboids.const";

import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import type { CuboidExampleProps } from "./CuboidPage.types";
import WanderingExample from "./Examples/Wandering.vue";

const FIELD_WIDTH = 110;

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
        <PageProp
            item-key="isTurning"
            label="Turns by itself"
            hint="Lets the box turn to a new face on its own, without anybody clicking it."
        >
            <PageCheckField
                :value="isTurning"
                ariaLabel="Turns by itself"
                @change="(value: boolean) => (isTurning = value)"
            />
        </PageProp>

        <PageProp
            item-key="turnIntervalMs"
            label="Turn every (ms)"
            hint="How long the box rests on a face before turning to the next one. It only applies while the box turns by itself."
        >
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
