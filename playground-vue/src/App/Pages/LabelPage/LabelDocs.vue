<script setup lang="ts">
import { shallowRef } from "vue";

import type { LabelOrientation } from "@thewaver/ss-components-vue";
import { LABEL_DEFAULTS, LABEL_ORIENTATIONS } from "@thewaver/ss-components-vue";
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/LabelPage/LabelPage.const";

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
            <PageProp
                item-key="orientation"
                label="Orientation"
                hint="Whether the caption and the checkbox sit side by side or one above the other, in the order they are written."
                controls="Sets LabelProps.orientation"
            >
                <PageSelectField
                    :value="orientation"
                    :values="LABEL_ORIENTATIONS"
                    ariaLabel="Orientation"
                    @change="(value: LabelOrientation) => (orientation = value)"
                />
            </PageProp>

            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns the checkbox off: pressing it or its caption changes nothing, and the Tab key skips it."
                controls="Sets CheckboxProps.isDisabled on the checkbox inside the label"
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
        content="Inside a box whose text runs right to left, the label lays its children out from the right, so the checkbox, written first, sits to the right of its caption."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="The caption first"
        content="The caption and the control sit in the order they are written, so a caption written first comes before the control, as is usual beside a switch. Pressing the caption still flips it."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/CaptionFirst.vue`">
        <CaptionFirstDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="One label per radio"
        content="A label names one control, so in a radio group each radio gets a label of its own. The group as a whole is named through its own [prop]ariaLabel[/prop], since a caption wrapped round the whole group would name only the first radio, and pressing it would pick that one."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/LabelPerRadio.vue`">
        <LabelPerRadioDocsExample />
    </PageDocsExample>

    <PageDocsSection title="The caption wins" :content="SUPPRESSED_CONTENT" />

    <PageDocsExample :path="`${DOCS_ROOT}/Suppressed.vue`">
        <SuppressedDocsExample />
    </PageDocsExample>
</template>
