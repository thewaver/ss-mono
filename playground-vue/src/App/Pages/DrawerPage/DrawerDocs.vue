<script setup lang="ts">
import { shallowRef } from "vue";

import { DRAWER_EDGES, MODAL_DEFAULTS } from "@thewaver/ss-components-vue";
import type { DrawerEdge } from "@thewaver/ss-components-vue";
import { DrawerKnobs } from "@thewaver/ss-playground/App/Knobs/Drawers.const";
import { ModalKnobs } from "@thewaver/ss-playground/App/Knobs/Modals.const";
import { DOCS_ROOT, DOCS_SECTIONS, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/DrawerPage/DrawerPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import SwipeDocsExample from "./Docs/Swipe.vue";

const edge = shallowRef<DrawerEdge>(DRAWER_EDGES[0]);
const transitionDurationMs = shallowRef(MODAL_DEFAULTS.transitionDurationMs);
const isDismissableOnOverlayClick = shallowRef(MODAL_DEFAULTS.isDismissableOnOverlayClick);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :edge="edge" :transition-duration-ms="transitionDurationMs" />

        <template #renderKnobs>
            <PageProp item-key="edge" v-bind="DrawerKnobs.EDGE_TEXT">
                <PageSelectField
                    :value="edge"
                    :values="DRAWER_EDGES"
                    ariaLabel="Edge"
                    @change="(value: DrawerEdge) => (edge = value)"
                />
            </PageProp>

            <PageProp item-key="transitionDurationMs" v-bind="DrawerKnobs.TRANSITION_DURATION_MS_TEXT">
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

    <PageDocsSection v-bind="DOCS_SECTIONS.swipingAway" />

    <PageDocsExample :path="`${DOCS_ROOT}/Swipe.vue`">
        <SwipeDocsExample :is-dismissable-on-overlay-click="isDismissableOnOverlayClick" />

        <template #renderKnobs>
            <PageProp item-key="isDismissableOnOverlayClick" v-bind="DrawerKnobs.IS_DISMISSABLE_ON_OVERLAY_CLICK_TEXT">
                <PageCheckField
                    :value="isDismissableOnOverlayClick"
                    ariaLabel="Closes on overlay click"
                    @change="(value: boolean) => (isDismissableOnOverlayClick = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
