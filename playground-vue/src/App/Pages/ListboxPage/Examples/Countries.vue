<script setup lang="ts">
import { useModel } from "vue";

import { Listbox } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageListboxSurface from "../../../StyledComponents/ListboxSurface/ListboxSurface.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { COUNTRIES_WITH_REACHABLE } from "../../SelectPage/SelectPage.const";
import type { ListboxExampleProps } from "../ListboxPage.types";

type Props = ListboxExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <PageListboxSurface>
        <Listbox v-model:value="value" :options="COUNTRIES_WITH_REACHABLE" ariaLabel="Shipping country">
            <template #renderOption="{ option, flags }">
                <PageSelectOptionContent is-gliding :flags="flags">{{ option.value }}</PageSelectOptionContent>
            </template>

            <template #renderHighlightFloater="floater">
                <PageGlideFloater kind="highlight" v-bind="floater" />
            </template>
        </Listbox>
    </PageListboxSurface>
</template>
