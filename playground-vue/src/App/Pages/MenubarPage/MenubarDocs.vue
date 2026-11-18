<script setup lang="ts">
import { shallowRef } from "vue";

import { MenubarKnobs } from "@thewaver/ss-playground/App/Knobs/Menubars.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import OverflowDocsExample from "./Docs/Overflow.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";

const barWidth = shallowRef(MenubarKnobs.STARTING_NARROW_BAR_WIDTH);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.wordsThatDoNotFit" />

    <PageDocsExample :path="`${DOCS_ROOT}/Overflow.vue`">
        <OverflowDocsExample :bar-width="barWidth" />

        <template #renderKnobs>
            <PageProp item-key="barWidth" v-bind="MenubarKnobs.BAR_WIDTH_TEXT">
                <PageNumberField
                    :value="barWidth"
                    :min="MenubarKnobs.MIN_BAR_WIDTH"
                    :max="MenubarKnobs.MAX_BAR_WIDTH"
                    :step="MenubarKnobs.BAR_WIDTH_STEP"
                    ariaLabel="Bar width in pixels"
                    @input="(value: number) => (barWidth = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>
</template>
