<script setup lang="ts">
import { shallowRef } from "vue";

import { Listbox } from "@thewaver/ss-components-vue";
import {
    SKIN_SAMPLE_OPTIONS,
    SKIN_SAMPLE_SELECTED_OPTION,
} from "@thewaver/ss-playground/App/Pages/SkinsPage/SkinsPage.const";

import PageGlideFloater from "../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageListboxSurface from "../../StyledComponents/ListboxSurface/ListboxSurface.vue";
import PageSelectOptionContent from "../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";

const value = shallowRef<string | undefined>(SKIN_SAMPLE_SELECTED_OPTION);
</script>

<template>
    <PageListboxSurface>
        <Listbox v-model:value="value" :options="SKIN_SAMPLE_OPTIONS" ariaLabel="Listbox">
            <template #renderOption="{ option, flags }">
                <PageSelectOptionContent is-gliding :flags="flags">{{ option.value }}</PageSelectOptionContent>
            </template>

            <template #renderHighlightFloater="floater">
                <PageGlideFloater kind="highlight" v-bind="floater" />
            </template>
        </Listbox>
    </PageListboxSurface>
</template>
