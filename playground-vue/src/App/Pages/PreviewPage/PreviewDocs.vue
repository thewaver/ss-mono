<script setup lang="ts">
import { shallowRef } from "vue";

import { PreviewKnobs } from "@thewaver/ss-playground/App/Knobs/Previews.const";
import { COLLAPSED_HEIGHT, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import ControlledDocsExample from "./Docs/Controlled.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import ScrolledDocsExample from "./Docs/Scrolled.vue";
import ShortDocsExample from "./Docs/Short.vue";

const collapsedHeight = shallowRef(COLLAPSED_HEIGHT);
const isScrolledIntoViewOnCollapse = shallowRef(true);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :collapsed-height="collapsedHeight" />

        <template #renderKnobs>
            <PageProp
                item-key="collapsedHeight"
                label="Collapsed height (px)"
                hint="How much of the content shows while the preview is closed."
                controls="Sets PreviewProps.collapsedHeight"
            >
                <PageNumberField
                    :value="collapsedHeight"
                    :min="PreviewKnobs.MIN_COLLAPSED_HEIGHT"
                    :max="PreviewKnobs.MAX_COLLAPSED_HEIGHT"
                    :step="PreviewKnobs.COLLAPSED_HEIGHT_STEP"
                    ariaLabel="Collapsed height in pixels"
                    @input="(value: number) => (collapsedHeight = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Right to left"
        content="Inside a box whose text runs right to left, the content and the button that opens it sit against the right edge."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="When everything fits"
        content="Content no taller than [prop]collapsedHeight[/prop] is shown whole, with no button and no fade, since there is nothing behind them."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Short.vue`">
        <ShortDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Opening and closing from outside"
        content="The preview keeps track of whether it is open by itself. To open or close it from elsewhere on the page, hold the boolean and pass it in as [prop]expanded[/prop]: both sides write it, so pressing Read more updates yours and writing yours opens or closes the preview."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Controlled.vue`">
        <ControlledDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Inside a box that scrolls"
        content="Closing a long preview takes its height out from under the reader, and everything below it jumps up, the button with it. Set [prop]isScrolledIntoViewOnCollapse[/prop] and closing scrolls the preview back into view, so the reader is left where they started."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Scrolled.vue`">
        <ScrolledDocsExample :is-scrolled-into-view-on-collapse="isScrolledIntoViewOnCollapse" />

        <template #renderKnobs>
            <PageProp
                item-key="isScrolledIntoViewOnCollapse"
                label="Scroll into view on collapse"
                hint="Whether closing the preview scrolls it back into view."
                controls="Sets PreviewProps.isScrolledIntoViewOnCollapse"
            >
                <PageCheckField
                    :value="isScrolledIntoViewOnCollapse"
                    ariaLabel="Scroll into view on collapse"
                    @change="(value: boolean) => (isScrolledIntoViewOnCollapse = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
