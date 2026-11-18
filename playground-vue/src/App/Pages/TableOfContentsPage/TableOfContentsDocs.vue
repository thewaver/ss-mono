<script setup lang="ts">
import { shallowRef } from "vue";

import { TABLE_OF_CONTENTS_DEFAULTS } from "@thewaver/ss-components-vue";
import { TableOfContentsKnobs } from "@thewaver/ss-playground/App/Knobs/TablesOfContents.const";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
} from "@thewaver/ss-playground/App/Pages/TableOfContentsPage/TableOfContentsPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";

const offsetRatio = shallowRef(TABLE_OF_CONTENTS_DEFAULTS.offsetRatio);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :offset-ratio="offsetRatio" />

        <template #renderKnobs>
            <PageProp item-key="offsetRatio" v-bind="TableOfContentsKnobs.OFFSET_RATIO_TEXT">
                <PageNumberField
                    :value="offsetRatio"
                    :min="TableOfContentsKnobs.MIN_OFFSET_RATIO"
                    :max="TableOfContentsKnobs.MAX_OFFSET_RATIO"
                    :step="TableOfContentsKnobs.OFFSET_RATIO_STEP"
                    ariaLabel="Offset ratio"
                    @input="(value: number) => (offsetRatio = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>
</template>
