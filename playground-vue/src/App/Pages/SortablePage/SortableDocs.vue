<script setup lang="ts">
import { shallowRef } from "vue";

import type { SortableOrientation } from "@thewaver/ss-components-vue";
import { SORTABLE_DEFAULTS, SORTABLE_ORIENTATIONS } from "@thewaver/ss-components-vue";
import { SortableKnobs } from "@thewaver/ss-playground/App/Knobs/Sortables.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/SortablePage/SortablePage.const";

import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.vue";
import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import PairDocsExample from "./Docs/Pair.vue";
import PickyDocsExample from "./Docs/Picky.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import RingDocsExample from "./Docs/Ring.vue";

const orientation = shallowRef<SortableOrientation>(SORTABLE_DEFAULTS.orientation);
const isDisabled = shallowRef(false);
const isBoardLocked = shallowRef(false);
</script>

<template>
    <PageDocsAlert severity="info">
        Every list can be worked three ways, all built in: by dragging; by tapping a card to pick it up and tapping a
        place to put it down, so dragging is never the only way (<a :href="WCAG_URLS['2.5.7']">WCAG 2.5.7</a>); and from
        the keyboard, where Enter picks up, the arrows choose a place, Tab changes list, Enter drops and Escape cancels
        (<a :href="WCAG_URLS['2.1.1']">WCAG 2.1.1</a>). What a screen reader hears at each step is the words you pass in
        <span :class="docsStyles.docsPropName">announcements</span>.
    </PageDocsAlert>

    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :orientation="orientation" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp item-key="orientation" v-bind="SortableKnobs.ORIENTATION_TEXT">
                <PageSelectField
                    :value="orientation"
                    :values="SORTABLE_ORIENTATIONS"
                    ariaLabel="Orientation"
                    @change="(value: SortableOrientation) => (orientation = value)"
                />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="SortableKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.betweenTwoLists" />

    <PageDocsExample :path="`${DOCS_ROOT}/Pair.vue`">
        <PairDocsExample :is-board-locked="isBoardLocked" />

        <template #renderKnobs>
            <PageProp item-key="isBoardLocked" v-bind="SortableKnobs.IS_BOARD_LOCKED_TEXT">
                <PageCheckField
                    :value="isBoardLocked"
                    ariaLabel="Board locked"
                    @change="(value: boolean) => (isBoardLocked = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.listRefusingSomeCards" />

    <PageDocsExample :path="`${DOCS_ROOT}/Picky.vue`">
        <PickyDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.reorderingRoundRing" />

    <PageDocsExample :path="`${DOCS_ROOT}/Ring.vue`">
        <RingDocsExample />
    </PageDocsExample>
</template>
