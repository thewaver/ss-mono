<script setup lang="ts">
import { h, shallowRef } from "vue";

import type { InteractionTooltipDefs, TextFieldFlags } from "@thewaver/ss-components-vue";
import { TimeInput } from "@thewaver/ss-components-vue";
import { TIME_SEGMENT_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import type { TimeValue } from "@thewaver/ss-utils";

import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { TimeInputTooltipDocsExampleProps } from "../TimeInputPageVue.types";

type Props = TimeInputTooltipDocsExampleProps;

defineProps<Props>();

const value = shallowRef<TimeValue | undefined>({ hour: 9, minute: 30 });

const tooltipDefs: InteractionTooltipDefs<TextFieldFlags> = {
    placement: { x: "center", y: "top_out" },
    offset: { x: 0, y: 10 },
    renderContent: ({ visibilityTarget, transitionDurationMs }) =>
        h(PageTooltipContent, { visibilityTarget, transitionDurationMs }, () => "A tooltip on a time field."),
};
</script>

<template>
    <TimeInput
        v-model:value="value"
        :is-disabled="isDisabled"
        :is-reachable-when-disabled="isReachableWhenDisabled"
        ariaLabel="Time with a tooltip"
        :segment-hints="TIME_SEGMENT_HINTS"
        :padding="FIELD_PADDING"
        :gap="FIELD_GAP"
        :compute-text-style="computePageTextFieldTextStyle"
        :tooltip-defs="tooltipDefs"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" />
        </template>
    </TimeInput>
</template>
