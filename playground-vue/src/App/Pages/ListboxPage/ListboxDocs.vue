<script setup lang="ts">
import { shallowRef } from "vue";

import { LISTBOX_ORIENTATIONS } from "@thewaver/ss-components-vue";
import type { ListboxOrientation } from "@thewaver/ss-components-vue";
import { ListboxKnobs } from "@thewaver/ss-playground/App/Knobs/Listboxes.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/ListboxPage/ListboxPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import GlideDocsExample from "./Docs/Glide.vue";
import GroupsDocsExample from "./Docs/Groups.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";

const isDisabled = shallowRef(false);
const orientation = shallowRef<ListboxOrientation>("horizontal");
const isGliding = shallowRef(true);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp item-key="isDisabled" v-bind="ListboxKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.severalValuesGroups" />

    <PageDocsExample :path="`${DOCS_ROOT}/Groups.vue`">
        <GroupsDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.horizontalRightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample :orientation="orientation" />

        <template #renderKnobs>
            <PageProp item-key="orientation" v-bind="ListboxKnobs.ORIENTATION_TEXT">
                <PageSelectField
                    :value="orientation"
                    :values="LISTBOX_ORIENTATIONS"
                    ariaLabel="Orientation"
                    @change="(value: ListboxOrientation) => (orientation = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.markersThatGlide" />

    <PageDocsExample :path="`${DOCS_ROOT}/Glide.vue`">
        <GlideDocsExample :is-gliding="isGliding" />

        <template #renderKnobs>
            <PageProp item-key="isGliding" v-bind="ListboxKnobs.IS_GLIDING_TEXT">
                <PageCheckField
                    :value="isGliding"
                    ariaLabel="Gliding markers"
                    @change="(value: boolean) => (isGliding = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
