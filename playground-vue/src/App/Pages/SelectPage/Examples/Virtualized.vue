<script setup lang="ts">
import { useModel } from "vue";

import { Select } from "@thewaver/ss-components-vue";
import type { SelectOption } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/SelectPage/SelectPage.css";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectGroupContent from "../../../StyledComponents/SelectGroupContent/SelectGroupContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import type { Delivery, SelectVirtualizedExampleProps } from "../SelectPage.types";
import { PLACEHOLDER } from "../SelectPageVue.const";
import SelectPopup from "../SelectPopup.vue";

const STRESS_OPTION_HEIGHT = 100;
const STRESS_GROUP_HEIGHT = 32;

type Props = SelectVirtualizedExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
const visibility = useModel(props, "visibility");
</script>

<template>
    <div :class="styles.column">
        <Select
            v-model:value="value"
            v-model:visibility="visibility"
            :options="options"
            ariaLabel="Route"
            :compute-estimated-option-height="() => STRESS_OPTION_HEIGHT"
            :compute-estimated-group-height="() => STRESS_GROUP_HEIGHT"
            :compute-custom-text="(option: SelectOption<Delivery>) => option.value.name"
        >
            <template #renderGroup="{ group }">
                <PageSelectGroupContent>{{ group.label }}</PageSelectGroupContent>
            </template>

            <template #renderContent="{ selectedOption, flags }">
                <PageSelectContent :flags="flags">{{ selectedOption?.value.name ?? PLACEHOLDER }}</PageSelectContent>
            </template>

            <template #renderOption="{ option, flags }">
                <PageSelectOptionContent is-gliding :flags="flags" :description="option.value.description">{{
                    option.value.name
                }}</PageSelectOptionContent>
            </template>

            <template #renderHighlightFloater="floater">
                <PageGlideFloater kind="highlight" v-bind="floater" />
            </template>

            <template #renderPopup="popup">
                <SelectPopup v-bind="popup" />
            </template>
        </Select>
    </div>
</template>
