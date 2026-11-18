<script setup lang="ts">
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/FormSectionPage/FormSectionPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import NestedDocsExample from "./Docs/Nested.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import SectionsDocsExample from "./Docs/Sections.vue";
</script>

<template>
    <PageDocsSection v-bind="DOCS_SECTIONS.groupRule" />

    <PageDocsExample :path="`${DOCS_ROOT}/Sections.vue`">
        <SectionsDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.sectionInsideSection" />

    <PageDocsExample :path="`${DOCS_ROOT}/Nested.vue`">
        <NestedDocsExample />
    </PageDocsExample>
</template>
