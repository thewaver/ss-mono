<script setup lang="ts">
import { computed, shallowRef } from "vue";

import type { DateValue } from "@thewaver/ss-components-vue";
import { DateInput, DateValueUtils } from "@thewaver/ss-components-vue";
import { DATE_PART_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { FIELD_WIDTH, LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";
import type { DateInputDayFirstDocsExampleProps } from "../DateInputPageVue.types";

type Props = DateInputDayFirstDocsExampleProps;

defineProps<Props>();

const value = shallowRef<DateValue | undefined>(TODAY);

const valueText = computed(() => (value.value ? DateValueUtils.toIso(value.value) : "nothing"));
</script>

<template>
    <DateInput
        v-model:value="value"
        :format="format"
        :locale="LOCALE"
        ariaLabel="Day-first date"
        :part-hints="DATE_PART_HINTS"
        :padding="FIELD_PADDING"
        :gap="FIELD_GAP"
        :compute-text-style="computePageTextFieldTextStyle"
    >
        <template #renderContent="flags">
            <PageTextFieldContent :flags="flags" :width="FIELD_WIDTH" />
        </template>

        <template #renderPlaceholder="{ flags, hint }">
            <PageTextFieldPlaceholder :flags="flags">{{ hint }}</PageTextFieldPlaceholder>
        </template>
    </DateInput>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Value: ${valueText}` }}</div>
</template>
