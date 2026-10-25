<script setup lang="ts">
import { shallowRef } from "vue";

import { SPOTLIGHT_DEFAULTS } from "@thewaver/ss-components-vue";
import { SpotlightKnobs } from "@thewaver/ss-playground/App/Knobs/Spotlights.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightHintPage/SpotlightHintPage.const";
import { FIELD_WIDTH, PADDING } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";

import PageDocsAlert from "../../../PageComponents/DocsAlert/PageDocsAlert.vue";
import PageDocsExample from "../../../PageComponents/DocsExample/PageDocsExample.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";

const padding = shallowRef(PADDING);
const transitionDurationMs = shallowRef(SPOTLIGHT_DEFAULTS.transitionDurationMs);
</script>

<template>
    <PageDocsAlert severity="alert">
        A hint is only drawn: it moves no focus and says nothing, so a screen-reader user never learns it appeared.
        Whatever it points at must also be said in text the page reads out, in the control's own name or description or
        in a sentence beside it (<a :href="WCAG_URLS['1.3.1']">WCAG 1.3.1</a>).
    </PageDocsAlert>

    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :padding="padding" :transition-duration-ms="transitionDurationMs" />

        <template #renderKnobs>
            <PageProp
                item-key="padding"
                label="Padding (px)"
                hint="How much room is left around the lit element, so the hole is not cut tight against it."
                controls="Sets SpotlightHintProps.padding"
            >
                <PageNumberField
                    :value="padding"
                    :min="SpotlightKnobs.MIN_PADDING"
                    :max="SpotlightKnobs.MAX_PADDING"
                    :step="SpotlightKnobs.PADDING_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Padding in pixels"
                    @input="(value: number) => (padding = value)"
                />
            </PageProp>

            <PageProp
                item-key="transitionDurationMs"
                label="Transition duration (ms)"
                hint="How long the hint takes to fade in and out. At 0 it appears and goes at once."
                controls="Sets SpotlightHintProps.transitionDurationMs"
            >
                <PageNumberField
                    :value="transitionDurationMs"
                    :min="SpotlightKnobs.MIN_DURATION"
                    :max="SpotlightKnobs.MAX_DURATION"
                    :step="SpotlightKnobs.DURATION_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Transition duration in milliseconds"
                    @input="(value: number) => (transitionDurationMs = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
