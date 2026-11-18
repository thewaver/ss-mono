<script setup lang="ts">
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import SelectAllDocsExample from "./Docs/SelectAll.vue";
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.selectAllBox" />

    <PageDocsExample :path="`${DOCS_ROOT}/SelectAll.vue`">
        <SelectAllDocsExample />
    </PageDocsExample>
</template>
