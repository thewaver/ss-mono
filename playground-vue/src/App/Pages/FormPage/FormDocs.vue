<script setup lang="ts">
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/FormPage/FormPage.const";

import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.vue";
import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import SubmittedDocsExample from "./Docs/Submitted.vue";
import ValuesDocsExample from "./Docs/Values.vue";
</script>

<template>
    <PageDocsAlert severity="info">
        Form validates nothing. Every message and every error here comes from the example's own code; Form only passes
        on what its fields report.
    </PageDocsAlert>

    <PageDocsSection v-bind="DOCS_SECTIONS.errorsWhileTyping" />

    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.errorsShownOnceForm" />

    <PageDocsExample :path="`${DOCS_ROOT}/Submitted.vue`">
        <SubmittedDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.readingWhatWasSent" />

    <PageDocsExample :path="`${DOCS_ROOT}/Values.vue`">
        <ValuesDocsExample />
    </PageDocsExample>
</template>
