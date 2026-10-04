<script setup lang="ts">
import { useModel } from "vue";

import { Listbox } from "@thewaver/ss-components-vue";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageGlideLabel from "../../../StyledComponents/GlideFloater/PageGlideLabel.vue";
import PageListboxSurface from "../../../StyledComponents/ListboxSurface/ListboxSurface.vue";
import { COUNTRIES_WITH_REACHABLE } from "../../SelectPage/SelectPage.const";
import type { ListboxExampleProps } from "../ListboxPage.types";

type Props = ListboxExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <PageListboxSurface>
        <Listbox v-model:value="value" :options="COUNTRIES_WITH_REACHABLE" ariaLabel="Shipping country, gliding">
            <template #renderOption="{ option, flags }">
                <PageGlideLabel :is-selected="flags.isSelected">{{ option.value }}</PageGlideLabel>
            </template>

            <template #renderSelectionFloater="{ visibilityTarget, transitionDurationMs }">
                <PageGlideFloater
                    kind="selection"
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                />
            </template>

            <template #renderHighlightFloater="{ visibilityTarget, transitionDurationMs }">
                <PageGlideFloater
                    kind="highlight"
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                />
            </template>
        </Listbox>
    </PageListboxSurface>
</template>
