<script setup lang="ts">
import { computed, shallowRef } from "vue";

import type { ToastsAlignment, ToastsFlexDirection, ToastsOverflow } from "@thewaver/ss-components-vue";
import {
    TOASTS_ALIGNMENTS,
    TOASTS_DEFAULTS,
    TOASTS_FLEX_DIRECTIONS,
    TOASTS_OVERFLOWS,
} from "@thewaver/ss-components-vue";
import { ToastKnobs } from "@thewaver/ss-playground/App/Knobs/Toasts.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
    FIELD_WIDTH,
    NO_LIMIT,
} from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";

import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.vue";
import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import type { ToastAnimation, ToastStacking } from "../../StyledComponents/ToastContent/ToastContentVue.types";
import AnimationDocsExample from "./Docs/Animation.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import DurationDocsExample from "./Docs/Duration.vue";
import FarDownDocsExample from "./Docs/FarDown.vue";
import HotkeysDocsExample from "./Docs/Hotkeys.vue";
import LimitDocsExample from "./Docs/Limit.vue";
import OwnPainterDocsExample from "./Docs/OwnPainter.vue";
import PlacementDocsExample from "./Docs/Placement.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import SharedQueueDocsExample from "./Docs/SharedQueue.vue";

const alignment = shallowRef<ToastsAlignment>(ToastKnobs.STARTING_PLACEMENT_ALIGNMENT);
const flexDirection = shallowRef<ToastsFlexDirection>(TOASTS_DEFAULTS.flexDirection);
const gap = shallowRef(TOASTS_DEFAULTS.gap);
const margin = shallowRef(ToastKnobs.STARTING_MARGIN);
const stacking = shallowRef<ToastStacking>(ToastKnobs.STARTING_STACKING);
const limit = shallowRef(ToastKnobs.STARTING_LIMIT);
const overflow = shallowRef<ToastsOverflow>(TOASTS_DEFAULTS.overflow);
const durationMs = shallowRef(ToastKnobs.STARTING_DURATION_MS);
const animation = shallowRef<ToastAnimation>(ToastKnobs.STARTING_ANIMATION);
const transitionDurationMs = shallowRef(TOASTS_DEFAULTS.transitionDurationMs);

const exampleLimit = computed(() => (limit.value === NO_LIMIT ? undefined : limit.value));

const computeLimitLabel = (value: number) => (value === NO_LIMIT ? "none" : `${value}`);

const computeDurationLabel = (value: number) => `${value}ms`;
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample />
    </PageDocsExample>

    <PageDocsAlert severity="alert">
        A toast can be swiped off the edge its stack sits against. Paint a control that closes it, as Close does here,
        in every toast that can be swiped, or a reader who cannot drag has no way to dismiss it (<a
            :href="WCAG_URLS['2.5.7']"
            >WCAG 2.5.7</a
        >). The library draws no control of its own.
    </PageDocsAlert>

    <PageDocsAlert severity="alert">
        Nothing can tab to a stack, since it is drawn at the end of the document, so F8 is the keyboard's way in: it
        moves focus to each stack holding toasts in turn, Shift+F8 goes back, and Escape hands focus back to where it
        was. One shortcut reaches every stack on the page, so a keyboard user can always get to a toast's controls (<a
            :href="WCAG_URLS['2.1.1']"
            >WCAG 2.1.1</a
        >). Raise toasts in two of the examples below and press F8 twice to try it. A page that needs F8 for itself can
        change the keys or switch them off, as the last example shows.
    </PageDocsAlert>

    <PageDocsSection v-bind="DOCS_SECTIONS.whereStackSitsHow" />

    <PageDocsExample :path="`${DOCS_ROOT}/Placement.vue`">
        <PlacementDocsExample
            :alignment="alignment"
            :flex-direction="flexDirection"
            :gap="gap"
            :margin="margin"
            :stacking="stacking"
        />

        <template #renderKnobs>
            <PageProp item-key="alignment" v-bind="ToastKnobs.ALIGNMENT_TEXT">
                <PageSelectField
                    :value="alignment"
                    :values="TOASTS_ALIGNMENTS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Alignment"
                    @change="(value: ToastsAlignment) => (alignment = value)"
                />
            </PageProp>

            <PageProp item-key="flexDirection" v-bind="ToastKnobs.FLEX_DIRECTION_TEXT">
                <PageSelectField
                    :value="flexDirection"
                    :values="TOASTS_FLEX_DIRECTIONS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Flex direction"
                    @change="(value: ToastsFlexDirection) => (flexDirection = value)"
                />
            </PageProp>

            <PageProp item-key="gap" v-bind="ToastKnobs.GAP_TEXT">
                <PageNumberField
                    :value="gap"
                    :min="ToastKnobs.MIN_GAP"
                    :max="ToastKnobs.MAX_GAP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Gap in pixels"
                    @input="(value: number) => (gap = value)"
                />
            </PageProp>

            <PageProp item-key="margin" v-bind="ToastKnobs.MARGIN_TEXT">
                <PageNumberField
                    :value="margin"
                    :min="ToastKnobs.MIN_MARGIN"
                    :max="ToastKnobs.MAX_MARGIN"
                    :width="FIELD_WIDTH"
                    ariaLabel="Margin in pixels"
                    @input="(value: number) => (margin = value)"
                />
            </PageProp>

            <PageProp item-key="stacking" v-bind="ToastKnobs.STACKING_TEXT">
                <PageSelectField
                    :value="stacking"
                    :values="ToastKnobs.STACKINGS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Stacking"
                    @change="(value: ToastStacking) => (stacking = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.howManyShowOnce" />

    <PageDocsExample :path="`${DOCS_ROOT}/Limit.vue`">
        <LimitDocsExample :limit="exampleLimit" :overflow="overflow" />

        <template #renderKnobs>
            <PageProp item-key="limit" v-bind="ToastKnobs.LIMIT_TEXT">
                <PageSelectField
                    :value="limit"
                    :values="ToastKnobs.LIMITS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Limit"
                    :compute-label="computeLimitLabel"
                    @change="(value: number) => (limit = value)"
                />
            </PageProp>

            <PageProp item-key="overflow" v-bind="ToastKnobs.OVERFLOW_TEXT">
                <PageSelectField
                    :value="overflow"
                    :values="TOASTS_OVERFLOWS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Overflow"
                    @change="(value: ToastsOverflow) => (overflow = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.howLongToastStays" />

    <PageDocsExample :path="`${DOCS_ROOT}/Duration.vue`">
        <DurationDocsExample :duration-ms="durationMs" />

        <template #renderKnobs>
            <PageProp item-key="durationMs" v-bind="ToastKnobs.DURATION_MS_TEXT">
                <PageSelectField
                    :value="durationMs"
                    :values="ToastKnobs.TIMED_DURATIONS_MS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Duration"
                    :compute-label="computeDurationLabel"
                    @change="(value: number) => (durationMs = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.howToastArrivesLeaves" />

    <PageDocsExample :path="`${DOCS_ROOT}/Animation.vue`">
        <AnimationDocsExample :animation="animation" :transition-duration-ms="transitionDurationMs" />

        <template #renderKnobs>
            <PageProp item-key="animation" v-bind="ToastKnobs.ANIMATION_TEXT">
                <PageSelectField
                    :value="animation"
                    :values="ToastKnobs.ANIMATIONS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Animation"
                    @change="(value: ToastAnimation) => (animation = value)"
                />
            </PageProp>

            <PageProp item-key="transitionDurationMs" v-bind="ToastKnobs.TRANSITION_DURATION_MS_TEXT">
                <PageNumberField
                    :value="transitionDurationMs"
                    :min="ToastKnobs.MIN_TRANSITION_DURATION_MS"
                    :max="ToastKnobs.MAX_TRANSITION_DURATION_MS"
                    :step="ToastKnobs.TRANSITION_DURATION_STEP_MS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Transition duration in milliseconds"
                    @input="(value: number) => (transitionDurationMs = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.toastThatPaintsItself" />

    <PageDocsExample :path="`${DOCS_ROOT}/OwnPainter.vue`">
        <OwnPainterDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Raising from far down the tree"
        content="Any component inside the provider, however deep, gets show and dismiss from useToastsContext, with nothing passed down on the way, and where providers are nested the nearest one answers. Both say whether they acted. show answers the toast's id, made up unless you gave one, which dismiss takes to close it from anywhere; it answers undefined when it refused — a toast whose id is already queued, or any toast outside a provider, which Save outside shows. dismiss answers true or false."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/FarDown.vue`">
        <FarDownDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.queueHeldOutsidePage" />

    <PageDocsExample :path="`${DOCS_ROOT}/SharedQueue.vue`">
        <SharedQueueDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.anotherShortcut" />

    <PageDocsExample :path="`${DOCS_ROOT}/Hotkeys.vue`">
        <HotkeysDocsExample />
    </PageDocsExample>
</template>
