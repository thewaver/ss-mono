<script setup lang="ts">
import { shallowRef } from "vue";

import { ColorAreaKnobs } from "@thewaver/ss-playground/App/Knobs/ColorAreas.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/ColorAreaPage/ColorAreaPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import PickerDocsExample from "./Docs/Picker.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";

const isDisabled = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp item-key="isDisabled" v-bind="ColorAreaKnobs.IS_DISABLED_TEXT">
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

    <PageDocsSection v-bind="DOCS_SECTIONS.pickerBuiltAround" />

    <PageDocsExample :path="`${DOCS_ROOT}/Picker.vue`">
        <PickerDocsExample />
    </PageDocsExample>
</template>
