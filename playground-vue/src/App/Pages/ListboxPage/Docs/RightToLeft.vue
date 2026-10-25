<script setup lang="ts">
import { shallowRef } from "vue";

import { Listbox } from "@thewaver/ss-components-vue";
import { SIZES } from "@thewaver/ss-playground/App/Pages/ListboxPage/ListboxPage.const";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageListboxSurface from "../../../StyledComponents/ListboxSurface/ListboxSurface.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import type { ListboxRightToLeftDocsExampleProps } from "../ListboxPageVue.types";

type Props = ListboxRightToLeftDocsExampleProps;

defineProps<Props>();

const size = shallowRef<string | undefined>();
</script>

<template>
    <div dir="rtl">
        <PageListboxSurface :is-wide="orientation === 'horizontal'">
            <Listbox id="size" v-model:value="size" :options="SIZES" :orientation="orientation" ariaLabel="Size">
                <template #renderOption="{ option, flags }">
                    <PageSelectOptionContent is-gliding :flags="flags">{{ option.value }}</PageSelectOptionContent>
                </template>

                <template #renderHighlightFloater="floater">
                    <PageGlideFloater kind="highlight" v-bind="floater" />
                </template>
            </Listbox>
        </PageListboxSurface>
    </div>
</template>
