<script setup lang="ts">
import { computed, shallowRef } from "vue";

import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-vue";
import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, SPOTLIGHT_DEFAULTS } from "@thewaver/ss-components-vue";
import { SpotlightGuideKnobs } from "@thewaver/ss-playground/App/Knobs/SpotlightGuides.const";
import { SpotlightKnobs } from "@thewaver/ss-playground/App/Knobs/Spotlights.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
} from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightGuidePage/SpotlightGuidePage.const";
import { FIELD_WIDTH, PADDING } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";

import PageDocsAlert from "../../../PageComponents/DocsAlert/PageDocsAlert.vue";
import PageDocsExample from "../../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../../PageComponents/DocsSection/PageDocsSection.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import TourDocsExample from "./Docs/Tour.vue";

const padding = shallowRef(PADDING);
const transitionDurationMs = shallowRef(SPOTLIGHT_DEFAULTS.transitionDurationMs);
const placementX = shallowRef<AnchorHPlacement>(SPOTLIGHT_DEFAULTS.popupPlacement.x);
const placementY = shallowRef<AnchorVPlacement>(SPOTLIGHT_DEFAULTS.popupPlacement.y);
const offsetX = shallowRef(SPOTLIGHT_DEFAULTS.popupOffset.x);
const offsetY = shallowRef(SPOTLIGHT_DEFAULTS.popupOffset.y);

const popupPlacement = computed(() => ({ x: placementX.value, y: placementY.value }));
const popupOffset = computed(() => ({ x: offsetX.value, y: offsetY.value }));
</script>

<template>
    <PageDocsAlert severity="alert">
        Give every step a sentence in <span :class="docsStyles.docsPropName">announcement</span>. Focus stays on the
        popup's buttons while the step changes under it, so without one a screen-reader user is told nothing about the
        new step (<a :href="WCAG_URLS['4.1.3']">WCAG 4.1.3</a>). A guide showing a step without one warns in the
        console, once.
    </PageDocsAlert>

    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample
            :padding="padding"
            :transition-duration-ms="transitionDurationMs"
            :popup-placement="popupPlacement"
            :popup-offset="popupOffset"
        />

        <template #renderKnobs>
            <PageProp item-key="padding" v-bind="SpotlightGuideKnobs.PADDING_TEXT">
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

            <PageProp item-key="transitionDurationMs" v-bind="SpotlightGuideKnobs.TRANSITION_DURATION_MS_TEXT">
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

            <PageProp item-key="popupPlacementX" v-bind="SpotlightGuideKnobs.POPUP_PLACEMENT_X_TEXT">
                <PageSelectField
                    :value="placementX"
                    :values="ANCHOR_H_PLACEMENTS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Popup across"
                    @change="(placement: AnchorHPlacement) => (placementX = placement)"
                />
            </PageProp>

            <PageProp item-key="popupPlacementY" v-bind="SpotlightGuideKnobs.POPUP_PLACEMENT_Y_TEXT">
                <PageSelectField
                    :value="placementY"
                    :values="ANCHOR_V_PLACEMENTS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Popup down"
                    @change="(placement: AnchorVPlacement) => (placementY = placement)"
                />
            </PageProp>

            <PageProp item-key="popupOffsetX" v-bind="SpotlightGuideKnobs.POPUP_OFFSET_X_TEXT">
                <PageNumberField
                    :value="offsetX"
                    :min="SpotlightKnobs.MIN_OFFSET"
                    :max="SpotlightKnobs.MAX_OFFSET"
                    :step="SpotlightKnobs.OFFSET_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Offset across in pixels"
                    @input="(value: number) => (offsetX = value)"
                />
            </PageProp>

            <PageProp item-key="popupOffsetY" v-bind="SpotlightGuideKnobs.POPUP_OFFSET_Y_TEXT">
                <PageNumberField
                    :value="offsetY"
                    :min="SpotlightKnobs.MIN_OFFSET"
                    :max="SpotlightKnobs.MAX_OFFSET"
                    :step="SpotlightKnobs.OFFSET_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Offset down in pixels"
                    @input="(value: number) => (offsetY = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.tourStepReaderDoes" />

    <PageDocsExample :path="`${DOCS_ROOT}/Tour.vue`">
        <TourDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>
</template>
