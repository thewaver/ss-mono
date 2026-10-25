<script setup lang="ts">
import { shallowRef } from "vue";

import { COLLAPSIBLE_DEFAULTS, COLLAPSIBLE_SIDES } from "@thewaver/ss-components-vue";
import type { CollapsibleSide } from "@thewaver/ss-components-vue";
import { AccordionKnobs } from "@thewaver/ss-playground/App/Knobs/Accordions.const";
import {
    DOCS_ROOT,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/Accordions/CollapsiblePage/CollapsiblePage.const";

import PageDocsExample from "../../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../../PageComponents/DocsSection/PageDocsSection.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import ControlledDocsExample from "./Docs/Controlled.vue";
import DeferredDocsExample from "./Docs/Deferred.vue";
import SideDocsExample from "./Docs/Side.vue";

const transitionDurationMs = shallowRef(COLLAPSIBLE_DEFAULTS.transitionDurationMs);
const side = shallowRef<CollapsibleSide>("right");
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :transition-duration-ms="transitionDurationMs" />

        <template #renderKnobs>
            <PageProp
                item-key="transitionDurationMs"
                label="Transition duration (ms)"
                hint="How long the panel takes to open and close. At 0 it opens and closes at once."
                controls="Sets CollapsibleProps.transitionDurationMs"
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

    <PageDocsSection title="Opening and closing from outside">
        The collapsible keeps track of whether it is open by itself. To open or close it from elsewhere on the page,
        hold the boolean and pass it in as expanded: both sides write it, so pressing the trigger updates yours and
        writing yours opens or closes the panel.
    </PageDocsSection>

    <PageDocsExample :path="`${DOCS_ROOT}/Controlled.vue`">
        <ControlledDocsExample />
    </PageDocsExample>

    <PageDocsSection title="Built on first open">
        Set isPanelBuiltOnExpand and the panel's contents are not built until it is first opened, and they are kept once
        they are. It trades a cheaper first render for a pause on that first open.
    </PageDocsSection>

    <PageDocsExample :path="`${DOCS_ROOT}/Deferred.vue`">
        <DeferredDocsExample />
    </PageDocsExample>

    <PageDocsSection title="Opening to a side">
        Set side to choose which side of the trigger the panel opens on. Top and bottom grow the panel's height, left
        and right its width; a sideways panel keeps its contents at their own width and uncovers them, so give them one.
    </PageDocsSection>

    <PageDocsExample :path="`${DOCS_ROOT}/Side.vue`">
        <SideDocsExample :side="side" />

        <template #renderKnobs>
            <PageProp
                item-key="side"
                label="Side"
                hint="Which side of the trigger the panel opens on."
                controls="Sets CollapsibleProps.side"
            >
                <PageSelectField
                    :value="side"
                    :values="COLLAPSIBLE_SIDES"
                    ariaLabel="Side"
                    @change="(value: CollapsibleSide) => (side = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
