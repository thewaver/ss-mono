<script setup lang="ts">
import { useModel } from "vue";

import { Select } from "@thewaver/ss-components-vue";
import type { SelectItem, SelectOption } from "@thewaver/ss-components-vue";
import { SelectKnobs } from "@thewaver/ss-playground/App/Knobs/Selects.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SelectPage/SelectPage.css";

import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.vue";
import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.vue";
import PageSelectGroupContent from "../../../StyledComponents/SelectGroupContent/SelectGroupContent.vue";
import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.vue";
import { PLACEHOLDER } from "../SelectPage.const";
import type { Delivery } from "../SelectPage.types";
import SelectPopup from "../SelectPopup.vue";

const STRESS_COUNT_FIELD_WIDTH = 120;
const STRESS_OPTION_HEIGHT = 100;
const STRESS_GROUP_HEIGHT = 32;

type Props = {
    "value": Delivery | undefined;
    "onUpdate:value"?: (value: Delivery | undefined) => void;
    "visibility": boolean;
    "onUpdate:visibility"?: (isOpen: boolean) => void;
    "options": SelectItem<Delivery>[];
    "count": number;
    "onCountChange": (count: number) => void;
};

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

        <PageExampleKnobs>
            <PageProp
                item-key="stressCount"
                label="Option count"
                hint="How many options the list holds. Only the ones on screen are rendered, so a very large number should still open instantly."
            >
                <PageNumberField
                    :value="count"
                    :min="SelectKnobs.MIN_STRESS_COUNT"
                    :max="SelectKnobs.MAX_STRESS_COUNT"
                    :step="SelectKnobs.STRESS_COUNT_STEP"
                    :width="STRESS_COUNT_FIELD_WIDTH"
                    ariaLabel="Option count"
                    @input="props.onCountChange"
                />
            </PageProp>
        </PageExampleKnobs>
    </div>
</template>
