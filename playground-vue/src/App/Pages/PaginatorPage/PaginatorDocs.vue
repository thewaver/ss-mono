<script setup lang="ts">
import { shallowRef } from "vue";

import { PAGINATOR_DEFAULTS } from "@thewaver/ss-components-vue";
import { PaginatorKnobs } from "@thewaver/ss-playground/App/Knobs/Paginators.const";
import {
    COUNT_FIELD_WIDTH,
    DOCS_ROOT,
    DOCS_SECTIONS,
} from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import CountDocsExample from "./Docs/Count.vue";
import DialDocsExample from "./Docs/Dial.vue";
import EndsDocsExample from "./Docs/Ends.vue";
import JumpDocsExample from "./Docs/Jump.vue";
import LinksDocsExample from "./Docs/Links.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";

const itemCount = shallowRef(PaginatorKnobs.STARTING_ITEM_COUNT);
const pageSize = shallowRef(PaginatorKnobs.STARTING_PAGE_SIZE);
const siblingCount = shallowRef(PAGINATOR_DEFAULTS.siblingCount);
const boundaryCount = shallowRef(PAGINATOR_DEFAULTS.boundaryCount);
const isDisabled = shallowRef(PaginatorKnobs.STARTING_IS_DISABLED);
const hasLinkComponent = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample
            :item-count="itemCount"
            :page-size="pageSize"
            :sibling-count="siblingCount"
            :boundary-count="boundaryCount"
            :is-disabled="isDisabled"
        />

        <template #renderKnobs>
            <PageProp item-key="itemCount" v-bind="PaginatorKnobs.ITEM_COUNT_TEXT">
                <PageNumberField
                    :value="itemCount"
                    :min="PaginatorKnobs.MIN_ITEM_COUNT"
                    :max="PaginatorKnobs.MAX_ITEM_COUNT"
                    :step="PaginatorKnobs.COUNT_STEP"
                    :width="COUNT_FIELD_WIDTH"
                    ariaLabel="Item count"
                    @input="(value: number) => (itemCount = value)"
                />
            </PageProp>

            <PageProp item-key="pageSize" v-bind="PaginatorKnobs.PAGE_SIZE_TEXT">
                <PageNumberField
                    :value="pageSize"
                    :min="PaginatorKnobs.MIN_PAGE_SIZE"
                    :max="PaginatorKnobs.MAX_PAGE_SIZE"
                    :step="PaginatorKnobs.COUNT_STEP"
                    :width="COUNT_FIELD_WIDTH"
                    ariaLabel="Page size"
                    @input="(value: number) => (pageSize = value)"
                />
            </PageProp>

            <PageProp item-key="siblingCount" v-bind="PaginatorKnobs.SIBLING_COUNT_TEXT">
                <PageNumberField
                    :value="siblingCount"
                    :min="PaginatorKnobs.MIN_COUNT"
                    :max="PaginatorKnobs.MAX_COUNT"
                    :step="PaginatorKnobs.COUNT_STEP"
                    :width="COUNT_FIELD_WIDTH"
                    ariaLabel="Sibling count"
                    @input="(value: number) => (siblingCount = value)"
                />
            </PageProp>

            <PageProp item-key="boundaryCount" v-bind="PaginatorKnobs.BOUNDARY_COUNT_TEXT">
                <PageNumberField
                    :value="boundaryCount"
                    :min="PaginatorKnobs.MIN_COUNT"
                    :max="PaginatorKnobs.MAX_COUNT"
                    :step="PaginatorKnobs.COUNT_STEP"
                    :width="COUNT_FIELD_WIDTH"
                    ariaLabel="Boundary count"
                    @input="(value: number) => (boundaryCount = value)"
                />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="PaginatorKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.jumpsEitherEnd" />

    <PageDocsExample :path="`${DOCS_ROOT}/Ends.vue`">
        <EndsDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.pagesThatAreLinks" />

    <PageDocsExample :path="`${DOCS_ROOT}/Links.vue`">
        <LinksDocsExample :has-link-component="hasLinkComponent" />

        <template #renderKnobs>
            <PageProp item-key="hasLinkComponent" v-bind="PaginatorKnobs.HAS_LINK_COMPONENT_TEXT">
                <PageCheckField
                    :value="hasLinkComponent"
                    ariaLabel="Custom link component"
                    @change="(value: boolean) => (hasLinkComponent = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.arrowsCountBetween" />

    <PageDocsExample :path="`${DOCS_ROOT}/Count.vue`">
        <CountDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.goPageField" />

    <PageDocsExample :path="`${DOCS_ROOT}/Jump.vue`">
        <JumpDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.roundHalfDial" />

    <PageDocsExample :path="`${DOCS_ROOT}/Dial.vue`">
        <DialDocsExample />
    </PageDocsExample>
</template>
