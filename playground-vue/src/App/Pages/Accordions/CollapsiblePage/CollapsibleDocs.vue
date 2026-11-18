<script setup lang="ts">
import { shallowRef } from "vue";

import { COLLAPSIBLE_DEFAULTS, COLLAPSIBLE_SIDES } from "@thewaver/ss-components-vue";
import type { CollapsibleSide } from "@thewaver/ss-components-vue";
import { AccordionKnobs } from "@thewaver/ss-playground/App/Knobs/Accordions.const";
import { CollapsibleKnobs } from "@thewaver/ss-playground/App/Knobs/Collapsibles.const";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
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
            <PageProp item-key="transitionDurationMs" v-bind="CollapsibleKnobs.TRANSITION_DURATION_MS_TEXT">
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

    <PageDocsSection v-bind="DOCS_SECTIONS.builtFirstOpen" />

    <PageDocsExample :path="`${DOCS_ROOT}/Deferred.vue`">
        <DeferredDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.openingSide" />

    <PageDocsExample :path="`${DOCS_ROOT}/Side.vue`">
        <SideDocsExample :side="side" />

        <template #renderKnobs>
            <PageProp item-key="side" v-bind="CollapsibleKnobs.SIDE_TEXT">
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
