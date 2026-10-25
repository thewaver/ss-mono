<script setup lang="ts">
import { shallowRef } from "vue";

import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/MultiSelectPage/MultiSelectPage.const";

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
            <PageProp
                item-key="hasError"
                label="Error"
                hint="Marks the field invalid, for screen readers as well as for the painter."
                controls="Sets MultiSelectProps.hasError"
            >
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns the field off: it does not open, and the Tab key skips it."
                controls="Sets MultiSelectProps.isDisabled"
            >
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Right to left"
        content="Inside a box whose text runs right to left, the picks start from the right of the field, and the arrow and the clear button sit at its left end."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Groups and a query"
        content="Options can sit in groups, and a [prop]query[/prop] turns the field into a text box that narrows them, as on Select. What counts as a match is yours to decide; here a group the query has emptied is dropped from the list."
    />
    <PageDocsExample :path="`${DOCS_ROOT}/Grouped.vue`">
        <GroupedDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Clearing every pick"
        content="Give it [prop]renderClear[/prop] and a clear button sits at the end of the field while anything is picked; pressing it empties every pick at once and reports the change like any other. It needs [prop]clearAriaLabel[/prop] to name it."
    />
    <PageDocsExample :path="`${DOCS_ROOT}/Clearable.vue`">
        <ClearableDocsExample />
    </PageDocsExample>
</template>
