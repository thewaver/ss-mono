<script setup lang="ts">
import { shallowRef } from "vue";

import { MenubarKnobs } from "@thewaver/ss-playground/App/Knobs/Menubars.const";
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import OverflowDocsExample from "./Docs/Overflow.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";

const barWidth = shallowRef(MenubarKnobs.STARTING_NARROW_BAR_WIDTH);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="When the words do not fit"
        content="The bar measures itself, and the words that do not fit move into an overflow menu at its end, each becoming a submenu of it that holds that word's own menu. One [prop]checked[/prop], [prop]renderItem[/prop] and [prop]renderPopup[/prop] serve every menu the bar opens, the overflow menu included, so a View option keeps its state wherever View is drawn."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Overflow.vue`">
        <OverflowDocsExample :bar-width="barWidth" />

        <template #renderKnobs>
            <PageProp
                item-key="barWidth"
                label="Bar width (px)"
                hint="How wide the bar is. Narrow it and the words that no longer fit move into the menu at its end; widen it and they come back."
                controls="Sets the width of the box the menubar fills"
            >
                <PageNumberField
                    :value="barWidth"
                    :min="MenubarKnobs.MIN_BAR_WIDTH"
                    :max="MenubarKnobs.MAX_BAR_WIDTH"
                    :step="MenubarKnobs.BAR_WIDTH_STEP"
                    ariaLabel="Bar width in pixels"
                    @input="(value: number) => (barWidth = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Right to left"
        content="Inside a box whose text runs right to left, the words run from the right, and the left arrow moves on to the next word. Each menu hangs from the right edge of its word, and its submenus open to the left, where the left arrow opens them."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>
</template>
