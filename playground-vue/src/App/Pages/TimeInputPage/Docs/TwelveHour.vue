<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { TimeInput } from "@thewaver/ss-components-vue";
import { TIME_SEGMENT_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
import { TimeUtils } from "@thewaver/ss-utils";
import type { TimeValue } from "@thewaver/ss-utils";

import PageMeridiemToggle from "../../../PageComponents/MeridiemToggle/MeridiemToggle.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import type { TimeInputTwelveHourDocsExampleProps } from "../TimeInputPageVue.types";

type Props = TimeInputTwelveHourDocsExampleProps;

defineProps<Props>();

const value = shallowRef<TimeValue | undefined>({ hour: 14, minute: 30 });

const valueText = computed(() => (value.value ? TimeUtils.toIso(value.value) : "nothing"));
</script>

<template>
    <TimeInput
        v-model:value="value"
        :is-twelve-hour="isTwelveHour"
        ariaLabel="Meeting time"
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
                v-if="isTwelveHour"
                :meridiem="meridiem.value"
                :is-disabled="flags.isDisabled ?? false"
                @toggle="meridiem.toggle"
            />
        </template>
    </TimeInput>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Value: ${valueText}` }}</div>
</template>
