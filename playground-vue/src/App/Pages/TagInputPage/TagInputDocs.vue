<script setup lang="ts">
import { shallowRef } from "vue";

import { TagInputKnobs } from "@thewaver/ss-playground/App/Knobs/TagInputs.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/TagInputPage/TagInputPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import CrowdedDocsExample from "./Docs/Crowded.vue";
import EmptyDocsExample from "./Docs/Empty.vue";
import LabeledDocsExample from "./Docs/Labeled.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import TooltipDocsExample from "./Docs/Tooltip.vue";
import UniqueDocsExample from "./Docs/Unique.vue";

const NAMING_CONTENT =
    'A tag is a button, and pressing it removes it. Its visible word alone does not say that, so a screen reader would hear only "solid, button" and not what the button is for ([wcag id="2.4.6"]WCAG 2.4.6[/wcag]). Every example here names its tags through [prop]computeTagAriaLabel[/prop], which is handed the tag and answers in the page\'s language: here "solid, remove". The tag\'s own word comes first, so someone speaking to their computer can still say what they see ([wcag id="2.5.3"]WCAG 2.5.3[/wcag]).';

const hasError = shallowRef(false);
const isDisabled = shallowRef(false);
const isReachableWhenDisabled = shallowRef(false);
const isTooltipDisabled = shallowRef(false);
</script>

<template>
    <PageDocsSection title="Naming each tag" :content="NAMING_CONTENT" />

    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :has-error="hasError" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp item-key="hasError" v-bind="TagInputKnobs.HAS_ERROR_TEXT">
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="TagInputKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.placeholder" />

    <PageDocsExample :path="`${DOCS_ROOT}/Empty.vue`">
        <EmptyDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.refusingWord" />

    <PageDocsExample :path="`${DOCS_ROOT}/Unique.vue`">
        <UniqueDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.manyTagsNarrowBox" />

    <PageDocsExample :path="`${DOCS_ROOT}/Crowded.vue`">
        <CrowdedDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.tooltip" />

    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                v-bind="TagInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT"
            >
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>

            <PageProp item-key="tooltipIsDisabled" v-bind="TagInputKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isTooltipDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isTooltipDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.namedLabel" />

    <PageDocsExample :path="`${DOCS_ROOT}/Labeled.vue`">
        <LabeledDocsExample />
    </PageDocsExample>
</template>
