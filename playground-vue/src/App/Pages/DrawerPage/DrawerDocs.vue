<script setup lang="ts">
import { shallowRef } from "vue";

import { DRAWER_EDGES, MODAL_DEFAULTS } from "@thewaver/ss-components-vue";
import type { DrawerEdge } from "@thewaver/ss-components-vue";
import { ModalKnobs } from "@thewaver/ss-playground/App/Knobs/Modals.const";
import { DOCS_ROOT, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/DrawerPage/DrawerPage.const";

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
            <PageProp
                item-key="edge"
                label="Edge"
                hint="Which edge of the screen the drawer is attached to. It fills the length of that edge, and the painter slides it in from there."
                controls="Sets DrawerProps.edge"
            >
                <PageSelectField
                    :value="edge"
                    :values="DRAWER_EDGES"
                    ariaLabel="Edge"
                    @change="(value: DrawerEdge) => (edge = value)"
                />
            </PageProp>

            <PageProp
                item-key="transitionDurationMs"
                label="Transition duration (ms)"
                hint="How long the drawer and its overlay take to arrive and leave. At 0 they appear and go at once."
                controls="Sets DrawerProps.transitionDurationMs"
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
        title="Swiping it away"
        content='Swipe a drawer back toward its edge, more than a third of the way across it, and letting go closes it; short of that it springs back. Under a finger, a swipe over content that has been scrolled scrolls it back instead. A swipe is a drag, and a drag needs a single-pointer way to do the same thing ([wcag id="2.5.7"]WCAG 2.5.7[/wcag]), which here is the press on the overlay. So the two share one switch: turning off [prop]isDismissableOnOverlayClick[/prop] turns the swipe off with it.'
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Swipe.vue`">
        <SwipeDocsExample :is-dismissable-on-overlay-click="isDismissableOnOverlayClick" />

        <template #renderKnobs>
            <PageProp
                item-key="isDismissableOnOverlayClick"
                label="Closes on overlay click"
                hint="Whether a press on the overlay closes the drawer. Off, the drawer cannot be swiped away either."
                controls="Sets DrawerProps.isDismissableOnOverlayClick"
            >
                <PageCheckField
                    :value="isDismissableOnOverlayClick"
                    ariaLabel="Closes on overlay click"
                    @change="(value: boolean) => (isDismissableOnOverlayClick = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
