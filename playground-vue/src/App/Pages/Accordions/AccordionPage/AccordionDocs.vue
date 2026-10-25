<script setup lang="ts">
import { shallowRef } from "vue";

import { ACCORDION_ORIENTATIONS, COLLAPSIBLE_DEFAULTS } from "@thewaver/ss-components-vue";
import type { AccordionOrientation } from "@thewaver/ss-components-vue";
import { AccordionKnobs } from "@thewaver/ss-playground/App/Knobs/Accordions.const";
import {
    ACCORDION_POLICIES,
    DEFAULT_ACCORDION_POLICY,
    DOCS_ROOT,
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
            <PageProp
                item-key="policy"
                label="Policy"
                hint="How many sections may be open: any number, one at a time, or one at a time with never none, where the only way out of an open section is into another one."
                controls="Sets AccordionProps.isSingleExpand and isExpandRequired"
            >
                <PageSelectField
                    :value="policy"
                    :values="ACCORDION_POLICIES"
                    ariaLabel="Policy"
                    @change="(value: AccordionPolicy) => (policy = value)"
                />
            </PageProp>

            <PageProp
                item-key="gap"
                label="Gap (px)"
                hint="The space between sections."
                controls="Sets AccordionProps.gap"
            >
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

            <PageProp
                item-key="transitionDurationMs"
                label="Transition duration (ms)"
                hint="How long a section takes to open and close. At 0 it opens and closes at once."
                controls="Sets AccordionProps.transitionDurationMs"
            >
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

    <PageDocsSection
        title="Opening and closing from outside"
        content="The accordion keeps track of which sections are open by itself. To open or close them from elsewhere on the page, hold the list and pass it in as [prop]expanded[/prop]: both sides write it, so a header press updates your list and writing your list opens or closes sections."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Controlled.vue`">
        <ControlledDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Panels that follow their content"
        content="A panel opens to its content's own height and keeps following it. Content that appears after the panel is open makes the panel grow, with no reopening and no height to guess."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Growing.vue`">
        <GrowingDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Built on first open"
        content="Set [prop]isPanelBuiltOnExpand[/prop] and a panel's content is not built until its section is first opened, and it stays built afterwards. Use it for panels that are costly to build."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Deferred.vue`">
        <DeferredDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Scrolled into view"
        content="Set [prop]isScrolledIntoViewOnExpand[/prop] and a section is brought into view once it has finished opening, which matters when the accordion sits in a box that scrolls: opening a section below the fold brings it up."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Scrolled.vue`">
        <ScrolledDocsExample :is-scrolled-into-view-on-expand="isScrolledIntoView" />

        <template #renderKnobs>
            <PageProp
                item-key="isScrolledIntoViewOnExpand"
                label="Scroll into view"
                hint="Brings a section into view once it has finished opening."
                controls="Sets AccordionProps.isScrolledIntoViewOnExpand"
            >
                <PageCheckField
                    :value="isScrolledIntoView"
                    ariaLabel="Scroll into view"
                    @change="(value: boolean) => (isScrolledIntoView = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Orientation"
        content="Set [prop]orientation[/prop] to horizontal and the sections sit side by side, each panel opening beside its header and growing in width; vertical, the default, stacks them. The arrow keys that walk the headers follow it: up and down for a column, left and right for a row, reversed in right-to-left text. The panel is also told which way the person moved, forward or backward, so its content can slide in from that side; the motion is yours."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Orientation.vue`">
        <OrientationDocsExample :orientation="orientation" />

        <template #renderKnobs>
            <PageProp
                item-key="orientation"
                label="Orientation"
                hint="Which way the sections run: stacked, each panel opening below its header, or side by side, each panel opening beside it."
                controls="Sets AccordionProps.orientation"
            >
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
