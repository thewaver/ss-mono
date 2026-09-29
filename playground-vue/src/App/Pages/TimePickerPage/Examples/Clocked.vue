<script setup lang="ts">
import { useModel } from "vue";

import type { ClockSteps } from "@thewaver/ss-components-vue";
import { TimePicker } from "@thewaver/ss-components-vue";
import {
    CLOCK_TRIGGER_LABEL,
    TIME_SEGMENT_HINTS,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import type { TimeValue } from "@thewaver/ss-utils";

import PageMeridiemToggle from "../../../PageComponents/MeridiemToggle/MeridiemToggle.vue";
import PageClockColumn from "../../../StyledComponents/ClockContent/PageClockColumn.vue";
import PageClockFrame from "../../../StyledComponents/ClockContent/PageClockFrame.vue";
import PageClockOption from "../../../StyledComponents/ClockContent/PageClockOption.vue";
import PageClockUnit from "../../../StyledComponents/ClockContent/PageClockUnit.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import PageTimePickerTrigger from "../../../StyledComponents/TimePickerTrigger/TimePickerTrigger.vue";
import type { TimeExampleProps } from "../../DatePickerPage/DatePickerPage.types";

type Props = TimeExampleProps & {
    itemKey: string;
    ariaLabel: string;
    isTwelveHour?: boolean;
    hasSeconds?: boolean;
    clockSteps?: ClockSteps;
    minValue?: TimeValue;
    maxValue?: TimeValue;
};

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <TimePicker
        v-model:value="value"
        :is-twelve-hour="isTwelveHour"
        :has-seconds="hasSeconds"
        :clock-steps="clockSteps"
        :min-value="minValue"
        :max-value="maxValue"
        :ariaLabel="ariaLabel"
        clock-label="Choose a time"
        :segment-hints="TIME_SEGMENT_HINTS"
        :locale="LOCALE"
        :padding="FIELD_STEPPER_PADDING"
        :gap="FIELD_GAP"
        :compute-text-style="computePageTextFieldTextStyle"
        :trigger-id="`${itemKey}Trigger`"
        :trigger-aria-label="CLOCK_TRIGGER_LABEL"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" />
        </template>

        <template #renderPlaceholder="{ flags, hint }">
            <PageTextFieldPlaceholder :flags="flags">{{ hint }}</PageTextFieldPlaceholder>
        </template>

        <template #renderTrailing="{ flags, meridiem }">
            <PageMeridiemToggle
                v-if="isTwelveHour"
                :meridiem="meridiem.value"
                :is-disabled="flags.isDisabled ?? false"
                @toggle="meridiem.toggle"
            />
        </template>

        <template #renderTrigger="{ flags }">
            <PageTimePickerTrigger :flags="flags" />
        </template>

        <template #renderOption="{ flags }">
            <PageClockOption :render-props="flags" />
        </template>

        <template #renderUnit="{ name }">
            <PageClockUnit>{{ name }}</PageClockUnit>
        </template>

        <template #renderColumn="{ renderOptions }">
            <PageClockColumn><component :is="renderOptions" /></PageClockColumn>
        </template>

        <template #renderPopup="{ renderClock }">
            <PageClockFrame><component :is="renderClock" /></PageClockFrame>
        </template>
    </TimePicker>
</template>
