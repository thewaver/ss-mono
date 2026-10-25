<script setup lang="ts">
import { computed, shallowRef, watchEffect } from "vue";

import { Toggle } from "@thewaver/ss-components-vue";

import PageControlRow from "../../../PageComponents/ControlRow/PageControlRow.vue";
import PageControlRowLabel from "../../../PageComponents/ControlRow/PageControlRowLabel.vue";
import PageToggleContent from "../../../StyledComponents/ToggleContent/ToggleContent.vue";

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
        <Toggle
            id="allSettings"
            v-model:checked="all"
            :is-mixed="isMixed"
            ariaLabel="All settings"
            @change="setChildren"
        >
            <template #renderContent="flags">
                <PageToggleContent :flags="flags">All settings</PageToggleContent>
            </template>
        </Toggle>

        <PageControlRowLabel>controls</PageControlRowLabel>

        <Toggle id="firstSetting" v-model:checked="first" ariaLabel="First setting">
            <template #renderContent="flags">
                <PageToggleContent :flags="flags">First setting</PageToggleContent>
            </template>
        </Toggle>

        <Toggle v-model:checked="second" ariaLabel="Second setting">
            <template #renderContent="flags">
                <PageToggleContent :flags="flags">Second setting</PageToggleContent>
            </template>
        </Toggle>
    </PageControlRow>
</template>
