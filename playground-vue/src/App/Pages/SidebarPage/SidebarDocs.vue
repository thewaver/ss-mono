<script setup lang="ts">
import { shallowRef } from "vue";

import { SIDEBAR_DEFAULTS, SIDEBAR_EDGES, SIDEBAR_LAYOUTS } from "@thewaver/ss-components-vue";
import type { SidebarEdge, SidebarLayout } from "@thewaver/ss-components-vue";
import { SidebarKnobs } from "@thewaver/ss-playground/App/Knobs/Sidebars.const";
import { DOCS_ROOT, DOCS_SECTIONS, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/SidebarPage/SidebarPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import HoverDocsExample from "./Docs/Hover.vue";
import OverlayDocsExample from "./Docs/Overlay.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";

const edge = shallowRef<SidebarEdge>(SIDEBAR_DEFAULTS.edge);
const transitionDurationMs = shallowRef(SIDEBAR_DEFAULTS.transitionDurationMs);
const layout = shallowRef<SidebarLayout>("overlay");
const isExpandedOnHover = shallowRef(true);
const hoverShowDelayMs = shallowRef(SIDEBAR_DEFAULTS.hoverShowDelayMs);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :edge="edge" :transition-duration-ms="transitionDurationMs" />

        <template #renderKnobs>
            <PageProp item-key="edge" v-bind="SidebarKnobs.EDGE_TEXT">
                <PageSelectField
                    :value="edge"
                    :values="SIDEBAR_EDGES"
                    ariaLabel="Edge"
                    @change="(value: SidebarEdge) => (edge = value)"
                />
            </PageProp>

            <PageProp item-key="transitionDurationMs" v-bind="SidebarKnobs.TRANSITION_DURATION_MS_TEXT">
                <PageNumberField
                    :value="transitionDurationMs"
                    :min="SidebarKnobs.MIN_TRANSITION_MS"
                    :max="SidebarKnobs.MAX_TRANSITION_MS"
                    :step="SidebarKnobs.TRANSITION_STEP_MS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Transition duration in milliseconds"
                    @input="(value: number) => (transitionDurationMs = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.overNeighbor" />

    <PageDocsExample :path="`${DOCS_ROOT}/Overlay.vue`">
        <OverlayDocsExample :layout="layout" />

        <template #renderKnobs>
            <PageProp item-key="layout" v-bind="SidebarKnobs.LAYOUT_TEXT">
                <PageSelectField
                    :value="layout"
                    :values="SIDEBAR_LAYOUTS"
                    ariaLabel="Layout"
                    @change="(value: SidebarLayout) => (layout = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.expandingHover" />

    <PageDocsExample :path="`${DOCS_ROOT}/Hover.vue`">
        <HoverDocsExample :is-expanded-on-hover="isExpandedOnHover" :hover-show-delay-ms="hoverShowDelayMs" />

        <template #renderKnobs>
            <PageProp item-key="isExpandedOnHover" v-bind="SidebarKnobs.IS_EXPANDED_ON_HOVER_TEXT">
                <PageCheckField
                    :value="isExpandedOnHover"
                    ariaLabel="Expands on hover"
                    @change="(value: boolean) => (isExpandedOnHover = value)"
                />
            </PageProp>

            <PageProp item-key="hoverShowDelayMs" v-bind="SidebarKnobs.HOVER_SHOW_DELAY_MS_TEXT">
                <PageNumberField
                    :value="hoverShowDelayMs"
                    :min="SidebarKnobs.MIN_DELAY_MS"
                    :max="SidebarKnobs.MAX_DELAY_MS"
                    :step="SidebarKnobs.DELAY_STEP_MS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Hover delay in milliseconds"
                    @input="(value: number) => (hoverShowDelayMs = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
