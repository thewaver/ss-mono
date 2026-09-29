<script setup lang="ts">
import { shallowRef } from "vue";

import { MenubarKnobs } from "@thewaver/ss-playground/App/Knobs/Menubars.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import DefaultExample from "./Examples/Default.vue";
import MenubarFrame from "./MenubarFrame.vue";
import { NOTHING_PICKED, VIEW_DEFAULTS } from "./MenubarPage.const";
import type { MenubarEntry } from "./MenubarPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/MenubarPage/Examples";

const barWidth = shallowRef(MenubarKnobs.STARTING_BAR_WIDTH);
const lastPicked = shallowRef(NOTHING_PICKED);
const checked = shallowRef(VIEW_DEFAULTS);

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "File, Edit and View",
        readout: () =>
            `last picked: ${lastPicked.value} — with a menu open, the left and right arrows close it and open the next one; narrow the bar and a word becomes a submenu of the overflow menu`,
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="barWidth"
            label="Bar width (px)"
            hint="How wide the bar is. Narrow it far enough and words start moving into the overflow menu."
        >
            <PageNumberField
                :value="barWidth"
                :min="MenubarKnobs.MIN_BAR_WIDTH"
                :max="MenubarKnobs.MAX_BAR_WIDTH"
                :step="MenubarKnobs.BAR_WIDTH_STEP"
                ariaLabel="Bar width in pixels"
                @input="(value: number) => (barWidth = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples" layout="flow">
        <template #default>
            <MenubarFrame :width="barWidth">
                <DefaultExample
                    v-model:checked="checked"
                    @activate="(entry: MenubarEntry) => (lastPicked = entry.name)"
                />
            </MenubarFrame>
        </template>
    </PageExamples>
</template>
