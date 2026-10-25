<script setup lang="ts">
import { shallowRef } from "vue";

import { MultiSelect } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageSelectClear from "../../../StyledComponents/SelectClear/SelectClear.vue";
import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { COUNTRIES, PLACEHOLDER, QUERY_PADDING } from "../../SelectPage/SelectPageVue.const";
import SelectPopup from "../../SelectPage/SelectPopup.vue";

const values = shallowRef<string[]>(["Belgium", "Sweden"]);
const lastChange = shallowRef("none yet");
</script>

<template>
    <MultiSelect
        v-model:values="values"
        :options="COUNTRIES"
        ariaLabel="Countries"
        clearAriaLabel="Clear countries"
        :padding="QUERY_PADDING"
        @selection-change="(next: string[]) => (lastChange = next.length ? next.join(', ') : 'cleared')"
    >
        <template #renderContent="{ selectedOptions, flags }">
            <PageSelectContent :flags="flags" has-clear-space>{{
                selectedOptions.length ? selectedOptions.map((option) => option.value).join(", ") : PLACEHOLDER
            }}</PageSelectContent>
        </template>

        <template #renderOption="{ option, flags }">
            <PageSelectOptionContent is-gliding :flags="flags">{{ option.value }}</PageSelectOptionContent>
        </template>

        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>

        <template #renderClear="flags">
            <PageSelectClear :flags="flags" />
        </template>

        <template #renderPopup="popup">
            <SelectPopup v-bind="popup" />
        </template>
    </MultiSelect>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Last change: ${lastChange}` }}</div>
</template>
