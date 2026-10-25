<script setup lang="ts">
import { h, shallowRef } from "vue";

import type { InteractionTooltipDefs, TextFieldFlags } from "@thewaver/ss-components-vue";
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

import PageClockColumn from "../../../StyledComponents/ClockContent/PageClockColumn.vue";
import PageClockFrame from "../../../StyledComponents/ClockContent/PageClockFrame.vue";
import PageClockOption from "../../../StyledComponents/ClockContent/PageClockOption.vue";
import PageClockUnit from "../../../StyledComponents/ClockContent/PageClockUnit.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import PageTimePickerTrigger from "../../../StyledComponents/TimePickerTrigger/TimePickerTrigger.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { TimePickerTooltipDocsExampleProps } from "../TimePickerPageVue.types";

type Props = TimePickerTooltipDocsExampleProps;

defineProps<Props>();

const value = shallowRef<TimeValue | undefined>({ hour: 9, minute: 30 });

const tooltipDefs: InteractionTooltipDefs<TextFieldFlags> = {
    placement: { x: "center", y: "top_out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(PageTooltipContent, { visibilityTarget, transitionDurationMs }, () => "A tooltip on a time picker."),
};
</script>

<template>
    <TimePicker
        v-model:value="value"
        :is-disabled="isDisabled"
        :is-reachable-when-disabled="isReachableWhenDisabled"
        ariaLabel="Time with a tooltip"
        clock-label="Choose a time"
        :segment-hints="TIME_SEGMENT_HINTS"
        :locale="LOCALE"
        :padding="FIELD_STEPPER_PADDING"
        :gap="FIELD_GAP"
        :compute-text-style="computePageTextFieldTextStyle"
        :tooltip-defs="tooltipDefs"
        trigger-id="tooltipTrigger"
        :trigger-aria-label="CLOCK_TRIGGER_LABEL"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" />
        </template>

        <template #renderPlaceholder="{ flags, hint }">
            <PageTextFieldPlaceholder :flags="flags">{{ hint }}</PageTextFieldPlaceholder>
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
