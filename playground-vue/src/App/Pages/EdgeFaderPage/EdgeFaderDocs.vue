<script setup lang="ts">
import { shallowRef } from "vue";

import { EDGE_FADER_DEFAULTS } from "@thewaver/ss-components-vue";
import type { EdgeFaderEdge } from "@thewaver/ss-components-vue";
import { EdgeFaderKnobs } from "@thewaver/ss-playground/App/Knobs/EdgeFaders.const";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
    EDGE_LABELS,
} from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import ScrollAwareDocsExample from "./Docs/ScrollAware.vue";
import SidesDocsExample from "./Docs/Sides.vue";
import UnscrolledDocsExample from "./Docs/Unscrolled.vue";

const size = shallowRef(EDGE_FADER_DEFAULTS.size);
const edges = shallowRef<EdgeFaderEdge[]>(EDGE_FADER_DEFAULTS.edges);
const isScrollAware = shallowRef(true);

const setHasEdge = (edge: EdgeFaderEdge, hasEdge: boolean) => {
    const current = edges.value;

    edges.value = EDGE_FADER_DEFAULTS.edges.filter((candidate) =>
        candidate === edge ? hasEdge : current.includes(candidate),
    );
};
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :size="size" />

        <template #renderKnobs>
            <PageProp item-key="size" v-bind="EdgeFaderKnobs.SIZE_TEXT">
                <PageNumberField
                    :value="size"
                    :min="EdgeFaderKnobs.MIN_SIZE"
                    :max="EdgeFaderKnobs.MAX_SIZE"
                    :step="EdgeFaderKnobs.SIZE_STEP"
                    ariaLabel="Fade size in pixels"
                    @input="(value: number) => (size = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.anyMixSides" />

    <PageDocsExample :path="`${DOCS_ROOT}/Sides.vue`">
        <SidesDocsExample :edges="edges" />

        <template #renderKnobs>
            <PageProp
                v-for="edge in EDGE_FADER_DEFAULTS.edges"
                :key="edge"
                :item-key="edge"
                :label="EDGE_LABELS[edge]"
                :hint="`Whether the ${edge} side fades.`"
                controls="Sets EdgeFaderProps.edges"
            >
                <PageCheckField
                    :value="edges.includes(edge)"
                    :ariaLabel="EDGE_LABELS[edge]"
                    @change="(hasEdge: boolean) => setHasEdge(edge, hasEdge)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.fadingOnlyOutOfView" />

    <PageDocsExample :path="`${DOCS_ROOT}/ScrollAware.vue`">
        <ScrollAwareDocsExample :is-scroll-aware="isScrollAware" />

        <template #renderKnobs>
            <PageProp item-key="isScrollAware" v-bind="EdgeFaderKnobs.IS_SCROLL_AWARE_TEXT">
                <PageCheckField
                    :value="isScrollAware"
                    ariaLabel="Scroll-aware"
                    @change="(value: boolean) => (isScrollAware = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.aroundNonScrolling" />

    <PageDocsExample :path="`${DOCS_ROOT}/Unscrolled.vue`">
        <UnscrolledDocsExample />
    </PageDocsExample>
</template>
