<script setup lang="ts">
import { useModel } from "vue";

import { Select } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { AIRPORTS, PLACEHOLDER } from "../SelectPage.const";
import type { SelectAirportExampleProps } from "../SelectPage.types";
import SelectPopup from "../SelectPopup.vue";

type Props = SelectAirportExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <Select v-model:value="value" :options="AIRPORTS" ariaLabel="Airport">
        <template #renderContent="{ selectedOption, flags }">
            <PageSelectContent :flags="flags">{{
                selectedOption ? selectedOption.value.city : PLACEHOLDER
            }}</PageSelectContent>
        </template>

        <template #renderOption="{ option, flags }">
            <PageSelectOptionContent is-gliding :flags="flags">{{
                `${option.value.city} (${option.value.code})`
            }}</PageSelectOptionContent>
        </template>

        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>

        <template #renderPopup="popup">
            <SelectPopup v-bind="popup" />
        </template>
    </Select>
</template>
