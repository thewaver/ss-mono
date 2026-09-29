<script setup lang="ts">
import { type ComponentPublicInstance, computed, onScopeDispose, shallowRef, useModel, watch } from "vue";

import type { DateValue } from "@thewaver/ss-components-vue";
import { Button, DateValueUtils, FocusManagerUtils, toElement } from "@thewaver/ss-components-vue";
import { FunctionUtils } from "@thewaver/ss-utils";

import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageCalendarCaptionFields from "../../StyledComponents/CalendarContent/PageCalendarCaptionFields.vue";
import PageCalendarHeader from "../../StyledComponents/CalendarContent/PageCalendarHeader.vue";
import PageCalendarTitle from "../../StyledComponents/CalendarContent/PageCalendarTitle.vue";
import PageNumberField from "../Field/PageNumberField.vue";
import PageSelectField from "../Field/PageSelectField.vue";
import type { PageCalendarCaptionProps } from "./CalendarCaption.types";

const MONTH_STEP = 1;
const MONTH_FIELD_WIDTH = 122;
const YEAR_FIELD_WIDTH = 80;
const YEAR_SETTLE_MS = 300;
const TITLE_OPTIONS: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };
const PAST_ERA_TITLE_OPTIONS: Intl.DateTimeFormatOptions = { ...TITLE_OPTIONS, era: "short" };

const props = defineProps<PageCalendarCaptionProps>();

const month = useModel(props, "month");

const isEditing = shallowRef(false);
const isRestoringFocus = shallowRef(false);
const titleRef = shallowRef<HTMLElement>();
const fieldsRef = shallowRef<HTMLElement>();

let restorePoint: DateValue | undefined;
let pendingYear: number | undefined;

const monthNames = computed(() => DateValueUtils.getMonthNames(month.value, props.locale));

const monthValues = computed(() =>
    Array.from({ length: DateValueUtils.getMonthsInYear(month.value) }, (_, index) => index + 1),
);

const title = computed(() => {
    const eras = DateValueUtils.getEras(month.value, props.locale);
    const isPastEra = month.value.era !== eras[eras.length - 1].id;

    return DateValueUtils.format(month.value, isPastEra ? PAST_ERA_TITLE_OPTIONS : TITLE_OPTIONS, props.locale);
});

const setTitleRef = (target: Element | ComponentPublicInstance | null) => {
    titleRef.value = toElement(target);
};

const setFieldsRef = (target: Element | ComponentPublicInstance | null) => {
    fieldsRef.value = toElement(target);
};

const jumpTo = (value: { year?: number; month?: number }) => {
    month.value = month.value.set({ ...value, day: 1 });
};

const page = (direction: 1 | -1) => {
    month.value = DateValueUtils.addMonths(month.value, direction * MONTH_STEP);
};

const writeYear = FunctionUtils.debounce((year: number) => {
    pendingYear = undefined;
    jumpTo({ year });
}, YEAR_SETTLE_MS);

const queueYear = (year: number) => {
    if (!isEditing.value) return;

    pendingYear = year;
    writeYear(year);
};

const settleYear = () => {
    writeYear.cancel();

    if (pendingYear === undefined) return;

    jumpTo({ year: pendingYear });
    pendingYear = undefined;
};

const startEditing = () => {
    restorePoint = month.value;
    isEditing.value = true;
};

const stopEditing = (restoreFocus: boolean) => {
    settleYear();
    isRestoringFocus.value = restoreFocus;
    isEditing.value = false;
};

const abandonEditing = () => {
    writeYear.cancel();
    pendingYear = undefined;

    isRestoringFocus.value = true;
    isEditing.value = false;

    if (restorePoint) month.value = restorePoint;
};

const handleFieldsKeyDown = (e: KeyboardEvent) => {
    if (e.defaultPrevented) return;

    if (e.key === "Enter") {
        e.preventDefault();
        stopEditing(true);
    } else if (e.key === "Escape") {
        e.preventDefault();
        abandonEditing();
    }
};

const handleFieldsFocusOut = (e: FocusEvent) => {
    if (!isEditing.value) return;
    if ((e.currentTarget as HTMLElement).contains(e.relatedTarget as Node | null)) return;

    stopEditing(false);
};

watch(
    [isEditing, isRestoringFocus, titleRef, fieldsRef],
    ([editing, restoring, title, fields]) => {
        if (editing) {
            FocusManagerUtils.getFirstFocusableChild(fields)?.focus();

            return;
        }

        if (!restoring || !title?.isConnected) return;

        isRestoringFocus.value = false;
        title.focus();
    },
    { flush: "post" },
);

onScopeDispose(writeYear.cancel);
</script>

<template>
    <PageCalendarHeader>
        <Button :id="`${itemKey}PreviousMonth`" ariaLabel="Previous month" @click="page(-1)">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">◀</PageButtonContent>
            </template>
        </Button>

        <PageCalendarCaptionFields
            v-if="isEditing"
            :ref="setFieldsRef"
            @keydown="handleFieldsKeyDown"
            @focusout="handleFieldsFocusOut"
        >
            <PageSelectField
                :value="month.month"
                :values="monthValues"
                :width="MONTH_FIELD_WIDTH"
                ariaLabel="Month"
                :compute-label="(value: number) => monthNames[value - 1]"
                @change="(value: number) => jumpTo({ month: value })"
            />

            <PageNumberField :value="month.year" :width="YEAR_FIELD_WIDTH" ariaLabel="Year" @input="queueYear" />
        </PageCalendarCaptionFields>

        <Button
            v-else
            :id="`${itemKey}MonthTitle`"
            :ref="setTitleRef"
            :ariaLabel="`${title}, pick a month and year`"
            @click="startEditing"
        >
            <template #renderContent="flags">
                <PageCalendarTitle :flags="flags">{{ title }}</PageCalendarTitle>
            </template>
        </Button>

        <Button :id="`${itemKey}NextMonth`" ariaLabel="Next month" @click="page(1)">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">▶</PageButtonContent>
            </template>
        </Button>
    </PageCalendarHeader>
</template>
