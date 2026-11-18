<script setup lang="ts">
import { shallowRef } from "vue";

import { ACCORDION_ORIENTATIONS, COLLAPSIBLE_DEFAULTS } from "@thewaver/ss-components-vue";
import type { AccordionOrientation } from "@thewaver/ss-components-vue";
import { AccordionKnobs } from "@thewaver/ss-playground/App/Knobs/Accordions.const";
import {
    ACCORDION_POLICIES,
    DEFAULT_ACCORDION_POLICY,
    DOCS_ROOT,
    DOCS_SECTIONS,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
import type { AccordionPolicy } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.types";
import { AccordionPageUtils } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.utils";

import PageDocsExample from "../../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import ControlledDocsExample from "./Docs/Controlled.vue";
import DeferredDocsExample from "./Docs/Deferred.vue";
import GrowingDocsExample from "./Docs/Growing.vue";
import OrientationDocsExample from "./Docs/Orientation.vue";
import ScrolledDocsExample from "./Docs/Scrolled.vue";

const policy = shallowRef<AccordionPolicy>(DEFAULT_ACCORDION_POLICY);
const gap = shallowRef(AccordionKnobs.STARTING_GAP);
const transitionDurationMs = shallowRef(COLLAPSIBLE_DEFAULTS.transitionDurationMs);
const isScrolledIntoView = shallowRef(true);
const orientation = shallowRef<AccordionOrientation>("horizontal");
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample
            :is-single-expand="AccordionPageUtils.getIsSingleExpand(policy)"
            :is-expand-required="AccordionPageUtils.getIsExpandRequired(policy)"
            :gap="gap"
            :transition-duration-ms="transitionDurationMs"
        />

        <template #renderKnobs>
            <PageProp item-key="policy" v-bind="AccordionKnobs.POLICY_TEXT">
                <PageSelectField
                    :value="policy"
                    :values="ACCORDION_POLICIES"
                    ariaLabel="Policy"
                    @change="(value: AccordionPolicy) => (policy = value)"
                />
            </PageProp>

            <PageProp item-key="gap" v-bind="AccordionKnobs.GAP_TEXT">
                <PageNumberField
                    :value="gap"
                    :min="AccordionKnobs.MIN_GAP"
                    :max="AccordionKnobs.MAX_GAP"
                    :step="AccordionKnobs.GAP_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Gap in pixels"
                    @input="(value: number) => (gap = value)"
                />
            </PageProp>

            <PageProp item-key="transitionDurationMs" v-bind="AccordionKnobs.TRANSITION_DURATION_MS_TEXT">
                <PageNumberField
                    :value="transitionDurationMs"
                    :min="AccordionKnobs.MIN_TRANSITION_MS"
                    :max="AccordionKnobs.MAX_TRANSITION_MS"
                    :step="AccordionKnobs.TRANSITION_STEP_MS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Transition duration in milliseconds"
                    @input="(value: number) => (transitionDurationMs = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.openingClosingOutside" />

    <PageDocsExample :path="`${DOCS_ROOT}/Controlled.vue`">
        <ControlledDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.panelsFollowContent" />

    <PageDocsExample :path="`${DOCS_ROOT}/Growing.vue`">
        <GrowingDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.builtFirstOpen" />

    <PageDocsExample :path="`${DOCS_ROOT}/Deferred.vue`">
        <DeferredDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.scrolledIntoView" />

    <PageDocsExample :path="`${DOCS_ROOT}/Scrolled.vue`">
        <ScrolledDocsExample :is-scrolled-into-view-on-expand="isScrolledIntoView" />

        <template #renderKnobs>
            <PageProp
                item-key="isScrolledIntoViewOnExpand"
                v-bind="AccordionKnobs.IS_SCROLLED_INTO_VIEW_ON_EXPAND_TEXT"
            >
                <PageCheckField
                    :value="isScrolledIntoView"
                    ariaLabel="Scroll into view"
                    @change="(value: boolean) => (isScrolledIntoView = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.orientation" />

    <PageDocsExample :path="`${DOCS_ROOT}/Orientation.vue`">
        <OrientationDocsExample :orientation="orientation" />

        <template #renderKnobs>
            <PageProp item-key="orientation" v-bind="AccordionKnobs.ORIENTATION_TEXT">
                <PageSelectField
                    :value="orientation"
                    :values="ACCORDION_ORIENTATIONS"
                    ariaLabel="Orientation"
                    @change="(value: AccordionOrientation) => (orientation = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
