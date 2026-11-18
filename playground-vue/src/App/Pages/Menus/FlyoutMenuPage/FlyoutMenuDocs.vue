<script setup lang="ts">
import { shallowRef } from "vue";

import { FLYOUT_MENU_DEFAULTS } from "@thewaver/ss-components-vue";
import { FlyoutMenuKnobs } from "@thewaver/ss-playground/App/Knobs/FlyoutMenus.const";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/Menus/FlyoutMenuPage/FlyoutMenuPage.const";

import PageDocsExample from "../../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../../PageComponents/DocsSection/PageDocsSection.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import NarrowDocsExample from "./Docs/Narrow.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";

const hoverShowDelayMs = shallowRef(FLYOUT_MENU_DEFAULTS.hoverShowDelayMs);
const transitionDurationMs = shallowRef(FLYOUT_MENU_DEFAULTS.transitionDurationMs);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :hover-show-delay-ms="hoverShowDelayMs" :transition-duration-ms="transitionDurationMs" />

        <template #renderKnobs>
            <PageProp item-key="hoverShowDelayMs" v-bind="FlyoutMenuKnobs.HOVER_SHOW_DELAY_MS_TEXT">
                <PageNumberField
                    :value="hoverShowDelayMs"
                    :min="FlyoutMenuKnobs.MIN_DELAY_MS"
                    :max="FlyoutMenuKnobs.MAX_DELAY_MS"
                    :step="FlyoutMenuKnobs.DELAY_STEP_MS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Hover delay in milliseconds"
                    @input="(value: number) => (hoverShowDelayMs = value)"
                />
            </PageProp>

            <PageProp item-key="transitionDurationMs" v-bind="FlyoutMenuKnobs.TRANSITION_DURATION_MS_TEXT">
                <PageNumberField
                    :value="transitionDurationMs"
                    :min="FlyoutMenuKnobs.MIN_TRANSITION_MS"
                    :max="FlyoutMenuKnobs.MAX_TRANSITION_MS"
                    :step="FlyoutMenuKnobs.TRANSITION_STEP_MS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Transition duration in milliseconds"
                    @input="(value: number) => (transitionDurationMs = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.tooNarrowEveryEntry" />

    <PageDocsExample :path="`${DOCS_ROOT}/Narrow.vue`">
        <NarrowDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>
</template>
