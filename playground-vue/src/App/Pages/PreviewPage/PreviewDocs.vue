<script setup lang="ts">
import { shallowRef } from "vue";

import { PreviewKnobs } from "@thewaver/ss-playground/App/Knobs/Previews.const";
import {
    COLLAPSED_HEIGHT,
    DOCS_ROOT,
    DOCS_SECTIONS,
} from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import ControlledDocsExample from "./Docs/Controlled.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import ScrolledDocsExample from "./Docs/Scrolled.vue";
import ShortDocsExample from "./Docs/Short.vue";

const collapsedHeight = shallowRef(COLLAPSED_HEIGHT);
const isScrolledIntoViewOnCollapse = shallowRef(true);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :collapsed-height="collapsedHeight" />

        <template #renderKnobs>
            <PageProp item-key="collapsedHeight" v-bind="PreviewKnobs.COLLAPSED_HEIGHT_TEXT">
                <PageNumberField
                    :value="collapsedHeight"
                    :min="PreviewKnobs.MIN_COLLAPSED_HEIGHT"
                    :max="PreviewKnobs.MAX_COLLAPSED_HEIGHT"
                    :step="PreviewKnobs.COLLAPSED_HEIGHT_STEP"
                    ariaLabel="Collapsed height in pixels"
                    @input="(value: number) => (collapsedHeight = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.whenEverythingFits" />

    <PageDocsExample :path="`${DOCS_ROOT}/Short.vue`">
        <ShortDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.openingClosingOutside" />

    <PageDocsExample :path="`${DOCS_ROOT}/Controlled.vue`">
        <ControlledDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.insideBoxThatScrolls" />

    <PageDocsExample :path="`${DOCS_ROOT}/Scrolled.vue`">
        <ScrolledDocsExample :is-scrolled-into-view-on-collapse="isScrolledIntoViewOnCollapse" />

        <template #renderKnobs>
            <PageProp
                item-key="isScrolledIntoViewOnCollapse"
                v-bind="PreviewKnobs.IS_SCROLLED_INTO_VIEW_ON_COLLAPSE_TEXT"
            >
                <PageCheckField
                    :value="isScrolledIntoViewOnCollapse"
                    ariaLabel="Scroll into view on collapse"
                    @change="(value: boolean) => (isScrolledIntoViewOnCollapse = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
