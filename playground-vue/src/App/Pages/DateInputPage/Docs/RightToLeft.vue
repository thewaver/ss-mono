<script setup lang="ts">
import { shallowRef } from "vue";

import type { DateValue } from "@thewaver/ss-components-vue";
import { DateInput } from "@thewaver/ss-components-vue";
import { DATE_PART_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FIELD_WIDTH, LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import PageEraCycle from "../../../PageComponents/EraCycle/EraCycle.vue";
import PageTextFieldContent, {
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent.vue";
import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.vue";

const value = shallowRef<DateValue | undefined>(TODAY);
</script>

<template>
    <div dir="rtl">
        <DateInput
            v-model:value="value"
            :locale="LOCALE"
            ariaLabel="Date in a right-to-left box"
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

            <template #renderLeading="{ flags, era }">
                <PageEraCycle
                    :era="era.value"
                    :options="era.options"
                    :is-disabled="flags.isDisabled ?? false"
                    @change="era.set"
                />
            </template>
        </DateInput>
    </div>
</template>
