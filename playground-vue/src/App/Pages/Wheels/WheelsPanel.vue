<script setup lang="ts">
import { FIELD_WIDTH, SPIN_STYLE_KEYS } from "@thewaver/ss-playground/App/Pages/Wheels/Wheels.const";

import { WheelKnobs } from "../../Knobs/Wheels.const";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import type { WheelSpinStyleKey, WheelsPanelProps } from "./Wheels.types";

defineProps<WheelsPanelProps>();
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp item-key="wedgeCount" label="Wedges" hint="How many wedges the wheel is divided into.">
            <PageNumberField
                :value="controls.wedgeCount.value"
                :min="WheelKnobs.MIN_WEDGE_COUNT"
                :max="WheelKnobs.MAX_WEDGE_COUNT"
                :step="WheelKnobs.WEDGE_COUNT_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Wedges"
                @input="(value: number) => (controls.wedgeCount.value = value)"
            />
        </PageProp>

        <PageProp
            item-key="spinDurationMs"
            label="Spin duration (ms)"
            hint="How long a spin takes from the moment it is started to the moment it stops."
        >
            <PageNumberField
                :value="controls.spinDuration.value"
                :min="WheelKnobs.MIN_DURATION_MS"
                :max="WheelKnobs.MAX_DURATION_MS"
                :step="WheelKnobs.DURATION_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="Spin duration"
                @input="(value: number) => (controls.spinDuration.value = value)"
            />
        </PageProp>

        <PageProp
            item-key="turns"
            label="Turns per spin"
            hint="How many full turns a spin makes before it comes to rest on its wedge."
        >
            <PageNumberField
                :value="controls.turns.value"
                :min="WheelKnobs.MIN_TURNS"
                :max="WheelKnobs.MAX_TURNS"
                :step="WheelKnobs.TURNS_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Turns per spin"
                @input="(value: number) => (controls.turns.value = value)"
            />
        </PageProp>

        <PageProp
            item-key="settleDurationMs"
            label="Settle duration (ms)"
            hint="How long the wheel takes to ease into its final position once the spin is over."
        >
            <PageNumberField
                :value="controls.settleDuration.value"
                :min="WheelKnobs.MIN_DURATION_MS"
                :max="WheelKnobs.MAX_DURATION_MS"
                :step="WheelKnobs.DURATION_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="Settle duration"
                @input="(value: number) => (controls.settleDuration.value = value)"
            />
        </PageProp>

        <PageProp
            item-key="doesResume"
            label="Turns again after a spin"
            hint="Lets the wheel start turning by itself again after a spin, instead of standing still."
        >
            <PageCheckField
                :value="controls.doesResume.value"
                ariaLabel="Turns again after a spin"
                @change="(value: boolean) => (controls.doesResume.value = value)"
            />
        </PageProp>

        <PageProp
            item-key="restDurationMs"
            label="Rest after a spin (ms)"
            hint="How long the wheel stands still after a spin before it resumes. It only applies when it turns again."
        >
            <PageNumberField
                :value="controls.restDuration.value"
                :min="WheelKnobs.MIN_DURATION_MS"
                :max="WheelKnobs.MAX_DURATION_MS"
                :step="WheelKnobs.DURATION_STEP_MS"
                :width="FIELD_WIDTH"
                :is-disabled="!controls.doesResume.value"
                ariaLabel="Rest after a spin"
                @input="(value: number) => (controls.restDuration.value = value)"
            />
        </PageProp>

        <PageProp
            item-key="isIdlingAllowed"
            label="Turns by itself"
            hint="Lets the wheel turn slowly on its own while nobody is spinning it."
        >
            <PageCheckField
                :value="controls.isIdlingAllowed.value"
                ariaLabel="Turns by itself"
                @change="(value: boolean) => (controls.isIdlingAllowed.value = value)"
            />
        </PageProp>

        <PageProp
            item-key="idleDelayMs"
            label="Idle step delay (ms)"
            hint="How long the wheel waits between steps of its idle turn. It only applies while idling is on."
        >
            <PageNumberField
                :value="controls.idleDelay.value"
                :min="WheelKnobs.MIN_IDLE_DELAY_MS"
                :max="WheelKnobs.MAX_IDLE_DELAY_MS"
                :step="WheelKnobs.IDLE_DELAY_STEP_MS"
                :width="FIELD_WIDTH"
                :is-disabled="!controls.isIdlingAllowed.value"
                ariaLabel="Idle step delay"
                @input="(value: number) => (controls.idleDelay.value = value)"
            />
        </PageProp>

        <PageProp
            item-key="spinStyleKey"
            label="Spin style"
            hint="The speed curve a spin follows, which is what makes it feel heavy or snappy."
        >
            <PageSelectField
                :value="controls.spinStyle.value"
                :values="SPIN_STYLE_KEYS"
                :width="FIELD_WIDTH"
                ariaLabel="Spin style"
                @change="(value: WheelSpinStyleKey) => (controls.spinStyle.value = value)"
            />
        </PageProp>

        <PageProp
            item-key="isDisabled"
            label="Disabled"
            hint="Turns the wheel off, so it can neither be spun nor turn by itself."
        >
            <PageCheckField
                :value="controls.isDisabled.value"
                ariaLabel="Disabled"
                @change="(value: boolean) => (controls.isDisabled.value = value)"
            />
        </PageProp>
    </PagePropsPanel>
</template>
