<script setup lang="ts">
import { useModel } from "vue";

import { MultiListbox } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageListboxSurface from "../../../StyledComponents/ListboxSurface/ListboxSurface.vue";
import PageSelectGroupContent from "../../../StyledComponents/SelectGroupContent/SelectGroupContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { GROUPED_COUNTRIES } from "../../SelectPage/SelectPage.const";
import type { MultiListboxExampleProps } from "../ListboxPage.types";

type Props = MultiListboxExampleProps;

const props = defineProps<Props>();

const values = useModel(props, "values");
</script>

<template>
    <PageListboxSurface>
        <MultiListbox v-model:values="values" :options="GROUPED_COUNTRIES" ariaLabel="Countries to ship to">
            <template #renderGroup="{ group, flags }">
                <PageSelectGroupContent :flags="flags">{{ group.label }}</PageSelectGroupContent>
            </template>

            <template #renderOption="{ option, flags }">
                <PageSelectOptionContent is-gliding :flags="flags">{{ option.value }}</PageSelectOptionContent>
            </template>

            <template #renderHighlightFloater="floater">
                <PageGlideFloater kind="highlight" v-bind="floater" />
            </template>
        </MultiListbox>
    </PageListboxSurface>
</template>
