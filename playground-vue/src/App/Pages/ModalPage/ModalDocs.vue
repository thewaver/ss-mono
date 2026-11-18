<script setup lang="ts">
import { shallowRef } from "vue";

import type { ModalAlignment } from "@thewaver/ss-components-vue";
import { MODAL_ALIGNMENTS, MODAL_DEFAULTS } from "@thewaver/ss-components-vue";
import { ModalKnobs } from "@thewaver/ss-playground/App/Knobs/Modals.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import { DOCS_ROOT, DOCS_SECTIONS, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/ModalPage/ModalPage.const";

import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.vue";
import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import AlertDocsExample from "./Docs/Alert.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import DraggingDocsExample from "./Docs/Dragging.vue";
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
            <PageProp item-key="alignment" v-bind="ModalKnobs.ALIGNMENT_TEXT">
                <PageSelectField
                    :value="alignment"
                    :values="MODAL_ALIGNMENTS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Alignment"
                    @change="(value: ModalAlignment) => (alignment = value)"
                />
            </PageProp>

            <PageProp item-key="transitionDurationMs" v-bind="ModalKnobs.TRANSITION_DURATION_MS_TEXT">
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

    <PageDocsSection v-bind="DOCS_SECTIONS.dialogThatMustBeAnswered" />

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
            <PageProp item-key="isDismissableOnOverlayClick" v-bind="ModalKnobs.IS_DISMISSABLE_ON_OVERLAY_CLICK_TEXT">
                <PageCheckField
                    :value="isDismissableOnOverlayClick"
                    ariaLabel="Closes on overlay click"
                    @change="(value: boolean) => (isDismissableOnOverlayClick = value)"
                />
            </PageProp>

            <PageProp item-key="isDismissableOnEscape" v-bind="ModalKnobs.IS_DISMISSABLE_ON_ESCAPE_TEXT">
                <PageCheckField
                    :value="isDismissableOnEscape"
                    ariaLabel="Closes on Escape"
                    @change="(value: boolean) => (isDismissableOnEscape = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.popupInside" />

    <PageDocsExample :path="`${DOCS_ROOT}/Layered.vue`">
        <LayeredDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.dragInside" />

    <PageDocsExample :path="`${DOCS_ROOT}/Dragging.vue`">
        <DraggingDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.nothingFocusableInside" />

    <PageDocsExample :path="`${DOCS_ROOT}/TextOnly.vue`">
        <TextOnlyDocsExample />
    </PageDocsExample>
</template>
