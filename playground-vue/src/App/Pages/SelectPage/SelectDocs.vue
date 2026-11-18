<script setup lang="ts">
import { shallowRef, watch } from "vue";

import { FrameRateMonitorVueUtils } from "@thewaver/ss-components-vue";
import { SelectKnobs } from "@thewaver/ss-playground/App/Knobs/Selects.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
    STRESS_COUNT_FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/SelectPage/SelectPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import AutocompleteDocsExample from "./Docs/Autocomplete.vue";
import AutocompleteOnDemandDocsExample from "./Docs/AutocompleteOnDemand.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import ClearableDocsExample from "./Docs/Clearable.vue";
import DescribedDocsExample from "./Docs/Described.vue";
import DisabledOptionsDocsExample from "./Docs/DisabledOptions.vue";
import GroupsDocsExample from "./Docs/Groups.vue";
import LabeledDocsExample from "./Docs/Labeled.vue";
import OnDemandDocsExample from "./Docs/OnDemand.vue";
import RecordsDocsExample from "./Docs/Records.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import TooltipDocsExample from "./Docs/Tooltip.vue";
import VirtualizedDocsExample from "./Docs/Virtualized.vue";

const hasError = shallowRef(false);
const isDisabled = shallowRef(false);
const hasGroupBoxes = shallowRef(true);
const isReachable = shallowRef(false);
const count = shallowRef(SelectKnobs.STARTING_STRESS_COUNT);
const isReachableWhenDisabled = shallowRef(false);
const isTooltipDisabled = shallowRef(false);

const isVirtualizedOpen = shallowRef(false);
const openMs = shallowRef<number>();

const frameRate = FrameRateMonitorVueUtils.useFrameRate(() => !isVirtualizedOpen.value);

watch(isVirtualizedOpen, (isOpen) => {
    if (!isOpen) return;

    const startedAt = performance.now();

    requestAnimationFrame(() => requestAnimationFrame(() => (openMs.value = performance.now() - startedAt)));
});

const getMeasurement = () => {
    const opened = openMs.value === undefined ? "Not opened yet" : `Opened in ${Math.round(openMs.value)} ms`;

    return isVirtualizedOpen.value ? `${opened}, ${frameRate.value.current.toFixed(0)} fps while open` : opened;
};

const setCount = (next: number) => {
    count.value = next;
    openMs.value = undefined;
};
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :has-error="hasError" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp item-key="hasError" v-bind="SelectKnobs.HAS_ERROR_TEXT">
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="SelectKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.clearingPick" />
    <PageDocsExample :path="`${DOCS_ROOT}/Clearable.vue`">
        <ClearableDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.recordsValues" />
    <PageDocsExample :path="`${DOCS_ROOT}/Records.vue`">
        <RecordsDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.moreThanName" />
    <PageDocsExample :path="`${DOCS_ROOT}/Described.vue`">
        <DescribedDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.groups" />
    <PageDocsExample :path="`${DOCS_ROOT}/Groups.vue`">
        <GroupsDocsExample :has-group-boxes="hasGroupBoxes" />

        <template #renderKnobs>
            <PageProp item-key="hasGroupBoxes" v-bind="SelectKnobs.HAS_GROUP_BOXES_TEXT">
                <PageCheckField
                    :value="hasGroupBoxes"
                    ariaLabel="Group boxes"
                    @change="(value: boolean) => (hasGroupBoxes = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.disabledOptions" />
    <PageDocsExample :path="`${DOCS_ROOT}/DisabledOptions.vue`">
        <DisabledOptionsDocsExample :is-reachable="isReachable" />

        <template #renderKnobs>
            <PageProp item-key="isReachable" v-bind="SelectKnobs.IS_REACHABLE_TEXT">
                <PageCheckField
                    :value="isReachable"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachable = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.manyOptions" />
    <PageDocsExample :path="`${DOCS_ROOT}/Virtualized.vue`">
        <VirtualizedDocsExample v-model:visibility="isVirtualizedOpen" :count="count" />

        <div :class="exampleStyles.exampleReadout" data-readout>{{ getMeasurement() }}</div>

        <template #renderKnobs>
            <PageProp item-key="count" v-bind="SelectKnobs.COUNT_TEXT">
                <PageNumberField
                    :value="count"
                    :min="SelectKnobs.MIN_STRESS_COUNT"
                    :max="SelectKnobs.MAX_STRESS_COUNT"
                    :step="SelectKnobs.STRESS_COUNT_STEP"
                    :width="STRESS_COUNT_FIELD_WIDTH"
                    ariaLabel="Option count"
                    @input="setCount"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.loadedDemand" />
    <PageDocsExample :path="`${DOCS_ROOT}/OnDemand.vue`">
        <OnDemandDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.autocomplete" />
    <PageDocsExample :path="`${DOCS_ROOT}/Autocomplete.vue`">
        <AutocompleteDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.autocompleteLoadedDemand" />
    <PageDocsExample :path="`${DOCS_ROOT}/AutocompleteOnDemand.vue`">
        <AutocompleteOnDemandDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.tooltip" />
    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                v-bind="SelectKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT"
            >
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>

            <PageProp item-key="tooltipIsDisabled" v-bind="SelectKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isTooltipDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isTooltipDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.namedLabel" />
    <PageDocsExample :path="`${DOCS_ROOT}/Labeled.vue`">
        <LabeledDocsExample />
    </PageDocsExample>
</template>
