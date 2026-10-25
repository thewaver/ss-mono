<script setup lang="ts">
import { shallowRef } from "vue";

import { SCROLLER_DEFAULTS, SCROLLER_OVERFLOWS, ScrollerUtils } from "@thewaver/ss-components-vue";
import type { ScrollerOverflow, ScrollerProgress } from "@thewaver/ss-components-vue";
import { ScrollerKnobs } from "@thewaver/ss-playground/App/Knobs/Scrollers.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import { DOCS_ROOT, PERCENT } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";

import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.vue";
import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import ArchedDocsExample from "./Docs/Arched.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import BothWaysDocsExample from "./Docs/BothWays.vue";
import ColumnDocsExample from "./Docs/Column.vue";
import DrivenDocsExample from "./Docs/Driven.vue";
import FadingDocsExample from "./Docs/Fading.vue";
import FocusableChildrenDocsExample from "./Docs/FocusableChildren.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import ShortTrackDocsExample from "./Docs/ShortTrack.vue";
import TabbedDocsExample from "./Docs/Tabbed.vue";

const itemCount = shallowRef(ScrollerKnobs.STARTING_ITEM_COUNT);
const overlapCount = shallowRef(SCROLLER_DEFAULTS.overlapCount);
const progress = shallowRef<ScrollerProgress>(ScrollerUtils.NO_PROGRESS);
const overflowX = shallowRef<ScrollerOverflow>("auto");
const overflowY = shallowRef<ScrollerOverflow>("auto");
const isAutoHiding = shallowRef(true);
const isBarOverlaid = shallowRef(true);
const hideDelayMs = shallowRef(SCROLLER_DEFAULTS.hideDelayMs);
</script>

<template>
    <PageDocsAlert severity="alert">
        The scroller draws no buttons: build them on the controller
        <span :class="docsStyles.docsPropName">onMount</span> hands you, wherever the page wants them. Without them, a
        keyboard scrolls the strip only by moving focus, which reaches each focusable item, or the box itself when
        nothing in it takes focus, but not plain content lying beyond the last focusable item (<a
            :href="WCAG_URLS['2.1.1']"
            >WCAG 2.1.1</a
        >). Name each button by the way it scrolls, or a screen reader announces a button with no name (<a
            :href="WCAG_URLS['4.1.2']"
            >WCAG 4.1.2</a
        >), and point it at the box with aria-controls, using the id
        <span :class="docsStyles.docsPropName">getBoxId</span> hands back.
    </PageDocsAlert>

    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :item-count="itemCount" :overlap-count="overlapCount" />

        <template #renderKnobs>
            <PageProp
                item-key="itemCount"
                label="Item count"
                hint="How many items sit in the strip. Few enough to fit, and both buttons are disabled, since there is nowhere to go."
                controls="Sets the number of example items sent as Scroller's children"
            >
                <PageNumberField
                    :value="itemCount"
                    :min="ScrollerKnobs.MIN_ITEM_COUNT"
                    :max="ScrollerKnobs.MAX_ITEM_COUNT"
                    :step="ScrollerKnobs.ITEM_COUNT_STEP"
                    ariaLabel="Item count"
                    @input="(value: number) => (itemCount = value)"
                />
            </PageProp>

            <PageProp
                item-key="overlapCount"
                label="Overlap count"
                hint="How many of the items in view stay in view after a press of a step button. At 0 a press moves on by as much as fits; a press always moves by at least one item."
                controls="Sets ScrollerProps.overlapCount"
            >
                <PageNumberField
                    :value="overlapCount"
                    :min="ScrollerKnobs.MIN_OVERLAP_COUNT"
                    :max="ScrollerKnobs.MAX_OVERLAP_COUNT"
                    :step="ScrollerKnobs.OVERLAP_COUNT_STEP"
                    ariaLabel="Overlap count"
                    @input="(value: number) => (overlapCount = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Focus reveals what it lands on"
        content="The scroller never claims the arrow keys, so a tab list inside it walks its tabs with them as it would anywhere. Whatever takes focus, by keyboard or by pointer, is scrolled just far enough to show it whole: a tab already in view leaves the strip where it is, and one cut off by an edge comes into view with room left for its focus ring, which [prop]padding[/prop] sets aside."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Tabbed.vue`">
        <TabbedDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Focusable children of any kind"
        content="The strip holds whatever it is given and draws nothing around it. Here each item is a button, and tabbing through them pulls the strip along. A strip holding nothing focusable becomes a tab stop itself while it overflows, so the keyboard can still scroll it."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/FocusableChildren.vue`">
        <FocusableChildrenDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Driven from outside"
        content='The position is [prop]progress[/prop], how far along each direction the box is scrolled from 0 to 1, and both sides can write it: the scroller reports it as it moves, and a value written to it scrolls the box there. That is what lets page dots, a progress bar or a "3 of 12" line outside the strip follow it and move it. Here the knob reads and writes how far across the strip is.'
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Driven.vue`">
        <DrivenDocsExample v-model:progress="progress" />

        <template #renderKnobs>
            <PageProp
                item-key="position"
                label="Position (%)"
                hint="How far along the strip is scrolled. It follows the strip as it moves, and a value typed here scrolls it there."
                controls="Sets ScrollerProps.progress, shown as a percentage"
            >
                <PageNumberField
                    :value="Math.round(progress.x * PERCENT)"
                    :min="ScrollerKnobs.MIN_POSITION"
                    :max="PERCENT"
                    :step="ScrollerKnobs.POSITION_STEP"
                    ariaLabel="Position in percent"
                    @input="(value: number) => (progress = { ...progress, x: value / PERCENT })"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="A short track between the step buttons"
        content="The browser's own scrollbar is hidden, and wheel, touch and keyboard scrolling stay the browser's. Pass [prop]renderBar[/prop] to draw a bar of your own, a track and a thumb placed and sized however you like, and hand the library both through the refs it gives you. Its thumb then follows the scroll and can be dragged, and a press on the track pages towards the press, carrying on while held; with Alt (Option on a Mac) held, it jumps there instead."
    />

    <PageDocsAlert severity="alert">
        A drawn bar is a target people press and drag, and unlike the browser's own it is not exempt from
        <a :href="WCAG_URLS['2.5.8']">WCAG 2.5.8</a>, which asks for 24 by 24 CSS pixels. The library keeps the thumb at
        least 24 pixels long; how thick the bar is, is your painter's call. A thinner bar passes only with room around
        it, or with step buttons of the full size on the page doing the same job, and nothing warns about it.
    </PageDocsAlert>

    <PageDocsExample :path="`${DOCS_ROOT}/ShortTrack.vue`">
        <ShortTrackDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="An arched bar"
        content="A track that is not a straight line needs [prop]computeProgressAtPoint[/prop], which turns where the pointer is into how far along the bar that is; here it reads the pointer's angle, so the thumb follows it round the curve. Set [prop]barSideX[/prop] to start and the bar sits above the content rather than below it."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Arched.vue`">
        <ArchedDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="A column scrolling down"
        content="Set [prop]overflowX[/prop] to hidden and [prop]overflowY[/prop] to auto, and the box scrolls down instead: the children stack in a column, and a drawn bar keeps a strip of its own on the inline end. The buttons here are built on the controller's [prop]y[/prop] stepper, and the page puts them above and below."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Column.vue`">
        <ColumnDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="A box scrolling both ways"
        content="With both directions scrolling, each has its own stepper on the controller and its own bar, and the corner where the two bars meet is left empty. The page lays out the four buttons, here round the box. Each direction takes the values CSS gives overflow: auto shows the bar only while the content overruns, scroll always shows it, and hidden neither scrolls nor shows it."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/BothWays.vue`">
        <BothWaysDocsExample :overflow-x="overflowX" :overflow-y="overflowY" />

        <template #renderKnobs>
            <PageProp
                item-key="overflowX"
                :label="ScrollerKnobs.OVERFLOW_X.label"
                :hint="ScrollerKnobs.OVERFLOW_X.hint"
                controls="Sets ScrollerProps.overflowX"
            >
                <PageSelectField
                    :value="overflowX"
                    :values="SCROLLER_OVERFLOWS"
                    :ariaLabel="ScrollerKnobs.OVERFLOW_X.label"
                    @change="(value: ScrollerOverflow) => (overflowX = value)"
                />
            </PageProp>

            <PageProp
                item-key="overflowY"
                :label="ScrollerKnobs.OVERFLOW_Y.label"
                :hint="ScrollerKnobs.OVERFLOW_Y.hint"
                controls="Sets ScrollerProps.overflowY"
            >
                <PageSelectField
                    :value="overflowY"
                    :values="SCROLLER_OVERFLOWS"
                    :ariaLabel="ScrollerKnobs.OVERFLOW_Y.label"
                    @change="(value: ScrollerOverflow) => (overflowY = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="A bar over the content that fades"
        content="Set [prop]isBarOverlaid[/prop] and a drawn bar floats over the content's edge instead of keeping a strip beside it. Set [prop]isAutoHiding[/prop] and the painter is told when the box is scrolling and when the pointer moves over it, so the bar can fade [prop]hideDelayMs[/prop] after scrolling stops and come back while the box scrolls or the pointer moves over it; a faded bar keeps its place, so nothing moves when it comes back. The two are independent."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Fading.vue`">
        <FadingDocsExample
            :is-auto-hiding="isAutoHiding"
            :is-bar-overlaid="isBarOverlaid"
            :hide-delay-ms="hideDelayMs"
        />

        <template #renderKnobs>
            <PageProp
                item-key="isAutoHiding"
                :label="ScrollerKnobs.IS_AUTO_HIDING.label"
                :hint="ScrollerKnobs.IS_AUTO_HIDING.hint"
                controls="Sets ScrollerProps.isAutoHiding"
            >
                <PageCheckField
                    :value="isAutoHiding"
                    :ariaLabel="ScrollerKnobs.IS_AUTO_HIDING.label"
                    @change="(value: boolean) => (isAutoHiding = value)"
                />
            </PageProp>

            <PageProp
                item-key="isBarOverlaid"
                :label="ScrollerKnobs.IS_BAR_OVERLAID.label"
                :hint="ScrollerKnobs.IS_BAR_OVERLAID.hint"
                controls="Sets ScrollerProps.isBarOverlaid"
            >
                <PageCheckField
                    :value="isBarOverlaid"
                    :ariaLabel="ScrollerKnobs.IS_BAR_OVERLAID.label"
                    @change="(value: boolean) => (isBarOverlaid = value)"
                />
            </PageProp>

            <PageProp
                item-key="hideDelayMs"
                :label="ScrollerKnobs.HIDE_DELAY_MS.label"
                :hint="ScrollerKnobs.HIDE_DELAY_MS.hint"
                controls="Sets ScrollerProps.hideDelayMs"
            >
                <PageNumberField
                    :value="hideDelayMs"
                    :min="ScrollerKnobs.HIDE_DELAY_MS.min"
                    :max="ScrollerKnobs.HIDE_DELAY_MS.max"
                    :step="ScrollerKnobs.HIDE_DELAY_MS.step"
                    :ariaLabel="ScrollerKnobs.HIDE_DELAY_MS.label"
                    @input="(value: number) => (hideDelayMs = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Right to left"
        content="Inside a box whose text runs right to left, the strip starts from the right and scrolls towards the left: a row of buttons laid out by the page puts the one stepping back on the right, the thumb starts at the right end of its track, and [prop]progress[/prop] still runs from 0 at the start to 1 at the end. The arrows drawn here are turned by the painter, which reads the direction."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>
</template>
