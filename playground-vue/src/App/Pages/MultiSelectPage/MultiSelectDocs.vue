<script setup lang="ts">
import { shallowRef } from "vue";

import { MultiSelectKnobs } from "@thewaver/ss-playground/App/Knobs/MultiSelects.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/MultiSelectPage/MultiSelectPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import ClearableDocsExample from "./Docs/Clearable.vue";
import GroupedDocsExample from "./Docs/Grouped.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";

const hasError = shallowRef(false);
const isDisabled = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :has-error="hasError" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp item-key="hasError" v-bind="MultiSelectKnobs.HAS_ERROR_TEXT">
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="MultiSelectKnobs.IS_DISABLED_TEXT">
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

    <PageDocsSection v-bind="DOCS_SECTIONS.groupsQuery" />
    <PageDocsExample :path="`${DOCS_ROOT}/Grouped.vue`">
        <GroupedDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.clearingEveryPick" />
    <PageDocsExample :path="`${DOCS_ROOT}/Clearable.vue`">
        <ClearableDocsExample />
    </PageDocsExample>
</template>
