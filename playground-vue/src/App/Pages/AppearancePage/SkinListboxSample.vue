<script setup lang="ts">
import { shallowRef } from "vue";

import { Listbox } from "@thewaver/ss-components-vue";
import {
    SKIN_SAMPLE_OPTIONS,
    SKIN_SAMPLE_SELECTED_OPTION,
} from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.const";

import PageGlideFloater from "../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageListboxSurface from "../../StyledComponents/ListboxSurface/ListboxSurface.vue";
import PageSelectOptionContent from "../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import type { SkinListboxSampleProps } from "./AppearancePage.types";
import SkinHoveredOption from "./SkinHoveredOption.vue";

defineProps<SkinListboxSampleProps>();

const value = shallowRef<string | undefined>(SKIN_SAMPLE_SELECTED_OPTION);
</script>

<template>
    <PageListboxSurface>
        <Listbox
            v-model:value="value"
            :options="SKIN_SAMPLE_OPTIONS"
            :ariaLabel="isGliding ? 'Listbox' : 'Listbox without floater'"
        >
            <template #renderOption="{ option, flags }">
                <PageSelectOptionContent
                    :has-hover-floater="isGliding"
                    :has-selection-floater="isGliding"
                    :flags="flags"
                    >{{ option.value }}</PageSelectOptionContent
                >
            </template>

            <template v-if="isGliding" #renderSelectionFloater="floater">
                <PageGlideFloater kind="selection" v-bind="floater" />
            </template>

            <template v-if="isGliding" #renderHighlightFloater="floater">
                <PageGlideFloater kind="highlight" v-bind="floater" />
            </template>
        </Listbox>

        <SkinHoveredOption :is-gliding="isGliding" />
    </PageListboxSurface>
</template>
