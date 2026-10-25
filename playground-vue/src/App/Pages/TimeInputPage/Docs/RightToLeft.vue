<script setup lang="ts">
import { shallowRef } from "vue";

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

const value = shallowRef<TimeValue | undefined>({ hour: 14, minute: 30 });
</script>

<template>
    <div dir="rtl">
        <TimeInput
            v-model:value="value"
            :is-twelve-hour="true"
            ariaLabel="Time in a right-to-left box"
            :segment-hints="TIME_SEGMENT_HINTS"
            :padding="FIELD_STEPPER_PADDING"
            :gap="FIELD_GAP"
            :compute-text-style="computePageTextFieldTextStyle"
        >
            <template #renderContent="flags">
                <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" />
            </template>

            <template #renderTrailing="{ flags, meridiem }">
                <PageMeridiemToggle
                    :meridiem="meridiem.value"
                    :is-disabled="flags.isDisabled ?? false"
                    @toggle="meridiem.toggle"
                />
            </template>
        </TimeInput>
    </div>
</template>
