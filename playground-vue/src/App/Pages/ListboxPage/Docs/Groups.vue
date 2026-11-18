<script setup lang="ts">
import { shallowRef } from "vue";

import { MultiListbox } from "@thewaver/ss-components-vue";
import { COUNTRIES_SHIP_LABEL } from "@thewaver/ss-playground/App/Pages/ListboxPage/ListboxPage.const";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageListboxSurface from "../../../StyledComponents/ListboxSurface/ListboxSurface.vue";
import PageSelectGroupContent from "../../../StyledComponents/SelectGroupContent/SelectGroupContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { GROUPED_COUNTRIES } from "../../SelectPage/SelectPageVue.const";

const countries = shallowRef<string[]>(["Denmark"]);
</script>

<template>
    <PageListboxSurface>
        <MultiListbox
            id="shippingCountries"
            v-model:values="countries"
            :options="GROUPED_COUNTRIES"
            :ariaLabel="COUNTRIES_SHIP_LABEL"
        >
            <template #renderGroupHeader="{ group, flags }">
                <PageSelectGroupContent :flags="flags">{{ group.label }}</PageSelectGroupContent>
            </template>

            <template #renderOption="{ option, flags }">
                <PageSelectOptionContent has-hover-floater :flags="flags">{{ option.value }}</PageSelectOptionContent>
            </template>

            <template #renderHighlightFloater="floater">
                <PageGlideFloater kind="highlight" v-bind="floater" />
            </template>
        </MultiListbox>
    </PageListboxSurface>
</template>
