<script setup lang="ts">
import { shallowRef, watch } from "vue";

import { FrameRateMonitorVueUtils } from "@thewaver/ss-components-vue";
import { SelectKnobs } from "@thewaver/ss-playground/App/Knobs/Selects.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { DOCS_ROOT, STRESS_COUNT_FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectPage.const";

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
            <PageProp
                item-key="hasError"
                label="Error"
                hint="Marks the field invalid, for screen readers as well as for the painter."
                controls="Sets SelectProps.hasError"
            >
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns the field off: it does not open, and the Tab key skips it."
                controls="Sets SelectProps.isDisabled"
            >
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Right to left"
        content="Inside a box whose text runs right to left, the pick starts from the right of the field, and the arrow and the clear button sit at its left end."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Clearing the pick"
        content="Give it [prop]renderClear[/prop] and a clear button sits at the end of the field, drawn only while something is picked and reached with the Tab key after the field. It needs [prop]clearAriaLabel[/prop] to name it, and pressing it empties the value and reports the change like any other pick."
    />
    <PageDocsExample :path="`${DOCS_ROOT}/Clearable.vue`">
        <ClearableDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Records as values"
        content="An option's value can be any record, not only a string. Here each airport is an object, and the field and the options draw whichever of its parts you choose."
    />
    <PageDocsExample :path="`${DOCS_ROOT}/Records.vue`">
        <RecordsDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="More than a name"
        content="An option draws whatever its painter gives it, here a name with a line of detail beneath it, and is still one option to the arrow keys and to typing."
    />
    <PageDocsExample :path="`${DOCS_ROOT}/Described.vue`">
        <DescribedDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Groups"
        content="Options can sit in groups under headings: a screen reader announces the group, and the arrow keys walk past the headings. A box drawn around each group is optional, through [prop]renderGroupBox[/prop]."
    />
    <PageDocsExample :path="`${DOCS_ROOT}/Groups.vue`">
        <GroupsDocsExample :has-group-boxes="hasGroupBoxes" />

        <template #renderKnobs>
            <PageProp
                item-key="hasGroupBoxes"
                label="Group boxes"
                hint="Draws a box around each group's heading and options."
                controls="Passes SelectProps.renderGroupBox, or leaves it out"
            >
                <PageCheckField
                    :value="hasGroupBoxes"
                    ariaLabel="Group boxes"
                    @change="(value: boolean) => (hasGroupBoxes = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Disabled options"
        content="An option can be disabled: the arrow keys and typing skip it, and it cannot be picked. Kept reachable when disabled, the arrow keys stop on it instead, so a tooltip can say why it is off."
    />
    <PageDocsExample :path="`${DOCS_ROOT}/DisabledOptions.vue`">
        <DisabledOptionsDocsExample :is-reachable="isReachable" />

        <template #renderKnobs>
            <PageProp
                item-key="isReachable"
                label="Reachable when disabled"
                hint="Lets the arrow keys stop on the disabled options, which then show a tooltip."
                controls="Sets SelectOption.isReachableWhenDisabled on the disabled options"
            >
                <PageCheckField
                    :value="isReachable"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachable = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Many options"
        content="Give it an estimated option height and only the options in view are built, so a list of a hundred thousand opens about as fast as one of fifty. The line under the field shows how long the list took to open and how smoothly it runs while open."
    />
    <PageDocsExample :path="`${DOCS_ROOT}/Virtualized.vue`">
        <VirtualizedDocsExample v-model:visibility="isVirtualizedOpen" :count="count" />

        <div :class="exampleStyles.exampleReadout" data-readout>{{ getMeasurement() }}</div>

        <template #renderKnobs>
            <PageProp
                item-key="count"
                label="Option count"
                hint="How many options the list holds. Only the ones in view are built."
                controls="Sets the number of example options sent to SelectProps.options"
            >
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

    <PageDocsSection
        title="Loaded on demand"
        content="While [prop]hasMoreOptions[/prop] is on, nearing the end of the list calls [prop]onReachEnd[/prop], so options can arrive from a server a batch at a time. The arrow keys stop at the last option held until the next batch lands."
    />
    <PageDocsExample :path="`${DOCS_ROOT}/OnDemand.vue`">
        <OnDemandDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Autocomplete"
        content="Give it a [prop]query[/prop] and the field becomes a text box: the reader types to narrow the list. Which options match is yours to decide, so the filtering lives in your code."
    />
    <PageDocsExample :path="`${DOCS_ROOT}/Autocomplete.vue`">
        <AutocompleteDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Autocomplete, loaded on demand"
        content="The two combine: each change of the query asks the server for its first batch of matches, and nearing the end of the list asks for the next."
    />
    <PageDocsExample :path="`${DOCS_ROOT}/AutocompleteOnDemand.vue`">
        <AutocompleteOnDemandDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Tooltip"
        content="Give a field [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the field's description. A disabled field shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and still does not open."
    />
    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                label="Reachable when disabled"
                hint="Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on."
                controls="Sets SelectProps.isReachableWhenDisabled"
            >
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>

            <PageProp
                item-key="tooltipIsDisabled"
                label="Disabled"
                hint="Turns the field off: it does not open, and the Tab key skips it."
                controls="Sets SelectProps.isDisabled"
            >
                <PageCheckField
                    :value="isTooltipDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isTooltipDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Named by a Label"
        content="Inside a Label, the field takes its name from the label's text, so it needs no [prop]ariaLabel[/prop], and pressing the text opens the list."
    />
    <PageDocsExample :path="`${DOCS_ROOT}/Labeled.vue`">
        <LabeledDocsExample />
    </PageDocsExample>
</template>
