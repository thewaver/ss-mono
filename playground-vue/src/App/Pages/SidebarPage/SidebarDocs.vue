<script setup lang="ts">
import { shallowRef } from "vue";

import { SIDEBAR_DEFAULTS, SIDEBAR_EDGES, SIDEBAR_LAYOUTS } from "@thewaver/ss-components-vue";
import type { SidebarEdge, SidebarLayout } from "@thewaver/ss-components-vue";
import { SidebarKnobs } from "@thewaver/ss-playground/App/Knobs/Sidebars.const";
import { DOCS_ROOT, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/SidebarPage/SidebarPage.const";

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
            <PageProp
                item-key="edge"
                label="Edge"
                hint="Which side of its neighbor the sidebar is docked to, and so which way it grows. Docked to the top or bottom, it spans the width and grows in height."
                controls="Sets SidebarProps.edge"
            >
                <PageSelectField
                    :value="edge"
                    :values="SIDEBAR_EDGES"
                    ariaLabel="Edge"
                    @change="(value: SidebarEdge) => (edge = value)"
                />
            </PageProp>

            <PageProp
                item-key="transitionDurationMs"
                label="Transition duration (ms)"
                hint="How long the sidebar takes to grow and shrink. At 0 it changes size at once."
                controls="Sets SidebarProps.transitionDurationMs"
            >
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

    <PageDocsSection
        title="Right to left"
        content="Inside a box whose text runs right to left, the sidebar stays on the side [prop]edge[/prop] names, the left here, since its edges are the screen's sides; its contents and the content beside it run from the right."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Over its neighbor"
        content="Set [prop]layout[/prop] to overlay and the sidebar grows over the content beside it instead of pushing it aside. In the layout it only ever takes its collapsed size, so the neighbor never moves; the panel grows out from the docked edge, raised above what it covers."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Overlay.vue`">
        <OverlayDocsExample :layout="layout" />

        <template #renderKnobs>
            <PageProp
                item-key="layout"
                label="Layout"
                hint="Whether growing pushes the content beside the sidebar aside or grows over it."
                controls="Sets SidebarProps.layout"
            >
                <PageSelectField
                    :value="layout"
                    :values="SIDEBAR_LAYOUTS"
                    ariaLabel="Layout"
                    @change="(value: SidebarLayout) => (layout = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Expanding on hover"
        content='With [prop]isExpandedOnHover[/prop] on, resting the pointer on the sidebar for [prop]hoverShowDelayMs[/prop] expands it, and moving away, pressing Escape or pressing elsewhere collapses it again ([wcag id="1.4.13"]WCAG 1.4.13[/wcag]). It never writes [prop]expanded[/prop], so the button still reads collapsed while the sidebar is only being looked at, and a sidebar expanded by the button stays expanded when the pointer leaves.'
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Hover.vue`">
        <HoverDocsExample :is-expanded-on-hover="isExpandedOnHover" :hover-show-delay-ms="hoverShowDelayMs" />

        <template #renderKnobs>
            <PageProp
                item-key="isExpandedOnHover"
                label="Expands on hover"
                hint="Whether resting the pointer on the sidebar expands it, without changing its expanded state."
                controls="Sets SidebarProps.isExpandedOnHover"
            >
                <PageCheckField
                    :value="isExpandedOnHover"
                    ariaLabel="Expands on hover"
                    @change="(value: boolean) => (isExpandedOnHover = value)"
                />
            </PageProp>

            <PageProp
                item-key="hoverShowDelayMs"
                label="Hover delay (ms)"
                hint="How long the pointer has to rest on the sidebar before it expands."
                controls="Sets SidebarProps.hoverShowDelayMs"
            >
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
