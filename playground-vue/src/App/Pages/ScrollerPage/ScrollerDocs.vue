<script setup lang="ts">
import { shallowRef } from "vue";

import { SCROLLER_DEFAULTS, SCROLLER_OVERFLOWS, ScrollerUtils } from "@thewaver/ss-components-vue";
import type { ScrollerOverflow, ScrollerProgress } from "@thewaver/ss-components-vue";
import { ScrollerKnobs } from "@thewaver/ss-playground/App/Knobs/Scrollers.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import { DOCS_ROOT, DOCS_SECTIONS, PERCENT } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";

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
            <PageProp item-key="itemCount" v-bind="ScrollerKnobs.ITEM_COUNT_TEXT">
                <PageNumberField
                    :value="itemCount"
                    :min="ScrollerKnobs.MIN_ITEM_COUNT"
                    :max="ScrollerKnobs.MAX_ITEM_COUNT"
                    :step="ScrollerKnobs.ITEM_COUNT_STEP"
                    ariaLabel="Item count"
                    @input="(value: number) => (itemCount = value)"
                />
            </PageProp>

            <PageProp item-key="overlapCount" v-bind="ScrollerKnobs.OVERLAP_COUNT_TEXT">
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

    <PageDocsSection v-bind="DOCS_SECTIONS.focusRevealsTarget" />

    <PageDocsExample :path="`${DOCS_ROOT}/Tabbed.vue`">
        <TabbedDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.focusableChildrenAnyKind" />

    <PageDocsExample :path="`${DOCS_ROOT}/FocusableChildren.vue`">
        <FocusableChildrenDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.drivenOutside" />

    <PageDocsExample :path="`${DOCS_ROOT}/Driven.vue`">
        <DrivenDocsExample v-model:progress="progress" />

        <template #renderKnobs>
            <PageProp item-key="position" v-bind="ScrollerKnobs.POSITION_TEXT">
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

    <PageDocsSection v-bind="DOCS_SECTIONS.shortTrackBetweenButtons" />

    <PageDocsAlert severity="alert">
        A drawn bar is a target people press and drag, and unlike the browser's own it is not exempt from
        <a :href="WCAG_URLS['2.5.8']">WCAG 2.5.8</a>, which asks for 24 by 24 CSS pixels. The library keeps the thumb at
        least 24 pixels long; how thick the bar is, is your painter's call. A thinner bar passes only with room around
        it, or with step buttons of the full size on the page doing the same job, and nothing warns about it.
    </PageDocsAlert>

    <PageDocsExample :path="`${DOCS_ROOT}/ShortTrack.vue`">
        <ShortTrackDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.archedBar" />

    <PageDocsExample :path="`${DOCS_ROOT}/Arched.vue`">
        <ArchedDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.columnScrollingDown" />

    <PageDocsExample :path="`${DOCS_ROOT}/Column.vue`">
        <ColumnDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.boxScrollingBothWays" />

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

    <PageDocsSection v-bind="DOCS_SECTIONS.barThatFades" />

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

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>
</template>
