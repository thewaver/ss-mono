<script setup lang="ts">
import { useModel } from "vue";

import { TimeInput } from "@thewaver/ss-components-vue";
import { TIME_SEGMENT_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import type { TimeValue } from "@thewaver/ss-utils";

import PageMeridiemToggle from "../../../PageComponents/MeridiemToggle/MeridiemToggle.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import type { TimeExampleProps } from "../../DatePickerPage/DatePickerPage.types";

type Props = TimeExampleProps & {
    ariaLabel: string;
    isTwelveHour?: boolean;
    hasSeconds?: boolean;
    minValue?: TimeValue;
    maxValue?: TimeValue;
};

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <TimeInput
        v-model:value="value"
        :is-twelve-hour="isTwelveHour"
        :has-seconds="hasSeconds"
        :min-value="minValue"
        :max-value="maxValue"
        :ariaLabel="ariaLabel"
        :segment-hints="TIME_SEGMENT_HINTS"
        :padding="FIELD_STEPPER_PADDING"
        :gap="FIELD_GAP"
        :compute-text-style="computePageTextFieldTextStyle"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" />
        </template>

        <template #renderPlaceholder="{ flags, hint }">
            <PageTextFieldPlaceholder :flags="flags">{{ hint }}</PageTextFieldPlaceholder>
        </template>

        <template v-if="isTwelveHour" #renderTrailing="{ flags, meridiem }">
            <PageMeridiemToggle
                :meridiem="meridiem.value"
                :is-disabled="flags.isDisabled ?? false"
                @toggle="meridiem.toggle"
            />
        </template>
    </TimeInput>
</template>
