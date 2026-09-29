<script setup lang="ts">
import { useModel } from "vue";

import { Label, Radio, RadioGroup } from "@thewaver/ss-components-vue";

import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";
import PageRadioContent from "../../../StyledComponents/RadioContent/RadioContent.vue";
import type { LabelRadioExampleProps, PlanValue } from "../LabelPage.types";

const GAP = 20;

const PLAN_OPTIONS: { value: PlanValue; label: string }[] = [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
];

type Props = LabelRadioExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
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
