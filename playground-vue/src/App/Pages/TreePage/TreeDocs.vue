<script setup lang="ts">
import { shallowRef } from "vue";

import { TreeKnobs } from "@thewaver/ss-playground/App/Knobs/Trees.const";
import type { TreeFalloff } from "@thewaver/ss-playground/App/Pages/TreePage/TreeFalloffs.types";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
    STRESS_COUNT_FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import CheckboxesDocsExample from "./Docs/Checkboxes.vue";
import ControlledDocsExample from "./Docs/Controlled.vue";
import DisabledDocsExample from "./Docs/Disabled.vue";
import LeaningDocsExample from "./Docs/Leaning.vue";
import LinksDocsExample from "./Docs/Links.vue";
import OnDemandDocsExample from "./Docs/OnDemand.vue";
import RadialDocsExample from "./Docs/Radial.vue";
import RecordsDocsExample from "./Docs/Records.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import VirtualizedDocsExample from "./Docs/Virtualized.vue";

const isReachable = shallowRef(false);
const hasLinkComponent = shallowRef(false);
const count = shallowRef(TreeKnobs.STARTING_STRESS_COUNT);
const falloff = shallowRef<TreeFalloff>(TreeKnobs.STARTING_FALLOFF);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.openingClosingOutside" />

    <PageDocsExample :path="`${DOCS_ROOT}/Controlled.vue`">
        <ControlledDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.disabledNodes" />

    <PageDocsExample :path="`${DOCS_ROOT}/Disabled.vue`">
        <DisabledDocsExample :is-reachable="isReachable" />

        <template #renderKnobs>
            <PageProp item-key="isReachable" v-bind="TreeKnobs.IS_REACHABLE_TEXT">
                <PageCheckField
                    :value="isReachable"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachable = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.links" />

    <PageDocsExample :path="`${DOCS_ROOT}/Links.vue`">
        <LinksDocsExample :has-link-component="hasLinkComponent" />

        <template #renderKnobs>
            <PageProp item-key="hasLinkComponent" v-bind="TreeKnobs.HAS_LINK_COMPONENT_TEXT">
                <PageCheckField
                    :value="hasLinkComponent"
                    ariaLabel="Custom link component"
                    @change="(value: boolean) => (hasLinkComponent = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.recordsValues" />

    <PageDocsExample :path="`${DOCS_ROOT}/Records.vue`">
        <RecordsDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.tickingSeveral" />

    <PageDocsExample :path="`${DOCS_ROOT}/Checkboxes.vue`">
        <CheckboxesDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.branchesThatArriveLater" />

    <PageDocsExample :path="`${DOCS_ROOT}/OnDemand.vue`">
        <OnDemandDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.manyNodes" />

    <PageDocsExample :path="`${DOCS_ROOT}/Virtualized.vue`">
        <VirtualizedDocsExample :count="count" />

        <template #renderKnobs>
            <PageProp item-key="count" v-bind="TreeKnobs.COUNT_TEXT">
                <PageNumberField
                    :value="count"
                    :min="TreeKnobs.MIN_STRESS_COUNT"
                    :max="TreeKnobs.MAX_STRESS_COUNT"
                    :step="TreeKnobs.STRESS_COUNT_STEP"
                    :width="STRESS_COUNT_FIELD_WIDTH"
                    ariaLabel="Node count"
                    @input="(value: number) => (count = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.leaningTowardPointer" />

    <PageDocsExample :path="`${DOCS_ROOT}/Leaning.vue`">
        <LeaningDocsExample :falloff="falloff" />

        <template #renderKnobs>
            <PageProp item-key="falloff" v-bind="TreeKnobs.FALLOFF_TEXT">
                <PageSelectField
                    :value="falloff"
                    :values="TreeKnobs.FALLOFFS"
                    ariaLabel="Falloff"
                    @change="(value: TreeFalloff) => (falloff = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.treeDrawnOutward" />

    <PageDocsExample :path="`${DOCS_ROOT}/Radial.vue`">
        <RadialDocsExample />
    </PageDocsExample>
</template>
