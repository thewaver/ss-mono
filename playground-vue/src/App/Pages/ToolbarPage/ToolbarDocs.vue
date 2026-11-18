<script setup lang="ts">
import { shallowRef } from "vue";

import { TOOLBAR_DEFAULTS } from "@thewaver/ss-components-vue";
import { ToolbarKnobs } from "@thewaver/ss-playground/App/Knobs/Toolbars.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import PressedDocsExample from "./Docs/Pressed.vue";
import RefusingDocsExample from "./Docs/Refusing.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import RingDocsExample from "./Docs/Ring.vue";
import TooltipDocsExample from "./Docs/Tooltip.vue";

const barWidth = shallowRef(ToolbarKnobs.STARTING_BAR_WIDTH);
const gap = shallowRef(TOOLBAR_DEFAULTS.gap);
const isTooltipDisabled = shallowRef(false);
const isReachableWhenDisabled = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample
            :bar-width="barWidth"
            :gap="gap"
            :on-bar-width-change="(width: number) => (barWidth = width)"
        />

        <template #renderKnobs>
            <PageProp item-key="barWidth" v-bind="ToolbarKnobs.BAR_WIDTH_TEXT">
                <PageNumberField
                    :value="barWidth"
                    :min="ToolbarKnobs.MIN_BAR_WIDTH"
                    :max="ToolbarKnobs.MAX_BAR_WIDTH"
                    :step="ToolbarKnobs.BAR_WIDTH_STEP"
                    ariaLabel="Bar width in pixels"
                    @input="(value: number) => (barWidth = value)"
                />
            </PageProp>

            <PageProp item-key="gap" v-bind="ToolbarKnobs.GAP_TEXT">
                <PageNumberField
                    :value="gap"
                    :min="ToolbarKnobs.MIN_GAP"
                    :max="ToolbarKnobs.MAX_GAP"
                    :step="ToolbarKnobs.GAP_STEP"
                    ariaLabel="Gap in pixels"
                    @input="(value: number) => (gap = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.actionsThatRefuseCollapse" />

    <PageDocsExample :path="`${DOCS_ROOT}/Refusing.vue`">
        <RefusingDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.actionsThatStayPressed" />

    <PageDocsExample :path="`${DOCS_ROOT}/Pressed.vue`">
        <PressedDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.tooltips" />

    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                v-bind="ToolbarKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT"
            >
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>

            <PageProp item-key="tooltipIsDisabled" v-bind="ToolbarKnobs.TOOLTIP_IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isTooltipDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isTooltipDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.ringTools" />

    <PageDocsExample :path="`${DOCS_ROOT}/Ring.vue`">
        <RingDocsExample />
    </PageDocsExample>
</template>
