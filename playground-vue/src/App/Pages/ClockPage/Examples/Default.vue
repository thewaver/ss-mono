<script setup lang="ts">
import { useModel } from "vue";

import { Clock } from "@thewaver/ss-components-vue";
import type { ClockSteps } from "@thewaver/ss-components-vue";
import { LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import type { TimeValue } from "@thewaver/ss-utils";

import PageClockColumn from "../../../StyledComponents/ClockContent/PageClockColumn.vue";
import PageClockFrame from "../../../StyledComponents/ClockContent/PageClockFrame.vue";
import PageClockOption from "../../../StyledComponents/ClockContent/PageClockOption.vue";
import PageClockUnit from "../../../StyledComponents/ClockContent/PageClockUnit.vue";

type Props = {
    "value": TimeValue | undefined;
    "onUpdate:value"?: (value: TimeValue | undefined) => void;
    "ariaLabel": string;
    "isTwelveHour"?: boolean;
    "hasSeconds"?: boolean;
    "steps"?: ClockSteps;
    "minValue"?: TimeValue;
    "maxValue"?: TimeValue;
};

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <PageClockFrame>
        <Clock
            v-model:value="value"
            :locale="LOCALE"
            :ariaLabel="ariaLabel"
            :is-twelve-hour="isTwelveHour"
            :has-seconds="hasSeconds"
            :steps="steps"
            :min-value="minValue"
            :max-value="maxValue"
        >
            <template #renderOption="{ flags }">
                <PageClockOption :render-props="flags" />
            </template>

            <template #renderUnit="{ name }">
                <PageClockUnit>{{ name }}</PageClockUnit>
            </template>

            <template #renderColumn="{ renderOptions }">
                <PageClockColumn><component :is="renderOptions" /></PageClockColumn>
            </template>
        </Clock>
    </PageClockFrame>
</template>
