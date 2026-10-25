<script setup lang="ts">
import { shallowRef } from "vue";

import { Listbox } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageListboxSurface from "../../../StyledComponents/ListboxSurface/ListboxSurface.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { COUNTRIES_WITH_REACHABLE } from "../../SelectPage/SelectPageVue.const";
import type { ListboxGlideDocsExampleProps } from "../ListboxPageVue.types";

type Props = ListboxGlideDocsExampleProps;

defineProps<Props>();

const country = shallowRef<string | undefined>("Portugal");
</script>

<template>
    <PageListboxSurface>
        <Listbox
            id="glidingCountry"
            v-model:value="country"
            :options="COUNTRIES_WITH_REACHABLE"
            ariaLabel="Shipping country, gliding"
        >
            <template #renderOption="{ option, flags }">
                <PageSelectOptionContent :is-gliding="isGliding" :flags="flags">{{
                    option.value
                }}</PageSelectOptionContent>
            </template>

            <template v-if="isGliding" #renderSelectionFloater="floater">
                <PageGlideFloater kind="selection" v-bind="floater" />
            </template>

            <template v-if="isGliding" #renderHighlightFloater="floater">
                <PageGlideFloater kind="highlight" v-bind="floater" />
            </template>
        </Listbox>
    </PageListboxSurface>
</template>
