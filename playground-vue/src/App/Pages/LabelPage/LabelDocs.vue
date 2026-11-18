<script setup lang="ts">
import { shallowRef } from "vue";

import type { LabelOrientation } from "@thewaver/ss-components-vue";
import { LABEL_DEFAULTS, LABEL_ORIENTATIONS } from "@thewaver/ss-components-vue";
import { LabelKnobs } from "@thewaver/ss-playground/App/Knobs/Labels.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/LabelPage/LabelPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import CaptionFirstDocsExample from "./Docs/CaptionFirst.vue";
import LabelPerRadioDocsExample from "./Docs/LabelPerRadio.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import SuppressedDocsExample from "./Docs/Suppressed.vue";

const SUPPRESSED_CONTENT =
    'Inside a label, the caption is the control\'s name. A control also given an [prop]ariaLabel[/prop] drops it and warns in the console during development, since a screen reader would otherwise announce words that are not on screen, which fails [wcag id="2.5.3"]WCAG 2.5.3[/wcag]. This checkbox was given "Announced as something else", and is still announced as its caption.';

const orientation = shallowRef<LabelOrientation>(LABEL_DEFAULTS.orientation);
const isDisabled = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :orientation="orientation" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp item-key="orientation" v-bind="LabelKnobs.ORIENTATION_TEXT">
                <PageSelectField
                    :value="orientation"
                    :values="LABEL_ORIENTATIONS"
                    ariaLabel="Orientation"
                    @change="(value: LabelOrientation) => (orientation = value)"
                />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="LabelKnobs.IS_DISABLED_TEXT">
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

    <PageDocsSection v-bind="DOCS_SECTIONS.captionFirst" />

    <PageDocsExample :path="`${DOCS_ROOT}/CaptionFirst.vue`">
        <CaptionFirstDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.oneLabelPerRadio" />

    <PageDocsExample :path="`${DOCS_ROOT}/LabelPerRadio.vue`">
        <LabelPerRadioDocsExample />
    </PageDocsExample>

    <PageDocsSection title="The caption wins" :content="SUPPRESSED_CONTENT" />

    <PageDocsExample :path="`${DOCS_ROOT}/Suppressed.vue`">
        <SuppressedDocsExample />
    </PageDocsExample>
</template>
