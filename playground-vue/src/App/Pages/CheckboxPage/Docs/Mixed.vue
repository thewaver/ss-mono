<script setup lang="ts">
import { computed, shallowRef, watchEffect } from "vue";

import { Checkbox } from "@thewaver/ss-components-vue";

import PageControlRow from "../../../PageComponents/ControlRow/PageControlRow.vue";
import PageControlRowLabel from "../../../PageComponents/ControlRow/PageControlRowLabel.vue";
import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.vue";

const all = shallowRef(false);
const first = shallowRef(true);
const second = shallowRef(false);

const isMixed = computed(() => first.value !== second.value);

watchEffect(() => {
    all.value = first.value && second.value;
});

const setChildren = (isChecked: boolean) => {
    first.value = isChecked;
    second.value = isChecked;
};
</script>

<template>
    <PageControlRow>
        <Checkbox id="selectAll" v-model:checked="all" :is-mixed="isMixed" ariaLabel="Select all" @change="setChildren">
            <template #renderContent="flags">
                <PageCheckboxContent :flags="flags">Select all</PageCheckboxContent>
            </template>
        </Checkbox>

        <PageControlRowLabel>controls</PageControlRowLabel>

        <Checkbox id="firstChild" v-model:checked="first" ariaLabel="First child">
            <template #renderContent="flags">
                <PageCheckboxContent :flags="flags">First child</PageCheckboxContent>
            </template>
        </Checkbox>

        <Checkbox v-model:checked="second" ariaLabel="Second child">
            <template #renderContent="flags">
                <PageCheckboxContent :flags="flags">Second child</PageCheckboxContent>
            </template>
        </Checkbox>
    </PageControlRow>
</template>
