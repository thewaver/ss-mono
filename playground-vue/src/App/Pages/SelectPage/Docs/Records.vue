<script setup lang="ts">
import { shallowRef } from "vue";

import { Select } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import type { Airport } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectRecords.types";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { AIRPORTS, PLACEHOLDER } from "../SelectPageVue.const";
import SelectPopup from "../SelectPopup.vue";

const value = shallowRef<Airport | undefined>(undefined);
</script>

<template>
    <Select
        name="airport"
        v-model:value="value"
        :options="AIRPORTS"
        :compute-form-value="(airport) => airport.code"
        ariaLabel="Airport"
    >
        <template #renderContent="{ selectedOption, flags }">
            <PageSelectContent :flags="flags">{{
                selectedOption ? selectedOption.value.city : PLACEHOLDER
            }}</PageSelectContent>
        </template>

        <template #renderOption="{ option, flags }">
            <PageSelectOptionContent is-gliding :flags="flags"
                >{{ option.value.city }} ({{ option.value.code }})</PageSelectOptionContent
            >
        </template>

        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>

        <template #renderPopup="popup">
            <SelectPopup v-bind="popup" />
        </template>
    </Select>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Value: ${JSON.stringify(value) ?? "none"}` }}</div>
</template>
