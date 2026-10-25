<script setup lang="ts">
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/CheckboxGroupPage/CheckboxGroupPage.const";

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

    <PageDocsSection
        title="Right to left"
        content="Inside a box whose text runs right to left, a row of boxes starts from the right, and each box sits to the right of its words. Tab still visits the boxes in the order they are written."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="A select-all box"
        content="The group draws no box of its own for selecting everything; [prop]onMount[/prop] hands over a controller for one you draw. Its [prop]getCheckedState[/prop] says whether every box is ticked, none is, or they disagree, which the box here shows as mixed, and [prop]setIsEveryChecked[/prop] ticks or clears them all at once. A disabled box keeps whatever it had and is left out of the count, so the sold-out topping cannot leave the select-all box mixed for good."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/SelectAll.vue`">
        <SelectAllDocsExample />
    </PageDocsExample>
</template>
