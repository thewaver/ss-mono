<script setup lang="ts">
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.const";

import PageDocsExample from "../../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../../PageComponents/DocsSection/PageDocsSection.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import SubmenusDocsExample from "./Docs/Submenus.vue";
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.submenus" />

    <PageDocsExample :path="`${DOCS_ROOT}/Submenus.vue`">
        <SubmenusDocsExample />
    </PageDocsExample>
</template>
