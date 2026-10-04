<script setup lang="ts">
import { useModel } from "vue";

import { MultiSelect } from "@thewaver/ss-components-vue";
import type { SelectItem } from "@thewaver/ss-components-vue";
import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PagePopoverSurface from "../../../StyledComponents/PopoverSurface/PopoverSurface.vue";
import PageSelectContent, {
    computePageSelectTextStyle,
} from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectGroupContent from "../../../StyledComponents/SelectGroupContent/SelectGroupContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { PLACEHOLDER, QUERY_PADDING } from "../../SelectPage/SelectPage.const";

type Props = {
    "values": string[];
    "onUpdate:values"?: (values: string[]) => void;
    "query": string;
    "onUpdate:query"?: (query: string) => void;
    "options": SelectItem<string>[];
};

const props = defineProps<Props>();

const values = useModel(props, "values");
const query = useModel(props, "query");
</script>

<template>
    <MultiSelect
        v-model:values="values"
        v-model:query="query"
        :options="options"
        ariaLabel="Countries"
        :padding="QUERY_PADDING"
        :compute-text-style="computePageSelectTextStyle"
    >
        <template #renderContent="{ selectedOptions, flags }">
            <PageSelectContent :flags="flags">{{
                selectedOptions.length ? `${selectedOptions.length} selected` : PLACEHOLDER
            }}</PageSelectContent>
        </template>

        <template #renderGroup="{ group, flags }">
            <PageSelectGroupContent :flags="flags">{{ group.label }}</PageSelectGroupContent>
        </template>

        <template #renderOption="{ option, flags }">
            <PageSelectOptionContent is-gliding :flags="flags">{{ option.value }}</PageSelectOptionContent>
        </template>

        <template #renderHighlightFloater="floater">
            <PageGlideFloater kind="highlight" v-bind="floater" />
        </template>

        <template #renderPopup="{ renderOptions, visibilityTarget, transitionDurationMs, placement }">
            <PagePopoverSurface
                :visibility-target="visibilityTarget"
                :transition-duration-ms="transitionDurationMs"
                :placement="placement"
            >
                <component :is="renderOptions" v-if="options.length" />

                <div v-else :class="popupStyles.popoverSurfaceEmpty">No country matches that</div>
            </PagePopoverSurface>
        </template>
    </MultiSelect>
</template>
