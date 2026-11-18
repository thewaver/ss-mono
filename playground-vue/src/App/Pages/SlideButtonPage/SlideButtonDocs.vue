<script setup lang="ts">
import { shallowRef } from "vue";

import {
    NAVIGATOR_DIRECTIONS,
    SLIDE_BUTTON_DEFAULTS,
    SLIDE_BUTTON_MODES,
    SLIDE_BUTTON_ORIENTATIONS,
} from "@thewaver/ss-components-vue";
import type { NavigatorDirection, SlideButtonMode, SlideButtonOrientation } from "@thewaver/ss-components-vue";
import { SlideButtonKnobs } from "@thewaver/ss-playground/App/Knobs/SlideButtons.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.const";

import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.vue";
import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import DirectionsDocsExample from "./Docs/Directions.vue";
import HeldDocsExample from "./Docs/Held.vue";

const mode = shallowRef<SlideButtonMode>(SLIDE_BUTTON_DEFAULTS.mode);
const completionRatio = shallowRef(SLIDE_BUTTON_DEFAULTS.completionRatio);
const holdDurationMs = shallowRef(SLIDE_BUTTON_DEFAULTS.holdDurationMs);
const isDisabled = shallowRef(false);
const hasError = shallowRef(false);
const orientation = shallowRef<SlideButtonOrientation>(SLIDE_BUTTON_DEFAULTS.orientation);
const direction = shallowRef<NavigatorDirection>(NAVIGATOR_DIRECTIONS[0]);
</script>

<template>
    <PageDocsAlert severity="alert">
        Give every SlideButton an <span :class="docsStyles.docsPropName">ariaDescription</span> that says how to confirm
        it without sliding, such as which key to hold. Holding Enter or Space is the keyboard route
        <a :href="WCAG_URLS['2.1.1']">WCAG 2.1.1</a> requires, and nothing else tells a screen reader user that it
        exists or that a plain press does nothing. A button without one warns in the console.
    </PageDocsAlert>

    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample
            :mode="mode"
            :completion-ratio="completionRatio"
            :hold-duration-ms="holdDurationMs"
            :is-disabled="isDisabled"
            :has-error="hasError"
        />

        <template #renderKnobs>
            <PageProp item-key="mode" v-bind="SlideButtonKnobs.MODE_TEXT">
                <PageSelectField
                    :value="mode"
                    :values="SLIDE_BUTTON_MODES"
                    ariaLabel="Mode"
                    @change="(value: SlideButtonMode) => (mode = value)"
                />
            </PageProp>

            <PageProp item-key="completionRatio" v-bind="SlideButtonKnobs.COMPLETION_RATIO_TEXT">
                <PageNumberField
                    :value="completionRatio"
                    :min="SlideButtonKnobs.MIN_COMPLETION_RATIO"
                    :max="SlideButtonKnobs.MAX_COMPLETION_RATIO"
                    :step="SlideButtonKnobs.COMPLETION_RATIO_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Completion ratio"
                    @input="(value: number) => (completionRatio = value)"
                />
            </PageProp>

            <PageProp item-key="holdDurationMs" v-bind="SlideButtonKnobs.HOLD_DURATION_MS_TEXT">
                <PageNumberField
                    :value="holdDurationMs"
                    :min="SlideButtonKnobs.MIN_HOLD_DURATION_MS"
                    :max="SlideButtonKnobs.MAX_HOLD_DURATION_MS"
                    :step="SlideButtonKnobs.HOLD_DURATION_STEP_MS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Hold duration"
                    @input="(value: number) => (holdDurationMs = value)"
                />
            </PageProp>

            <PageProp item-key="hasError" v-bind="SlideButtonKnobs.HAS_ERROR_TEXT">
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="SlideButtonKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.orientationDirection" />

    <PageDocsExample :path="`${DOCS_ROOT}/Directions.vue`">
        <DirectionsDocsExample :orientation="orientation" :direction="direction" />

        <template #renderKnobs>
            <PageProp item-key="orientation" v-bind="SlideButtonKnobs.ORIENTATION_TEXT">
                <PageSelectField
                    :value="orientation"
                    :values="SLIDE_BUTTON_ORIENTATIONS"
                    ariaLabel="Orientation"
                    @change="(value: SlideButtonOrientation) => (orientation = value)"
                />
            </PageProp>

            <PageProp item-key="direction" v-bind="SlideButtonKnobs.DIRECTION_TEXT">
                <PageSelectField
                    :value="direction"
                    :values="NAVIGATOR_DIRECTIONS"
                    ariaLabel="Direction"
                    @change="(value: NavigatorDirection) => (direction = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.holdingThumbEnd" />

    <PageDocsExample :path="`${DOCS_ROOT}/Held.vue`">
        <HeldDocsExample />
    </PageDocsExample>
</template>
