<script setup lang="ts">
import { shallowRef } from "vue";

import { Label, Radio, RadioGroup } from "@thewaver/ss-components-vue";
import type { PlanValue } from "@thewaver/ss-playground/App/Pages/LabelPage/LabelPage.types";

import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";
import PageRadioContent from "../../../StyledComponents/RadioContent/RadioContent.vue";

const GAP = 20;

const PLAN_OPTIONS: { value: PlanValue; label: string }[] = [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
];

const value = shallowRef<PlanValue>("free");
</script>

<template>
    <RadioGroup v-model:value="value" ariaLabel="Plan" :gap="GAP">
        <Label v-for="option in PLAN_OPTIONS" :key="option.value">
            <Radio :value="option.value">
                <template #renderContent="flags">
                    <PageRadioContent :flags="flags" />
                </template>
            </Radio>

            <PageLabelCaption>{{ option.label }}</PageLabelCaption>
        </Label>
    </RadioGroup>
</template>
