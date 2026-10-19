<script setup lang="ts">
import { toCheckValue } from "@thewaver/ss-playground/App/PageComponents/Knobs/Knobs.utils";

import PageCheckField from "../Field/PageCheckField.vue";
import PageNumberField from "../Field/PageNumberField.vue";
import PageProp from "../Prop/Prop.vue";
import type { Knob, PageKnobsProps } from "./Knobs.types";

const props = defineProps<PageKnobsProps>();

const toEntries = (knobs: Record<string, Knob | undefined>) =>
    Object.entries(knobs).filter((entry): entry is [string, Knob] => entry[1] !== undefined);

const getValue = (key: string) => props.values[key] ?? props.defaults[key];
</script>

<template>
    <PageProp
        v-for="[key, knob] in toEntries(knobs)"
        :key="key"
        :item-key="key"
        :label="knob.label"
        :hint="knob.hint"
        :controls="knob.controls"
        :default-value="defaults[key]"
    >
        <PageNumberField
            v-if="knob.kind === 'number'"
            :value="Number(getValue(key))"
            :reset-value="Number(defaults[key])"
            :min="knob.min"
            :max="knob.max"
            :step="knob.step"
            :width="width"
            :ariaLabel="knob.label"
            @input="(value: number) => props.onInput(key, value)"
        />

        <PageCheckField
            v-else
            :value="Boolean(getValue(key))"
            :reset-value="Boolean(defaults[key])"
            :ariaLabel="knob.label"
            @change="(value: boolean) => props.onInput(key, toCheckValue(defaults[key], value))"
        />
    </PageProp>
</template>
