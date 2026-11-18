<script setup lang="ts">
import { shallowRef } from "vue";

import { RadioKnobs } from "@thewaver/ss-playground/App/Knobs/Radios.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import ArcDocsExample from "./Docs/Arc.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import DecoratedDocsExample from "./Docs/Decorated.vue";
import DisabledOptionDocsExample from "./Docs/DisabledOption.vue";
import RatingDocsExample from "./Docs/Rating.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import SegmentedDocsExample from "./Docs/Segmented.vue";

const hasError = shallowRef(false);
const isDisabled = shallowRef(false);
const isReachableWhenDisabled = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :has-error="hasError" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp item-key="hasError" v-bind="RadioKnobs.HAS_ERROR_TEXT">
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="RadioKnobs.IS_DISABLED_TEXT">
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

    <PageDocsSection v-bind="DOCS_SECTIONS.segmented" />

    <PageDocsExample :path="`${DOCS_ROOT}/Segmented.vue`">
        <SegmentedDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rating" />

    <PageDocsExample :path="`${DOCS_ROOT}/Rating.vue`">
        <RatingDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.bentIntoArc" />

    <PageDocsExample :path="`${DOCS_ROOT}/Arc.vue`">
        <ArcDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.decoration" />

    <PageDocsExample :path="`${DOCS_ROOT}/Decorated.vue`">
        <DecoratedDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.disabledOption" />

    <PageDocsExample :path="`${DOCS_ROOT}/DisabledOption.vue`">
        <DisabledOptionDocsExample :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp item-key="isReachableWhenDisabled" v-bind="RadioKnobs.IS_REACHABLE_WHEN_DISABLED_TEXT">
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
