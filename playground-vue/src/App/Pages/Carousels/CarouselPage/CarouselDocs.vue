<script setup lang="ts">
import { shallowRef } from "vue";

import { CAROUSEL_DEFAULTS, CAROUSEL_ORIENTATIONS, CarouselPlacements } from "@thewaver/ss-components-vue";
import type { CarouselOrientation } from "@thewaver/ss-components-vue";
import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/Carousels/CarouselPage/CarouselPage.const";
import { FIELD_WIDTH, PLACEMENT_FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";

import PageDocsAlert from "../../../PageComponents/DocsAlert/PageDocsAlert.vue";
import PageDocsExample from "../../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import LooksDocsExample from "./Docs/Looks.vue";
import LoopingDocsExample from "./Docs/Looping.vue";
import PairsDocsExample from "./Docs/Pairs.vue";
import ScrolledDocsExample from "./Docs/Scrolled.vue";
import WindowedDocsExample from "./Docs/Windowed.vue";

const transitionDurationMs = shallowRef(CAROUSEL_DEFAULTS.transitionDurationMs);
const orientation = shallowRef<CarouselOrientation>(CAROUSEL_DEFAULTS.orientation);
const isDisabled = shallowRef(false);
const placement = shallowRef<CarouselPlacements.SampleKey>(CarouselKnobs.STARTING_PLACEMENT);
const looksOrientation = shallowRef<CarouselOrientation>(CAROUSEL_DEFAULTS.orientation);
const isLooping = shallowRef(CAROUSEL_DEFAULTS.isLooping);
const autoplayDelayMs = shallowRef(CarouselKnobs.STARTING_DELAY_MS);
</script>

<template>
    <PageDocsAlert severity="alert">
        Build Previous and Next buttons on the controller <span :class="docsStyles.docsPropName">onMount</span> hands
        you, since not everyone can swipe (<a :href="WCAG_URLS['2.5.7']">WCAG 2.5.7</a>), and if the carousel moves on
        its own, a button that stops it (<a :href="WCAG_URLS['2.2.2']">WCAG 2.2.2</a>). Pass those buttons' hover and
        focus to <span :class="docsStyles.docsPropName">setIsHeldByPage</span>, so it holds still while someone is using
        them.
    </PageDocsAlert>

    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample
            :orientation="orientation"
            :transition-duration-ms="transitionDurationMs"
            :is-disabled="isDisabled"
        />

        <template #renderKnobs>
            <PageProp item-key="transitionDurationMs" v-bind="CarouselKnobs.TRANSITION_DURATION_MS_TEXT">
                <PageNumberField
                    :value="transitionDurationMs"
                    :min="CarouselKnobs.MIN_TRANSITION_MS"
                    :max="CarouselKnobs.MAX_TRANSITION_MS"
                    :step="CarouselKnobs.TRANSITION_STEP_MS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Transition duration in milliseconds"
                    @input="(value: number) => (transitionDurationMs = value)"
                />
            </PageProp>

            <PageProp item-key="orientation" v-bind="CarouselKnobs.ORIENTATION_TEXT">
                <PageSelectField
                    :value="orientation"
                    :values="CAROUSEL_ORIENTATIONS"
                    ariaLabel="Orientation"
                    @change="(value: CarouselOrientation) => (orientation = value)"
                />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="CarouselKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.looks" />

    <PageDocsAlert severity="info">
        The looks here are only examples. Any rule you write can be the
        <span :class="docsStyles.docsPropName">placement</span>: a function told how far a slide is from the one showing
        that answers where to draw it, so the layout is entirely yours.
    </PageDocsAlert>

    <PageDocsExample :path="`${DOCS_ROOT}/Looks.vue`">
        <LooksDocsExample :placement="placement" :orientation="looksOrientation" />

        <template #renderKnobs>
            <PageProp item-key="placement" v-bind="CarouselKnobs.PLACEMENT_TEXT">
                <PageSelectField
                    :value="placement"
                    :values="CarouselPlacements.SAMPLE_KEYS"
                    :width="PLACEMENT_FIELD_WIDTH"
                    ariaLabel="Placement"
                    @change="(value: CarouselPlacements.SampleKey) => (placement = value)"
                />
            </PageProp>

            <PageProp item-key="orientation" v-bind="CarouselKnobs.ORIENTATION_2_TEXT">
                <PageSelectField
                    :value="looksOrientation"
                    :values="CAROUSEL_ORIENTATIONS"
                    ariaLabel="Orientation"
                    @change="(value: CarouselOrientation) => (looksOrientation = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.loopingAndSelfMoving" />

    <PageDocsExample :path="`${DOCS_ROOT}/Looping.vue`">
        <LoopingDocsExample :is-looping="isLooping" :autoplay-delay-ms="autoplayDelayMs" />

        <template #renderKnobs>
            <PageProp item-key="isLooping" v-bind="CarouselKnobs.IS_LOOPING_TEXT">
                <PageCheckField
                    :value="isLooping"
                    ariaLabel="Looping"
                    @change="(value: boolean) => (isLooping = value)"
                />
            </PageProp>

            <PageProp item-key="autoplayDelayMs" v-bind="CarouselKnobs.AUTOPLAY_DELAY_MS_TEXT">
                <PageNumberField
                    :value="autoplayDelayMs"
                    :min="CarouselKnobs.MIN_DELAY_MS"
                    :max="CarouselKnobs.MAX_DELAY_MS"
                    :step="CarouselKnobs.DELAY_STEP_MS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Delay in milliseconds"
                    @input="(value: number) => (autoplayDelayMs = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.drivenOutside" />

    <PageDocsExample :path="`${DOCS_ROOT}/Scrolled.vue`">
        <ScrolledDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.severalSlidesStop" />

    <PageDocsExample :path="`${DOCS_ROOT}/Pairs.vue`">
        <PairsDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.onlyNearbySlidesBuilt" />

    <PageDocsExample :path="`${DOCS_ROOT}/Windowed.vue`">
        <WindowedDocsExample />
    </PageDocsExample>
</template>
