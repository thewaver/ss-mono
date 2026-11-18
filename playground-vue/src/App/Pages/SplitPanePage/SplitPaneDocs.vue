<script setup lang="ts">
import { shallowRef } from "vue";

import type { SplitPaneOrientation } from "@thewaver/ss-components-vue";
import { SPLIT_PANE_DEFAULTS, SPLIT_PANE_ORIENTATIONS } from "@thewaver/ss-components-vue";
import { SplitPaneKnobs } from "@thewaver/ss-playground/App/Knobs/SplitPanes.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
    GUTTER_FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.vue";
import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import BoundedDocsExample from "./Docs/Bounded.vue";
import CompareDocsExample from "./Docs/Compare.vue";
import CrampedDocsExample from "./Docs/Cramped.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import TripleDocsExample from "./Docs/Triple.vue";

const orientation = shallowRef<SplitPaneOrientation>(SPLIT_PANE_DEFAULTS.orientation);
const gutterSize = shallowRef(SPLIT_PANE_DEFAULTS.gutterSize);
const isDisabled = shallowRef(SplitPaneKnobs.STARTING_IS_DISABLED);
</script>

<template>
    <PageDocsAlert severity="alert">
        Each divider can be dragged, pressed to step it towards the side pressed, so dragging is never the only way (<a
            :href="WCAG_URLS['2.5.7']"
            >WCAG 2.5.7</a
        >), or focused and moved with the arrow keys, with Home and End for the ends and Enter to fold the pane before
        it away and bring it back. What it cannot do is name itself: give every pane but the last a
        <span :class="docsStyles.docsPropName">gutterAriaLabel</span> saying what its divider resizes, or a screen
        reader hears a separator with no name (<a :href="WCAG_URLS['4.1.2']">WCAG 4.1.2</a>). A missing one is warned
        about in the console.
    </PageDocsAlert>

    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :orientation="orientation" :gutter-size="gutterSize" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp item-key="orientation" v-bind="SplitPaneKnobs.ORIENTATION_TEXT">
                <PageSelectField
                    :value="orientation"
                    :values="SPLIT_PANE_ORIENTATIONS"
                    ariaLabel="Orientation"
                    @change="(value: SplitPaneOrientation) => (orientation = value)"
                />
            </PageProp>

            <PageProp item-key="gutterSize" v-bind="SplitPaneKnobs.GUTTER_SIZE_TEXT">
                <PageNumberField
                    :value="gutterSize"
                    :min="SplitPaneKnobs.MIN_GUTTER"
                    :max="SplitPaneKnobs.MAX_GUTTER"
                    :step="SplitPaneKnobs.GUTTER_STEP"
                    :width="GUTTER_FIELD_WIDTH"
                    ariaLabel="Gutter size in pixels"
                    @input="(value: number) => (gutterSize = value)"
                />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="SplitPaneKnobs.IS_DISABLED_TEXT">
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

    <PageDocsSection v-bind="DOCS_SECTIONS.boundedPanes" />

    <PageDocsExample :path="`${DOCS_ROOT}/Bounded.vue`">
        <BoundedDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.threePanes" />

    <PageDocsExample :path="`${DOCS_ROOT}/Triple.vue`">
        <TripleDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.twoPictures" />

    <PageDocsExample :path="`${DOCS_ROOT}/Compare.vue`">
        <CompareDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.minimumsThatDoNotFit" />

    <PageDocsExample :path="`${DOCS_ROOT}/Cramped.vue`">
        <CrampedDocsExample />
    </PageDocsExample>
</template>
