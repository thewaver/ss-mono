<script setup lang="ts">
import { shallowRef } from "vue";

import type { ModalAlignment } from "@thewaver/ss-components-vue";
import { MODAL_ALIGNMENTS, MODAL_DEFAULTS } from "@thewaver/ss-components-vue";
import { ModalKnobs } from "@thewaver/ss-playground/App/Knobs/Modals.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import { DOCS_ROOT, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/ModalPage/ModalPage.const";

import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.vue";
import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import AlertDocsExample from "./Docs/Alert.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import LayeredDocsExample from "./Docs/Layered.vue";
import TextOnlyDocsExample from "./Docs/TextOnly.vue";

const alignment = shallowRef<ModalAlignment>(MODAL_DEFAULTS.alignment);
const transitionDurationMs = shallowRef(MODAL_DEFAULTS.transitionDurationMs);
const isDismissableOnOverlayClick = shallowRef(false);
const isDismissableOnEscape = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :alignment="alignment" :transition-duration-ms="transitionDurationMs" />

        <template #renderKnobs>
            <PageProp
                item-key="alignment"
                label="Alignment"
                hint="Where the dialog sits: in the middle, or against one edge of the screen and stretched along it."
                controls="Sets ModalProps.alignment"
            >
                <PageSelectField
                    :value="alignment"
                    :values="MODAL_ALIGNMENTS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Alignment"
                    @change="(value: ModalAlignment) => (alignment = value)"
                />
            </PageProp>

            <PageProp
                item-key="transitionDurationMs"
                label="Transition duration (ms)"
                hint="How long the dialog and its overlay take to fade in and out. At 0 they appear and go at once."
                controls="Sets ModalProps.transitionDurationMs"
            >
                <PageNumberField
                    :value="transitionDurationMs"
                    :min="ModalKnobs.MIN_TRANSITION_MS"
                    :max="ModalKnobs.MAX_TRANSITION_MS"
                    :step="ModalKnobs.TRANSITION_STEP_MS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Transition duration in milliseconds"
                    @input="(value: number) => (transitionDurationMs = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="A dialog that must be answered"
        content="Set [prop]role[/prop] to alertdialog for a dialog that interrupts to ask for a decision, so it is announced more insistently than an ordinary one. Point [prop]initialFocusRef[/prop] at the answer that loses nothing, Cancel here, so that is where focus lands. Switching off [prop]isDismissableOnOverlayClick[/prop] keeps a press beside the dialog from closing it, and switching off [prop]isDismissableOnEscape[/prop] does the same for Escape, so the only way out is an answer."
    />

    <PageDocsAlert severity="alert">
        With both <span :class="docsStyles.docsPropName">isDismissableOnOverlayClick</span> and
        <span :class="docsStyles.docsPropName">isDismissableOnEscape</span> off, the dialog has no way out of its own.
        Put a control inside it that closes it, as Delete and Cancel do here, or a keyboard user is shut in (<a
            :href="WCAG_URLS['2.1.2']"
            >WCAG 2.1.2</a
        >). The library cannot tell whether you have.
    </PageDocsAlert>

    <PageDocsExample :path="`${DOCS_ROOT}/Alert.vue`">
        <AlertDocsExample
            :is-dismissable-on-overlay-click="isDismissableOnOverlayClick"
            :is-dismissable-on-escape="isDismissableOnEscape"
        />

        <template #renderKnobs>
            <PageProp
                item-key="isDismissableOnOverlayClick"
                label="Closes on overlay click"
                hint="Whether a press on the overlay beside the dialog closes it."
                controls="Sets ModalProps.isDismissableOnOverlayClick"
            >
                <PageCheckField
                    :value="isDismissableOnOverlayClick"
                    ariaLabel="Closes on overlay click"
                    @change="(value: boolean) => (isDismissableOnOverlayClick = value)"
                />
            </PageProp>

            <PageProp
                item-key="isDismissableOnEscape"
                label="Closes on Escape"
                hint="Whether Escape closes the dialog."
                controls="Sets ModalProps.isDismissableOnEscape"
            >
                <PageCheckField
                    :value="isDismissableOnEscape"
                    ariaLabel="Closes on Escape"
                    @change="(value: boolean) => (isDismissableOnEscape = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="A popup inside it"
        content="A popup opened inside the dialog, such as this list, is a layer above it. Escape closes only the layer on top: the first press closes the list and leaves the dialog open, and the next closes the dialog."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Layered.vue`">
        <LayeredDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Nothing focusable inside"
        content="On opening, focus goes to [prop]initialFocusRef[/prop] when there is one, and otherwise to the first thing inside that can take it. A dialog holding only text has nothing that can, so the dialog takes focus itself rather than leaving it on the page behind."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/TextOnly.vue`">
        <TextOnlyDocsExample />
    </PageDocsExample>
</template>
