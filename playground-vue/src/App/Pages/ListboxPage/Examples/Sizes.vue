<script setup lang="ts">
import { useModel } from "vue";

import { Listbox } from "@thewaver/ss-components-vue";

import PageListboxSurface from "../../../StyledComponents/ListboxSurface/ListboxSurface.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { SIZES } from "../ListboxPage.const";
import type { ListboxExampleProps } from "../ListboxPage.types";

type Props = ListboxExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <div dir="rtl">
        <PageListboxSurface is-wide>
            <Listbox v-model:value="value" :options="SIZES" orientation="horizontal" ariaLabel="Size">
                <template #renderOption="{ option, flags }">
                    <PageSelectOptionContent :flags="flags">{{ option.value }}</PageSelectOptionContent>
                </template>
            </Listbox>
        </PageListboxSurface>
    </div>
</template>
