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
import { DOCS_ROOT, FIELD_WIDTH, NO_LIMIT } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";

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

    <PageDocsSection
        title="Where the stack sits and how it grows"
        content="Set [prop]alignment[/prop] to put the stack at one of nine places on the screen, and [prop]flexDirection[/prop] for the way it grows from there: down a column or along a row, with new toasts joining at the far end or, reversed, at the near one, while the stack stays where it was put. The [prop]gap[/prop] spaces the toasts and the [prop]margins[/prop] hold the stack off the edges. Two providers at one alignment draw their stacks over each other, and the second warns in the console; every example on this page has a place of its own, so moving this one onto another's shows it. Piling the toasts on each other is the painter's work: each is handed its place in the stack and the measured size of every toast, and this one offsets and shrinks itself from them."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Placement.vue`">
        <PlacementDocsExample
            :alignment="alignment"
            :flex-direction="flexDirection"
            :gap="gap"
            :margin="margin"
            :stacking="stacking"
        />

        <template #renderKnobs>
            <PageProp
                item-key="alignment"
                label="Alignment"
                hint="Which corner or edge of the screen the toasts gather at."
                controls="Sets ToastsProps.alignment"
            >
                <PageSelectField
                    :value="alignment"
                    :values="TOASTS_ALIGNMENTS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Alignment"
                    @change="(value: ToastsAlignment) => (alignment = value)"
                />
            </PageProp>

            <PageProp
                item-key="flexDirection"
                label="Flex direction"
                hint="Which way the stack grows from there, and so whether a new toast joins at the near end or the far one."
                controls="Sets ToastsProps.flexDirection"
            >
                <PageSelectField
                    :value="flexDirection"
                    :values="TOASTS_FLEX_DIRECTIONS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Flex direction"
                    @change="(value: ToastsFlexDirection) => (flexDirection = value)"
                />
            </PageProp>

            <PageProp
                item-key="gap"
                label="Gap (px)"
                hint="The space between one toast and the next."
                controls="Sets ToastsProps.gap"
            >
                <PageNumberField
                    :value="gap"
                    :min="ToastKnobs.MIN_GAP"
                    :max="ToastKnobs.MAX_GAP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Gap in pixels"
                    @input="(value: number) => (gap = value)"
                />
            </PageProp>

            <PageProp
                item-key="margin"
                label="Margin (px)"
                hint="How far the stack is held off the edges of the screen."
                controls="Sets every side of ToastsProps.margins"
            >
                <PageNumberField
                    :value="margin"
                    :min="ToastKnobs.MIN_MARGIN"
                    :max="ToastKnobs.MAX_MARGIN"
                    :width="FIELD_WIDTH"
                    ariaLabel="Margin in pixels"
                    @input="(value: number) => (margin = value)"
                />
            </PageProp>

            <PageProp
                item-key="stacking"
                label="Stacking"
                hint="Whether the toasts sit in a row of their own, or pile up on each other with only the newest fully shown."
                controls="Picks how the example painter places each toast"
            >
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

    <PageDocsSection
        title="How many show at once"
        content="Give [prop]limit[/prop] a number and only that many toasts are on screen. What happens to the rest is the [prop]overflow[/prop]: under dismiss_oldest the oldest are taken out of the queue so the newest show, and under hold_newest the newest wait in the queue and come on as places free, running no clock while they wait. The readout counts the queue, which this example holds itself through [prop]toasts[/prop]."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Limit.vue`">
        <LimitDocsExample :limit="exampleLimit" :overflow="overflow" />

        <template #renderKnobs>
            <PageProp
                item-key="limit"
                label="Limit"
                hint="How many toasts may be on screen at once. Choose none and they all show."
                controls="Sets ToastsProps.limit, with no limit sent as undefined"
            >
                <PageSelectField
                    :value="limit"
                    :values="ToastKnobs.LIMITS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Limit"
                    :compute-label="computeLimitLabel"
                    @change="(value: number) => (limit = value)"
                />
            </PageProp>

            <PageProp
                item-key="overflow"
                label="Overflow"
                hint="What happens once the limit is reached: the oldest toast is dismissed, or the newest waits its turn."
                controls="Sets ToastsProps.overflow"
            >
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

    <PageDocsSection
        title="How long a toast stays"
        content="A toast given a [prop]durationMs[/prop] dismisses itself once that time has passed, and one without waits to be dismissed. Hovering or focusing the stack holds every countdown, and so does switching to another tab; a held toast gets the rest of its time back, not a fresh start. Each toast's [prop]onShow[/prop] and [prop]onHide[/prop] run as it starts to arrive and to leave, which the readout counts."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Duration.vue`">
        <DurationDocsExample :duration-ms="durationMs" />

        <template #renderKnobs>
            <PageProp
                item-key="durationMs"
                label="Duration"
                hint="How long a Timed toast stays before it dismisses itself. Sticky ones wait to be closed."
                controls="Sets Toast.durationMs on each Timed toast raised"
            >
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

    <PageDocsSection
        title="How a toast arrives and leaves"
        content="The painter draws the arrival and the exit. It is handed whether its toast is arriving or leaving and how long [prop]transitionDurationMs[/prop] gives it, and the provider keeps a leaving toast on screen until that time is up, so the exit plays out. This painter zooms, slides or fades."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Animation.vue`">
        <AnimationDocsExample :animation="animation" :transition-duration-ms="transitionDurationMs" />

        <template #renderKnobs>
            <PageProp
                item-key="animation"
                label="Animation"
                hint="How a toast arrives and leaves."
                controls="Picks how the example painter draws the arrival and the exit"
            >
                <PageSelectField
                    :value="animation"
                    :values="ToastKnobs.ANIMATIONS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Animation"
                    @change="(value: ToastAnimation) => (animation = value)"
                />
            </PageProp>

            <PageProp
                item-key="transitionDurationMs"
                label="Transition duration (ms)"
                hint="How long a toast takes to arrive, to leave, and to slide when the stack shifts."
                controls="Sets ToastsProps.transitionDurationMs"
            >
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

    <PageDocsSection
        title="A toast that paints itself"
        content="Every toast that brings no painter is drawn by the provider's [prop]renderToast[/prop], and one that brings its own [prop]renderToast[/prop] is drawn by that instead, so a toast raised anywhere can look and behave unlike its neighbors. The provider's painter is handed a dismiss for the toast it draws, and a toast's own painter closes it with the dismiss it was raised with. Here Save raises an ordinary toast, and Delete draft raises one that slides in and carries an Undo button wired to the code that raised it. A toast's painter is read once, when it arrives."
    />

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

    <PageDocsSection
        title="A queue held outside the page"
        content="Hand the provider a queue of your own as [prop]toasts[/prop], bound both ways, and it is yours: code outside any component can raise a toast by writing to it, as the sync here does, and the page can read it, as the count does. The provider still writes to it, taking out a toast whose time is up, one swiped away, and any past the limit."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/SharedQueue.vue`">
        <SharedQueueDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Right to left"
        content="Each toast reads in the direction of whatever raised it: the element focused when show was called, or the page when nothing was. Publish sits in a right-to-left box, so its toast reads right to left with nothing set in the painter, even though the stack is drawn at the end of the document, outside the box. The [prop]alignment[/prop] names a side of the screen, not of the text, so middle_left stays on the left."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Another shortcut"
        content="The keys that reach the stacks belong to the whole page, so they are set by an InteractionSettings wrapper rather than by a provider. Its [prop]toastHotkeys[/prop] is a pair of shortcuts, forward and back, and the providers under it answer to that pair. Providers that answer to the same pair form a group that the pair cycles through, so this example's stack is reached by F9 and Shift+F9, while F8 still takes you through the other examples. Wrappers nest: an inner one keeps what it does not set and replaces what it does. Setting [prop]toastHotkeys[/prop] to null switches the keys off for the providers under it, and the page then reaches them through ToastUtils.cycleFocus from a control of its own."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Hotkeys.vue`">
        <HotkeysDocsExample />
    </PageDocsExample>
</template>
