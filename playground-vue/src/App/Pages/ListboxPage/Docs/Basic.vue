<script setup lang="ts">
import { shallowRef } from "vue";

import { Listbox } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageListboxSurface from "../../../StyledComponents/ListboxSurface/ListboxSurface.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { COUNTRIES_WITH_REACHABLE } from "../../SelectPage/SelectPageVue.const";
import type { ListboxBasicDocsExampleProps } from "../ListboxPageVue.types";

type Props = ListboxBasicDocsExampleProps;

defineProps<Props>();

const country = shallowRef<string | undefined>("Portugal");
</script>

<template>
    <PageListboxSurface>
        <Listbox
            id="shippingCountry"
            v-model:value="country"
            :options="COUNTRIES_WITH_REACHABLE"
            :is-disabled="isDisabled"
            ariaLabel="Shipping country"
        >
            <template #renderOption="{ option, flags }">
                <PageSelectOptionContent is-gliding :flags="flags">{{ option.value }}</PageSelectOptionContent>
            </template>

            <template #renderHighlightFloater="floater">
                <PageGlideFloater kind="highlight" v-bind="floater" />
            </template>
        </Listbox>
    </PageListboxSurface>
</template>
