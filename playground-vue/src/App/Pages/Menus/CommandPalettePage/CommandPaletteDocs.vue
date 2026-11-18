<script setup lang="ts">
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
} from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.const";

import PageDocsAlert from "../../../PageComponents/DocsAlert/PageDocsAlert.vue";
import PageDocsExample from "../../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../../PageComponents/DocsSection/PageDocsSection.vue";
import ActionShortcutsDocsExample from "./Docs/ActionShortcuts.vue";
import BareLetterDocsExample from "./Docs/BareLetter.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.actionsWithOwnShortcuts" />

    <PageDocsExample :path="`${DOCS_ROOT}/ActionShortcuts.vue`">
        <ActionShortcutsDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.bareLetterShortcut" />

    <PageDocsAlert severity="alert">
        A shortcut of a single character needs a way for the person to turn it off or change it, such as a setting in
        your app, or it fails <a :href="WCAG_URLS['2.1.4']">WCAG 2.1.4</a>. The library warns about every such shortcut
        it registers, since it cannot tell whether you have.
    </PageDocsAlert>

    <PageDocsExample :path="`${DOCS_ROOT}/BareLetter.vue`">
        <BareLetterDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>
</template>
