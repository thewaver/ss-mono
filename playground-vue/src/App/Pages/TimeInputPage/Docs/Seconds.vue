<script setup lang="ts">
import { shallowRef } from "vue";

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
import type { TimeInputSecondsDocsExampleProps } from "../TimeInputPageVue.types";

type Props = TimeInputSecondsDocsExampleProps;

defineProps<Props>();

const value = shallowRef<TimeValue | undefined>({ hour: 9, minute: 30, second: 0 });
</script>

<template>
    <TimeInput
        v-model:value="value"
        :has-seconds="hasSeconds"
        ariaLabel="Exact time"
        :segment-hints="TIME_SEGMENT_HINTS"
        :padding="FIELD_PADDING"
        :gap="FIELD_GAP"
        :compute-text-style="computePageTextFieldTextStyle"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" />
        </template>
    </TimeInput>
</template>
