<script setup lang="ts">
import { shallowRef } from "vue";

import { TABLE_SELECTION_MODES } from "@thewaver/ss-components-vue";
import type { TableSelectionMode } from "@thewaver/ss-components-vue";
import { TableKnobs } from "@thewaver/ss-playground/App/Knobs/Tables.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
    STRESS_COUNT_FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/TablePage/TablePage.const";

import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.vue";
import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import ConsumerSortedDocsExample from "./Docs/ConsumerSorted.vue";
import ExpandableDocsExample from "./Docs/Expandable.vue";
import PinnedDocsExample from "./Docs/Pinned.vue";
import ReorderableDocsExample from "./Docs/Reorderable.vue";
import ResizableDocsExample from "./Docs/Resizable.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import VirtualizedDocsExample from "./Docs/Virtualized.vue";

const selectionMode = shallowRef<TableSelectionMode>("multiple");
const isDisabled = shallowRef(false);
const count = shallowRef(TableKnobs.STARTING_STRESS_COUNT);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :selection-mode="selectionMode" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp item-key="selectionMode" v-bind="TableKnobs.SELECTION_MODE_TEXT">
                <PageSelectField
                    :value="selectionMode"
                    :values="TABLE_SELECTION_MODES"
                    ariaLabel="Selection"
                    @change="(value: TableSelectionMode) => (selectionMode = value)"
                />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="TableKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.resizableColumns" />

    <PageDocsExample :path="`${DOCS_ROOT}/Resizable.vue`">
        <ResizableDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.reorderableColumns" />

    <PageDocsAlert severity="alert">
        Put a TableHeaderReorder in the header of every column that can be moved. Not everyone can drag, so there must
        be a way to move a column with single taps (<a :href="WCAG_URLS['2.5.7']">WCAG 2.5.7</a>), and that control is
        it: tap it to pick the column up, then tap the header where it should go. Without one the column can only be
        dragged, and the table warns in development.
    </PageDocsAlert>

    <PageDocsExample :path="`${DOCS_ROOT}/Reorderable.vue`">
        <ReorderableDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.sortedPage" />

    <PageDocsExample :path="`${DOCS_ROOT}/ConsumerSorted.vue`">
        <ConsumerSortedDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.manyRows" />

    <PageDocsExample :path="`${DOCS_ROOT}/Virtualized.vue`">
        <VirtualizedDocsExample :count="count" />

        <template #renderKnobs>
            <PageProp item-key="count" v-bind="TableKnobs.COUNT_TEXT">
                <PageNumberField
                    :value="count"
                    :min="TableKnobs.MIN_STRESS_COUNT"
                    :max="TableKnobs.MAX_STRESS_COUNT"
                    :step="TableKnobs.STRESS_COUNT_STEP"
                    :width="STRESS_COUNT_FIELD_WIDTH"
                    ariaLabel="Row count"
                    @input="(value: number) => (count = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.pinnedColumns" />

    <PageDocsExample :path="`${DOCS_ROOT}/Pinned.vue`">
        <PinnedDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.expandableRows" />

    <PageDocsExample :path="`${DOCS_ROOT}/Expandable.vue`">
        <ExpandableDocsExample />
    </PageDocsExample>
</template>
