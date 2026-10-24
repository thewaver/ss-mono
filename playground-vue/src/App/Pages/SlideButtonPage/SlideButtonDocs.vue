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
import { DOCS_ROOT, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.const";

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
    <PageDocsAlert>
        Give every SlideButton an ariaDescription that says how to confirm it without sliding, such as which key to
        hold. Nothing else tells a screen reader user that a plain press does nothing, and a button without one warns in
        the console.
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
            <PageProp
                item-key="mode"
                label="Mode"
                hint="Which pointer gestures confirm: sliding the thumb to the end, pressing and holding, or both. A held Enter or Space confirms under every mode."
                controls="Sets SlideButtonProps.mode"
            >
                <PageSelectField
                    :value="mode"
                    :values="SLIDE_BUTTON_MODES"
                    ariaLabel="Mode"
                    @change="(value: SlideButtonMode) => (mode = value)"
                />
            </PageProp>

            <PageProp
                item-key="completionRatio"
                label="Completion ratio"
                hint="How far along the track the thumb has to be when let go for the slide to complete. At 1 it has to reach the end; short of it, it springs back."
                controls="Sets SlideButtonProps.completionRatio"
            >
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

            <PageProp
                item-key="holdDurationMs"
                label="Hold duration"
                hint="How long the button has to be held to confirm without sliding, in milliseconds. It times a held Enter or Space under every mode, and a held pointer under all but slide."
                controls="Sets SlideButtonProps.holdDurationMs"
            >
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

            <PageProp
                item-key="hasError"
                label="Error"
                hint="Puts the button in its error look. It changes nothing about what the button accepts or does."
                controls="Sets SlideButtonProps.hasError"
            >
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns the button off: it refuses the drag and the hold, and the Tab key skips it."
                controls="Sets SlideButtonProps.isDisabled"
            >
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection title="Orientation and direction">
        A horizontal button slides from the side the text starts on: left to right, or right to left in a right-to-left
        page. A vertical one slides up from the bottom of the track, whichever way the text runs. The hold, a held Enter
        or Space and a click from assistive technology work the same in every direction.
    </PageDocsSection>

    <PageDocsExample :path="`${DOCS_ROOT}/Directions.vue`">
        <DirectionsDocsExample :orientation="orientation" :direction="direction" />

        <template #renderKnobs>
            <PageProp
                item-key="orientation"
                label="Orientation"
                hint="Whether the track runs across the page or up it."
                controls="Sets SlideButtonProps.orientation"
            >
                <PageSelectField
                    :value="orientation"
                    :values="SLIDE_BUTTON_ORIENTATIONS"
                    ariaLabel="Orientation"
                    @change="(value: SlideButtonOrientation) => (orientation = value)"
                />
            </PageProp>

            <PageProp
                item-key="direction"
                label="Direction"
                hint="Which way text runs around the button, set on the box that holds it. A right-to-left box makes a horizontal button slide leftward; a vertical one is unaffected."
                controls="Sets dir on the box around the button"
            >
                <PageSelectField
                    :value="direction"
                    :values="NAVIGATOR_DIRECTIONS"
                    ariaLabel="Direction"
                    @change="(value: NavigatorDirection) => (direction = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection title="Holding the thumb at the end">
        To keep the thumb at the end after a successful slide, mark the button pressed until you reset it. The
        Playground's painter draws a pressed button with its thumb at the end; what a pressed button looks like is up to
        your painter.
    </PageDocsSection>

    <PageDocsExample :path="`${DOCS_ROOT}/Held.vue`">
        <HeldDocsExample />
    </PageDocsExample>
</template>
