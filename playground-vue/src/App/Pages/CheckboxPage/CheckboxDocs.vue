<script setup lang="ts">
import { shallowRef } from "vue";

import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/CheckboxPage/CheckboxPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import DecoratedDocsExample from "./Docs/Decorated.vue";
import MixedDocsExample from "./Docs/Mixed.vue";
import RefusingDocsExample from "./Docs/Refusing.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import TooltipDocsExample from "./Docs/Tooltip.vue";

const hasError = shallowRef(false);
const isDisabled = shallowRef(false);
const isReachableWhenDisabled = shallowRef(false);
const isTooltipDisabled = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :has-error="hasError" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="hasError"
                label="Error"
                hint="Marks the checkbox invalid, for screen readers as well as for the painter."
                controls="Sets CheckboxProps.hasError"
            >
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns the checkbox off: neither a click nor Space changes it, and the Tab key skips it."
                controls="Sets CheckboxProps.isDisabled"
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
        content="Inside a box whose text runs right to left, the box sits to the right of its words."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Mixed"
        content="A checkbox can be neither on nor off. Set [prop]isMixed[/prop] and it reads as mixed, to a screen reader as well as on screen, which is what a box summarizing others shows while they disagree. Pressing it sets a value, so here it turns both of the boxes it controls on or off."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Mixed.vue`">
        <MixedDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Refusing a change"
        content="The checkbox reports a press through [prop]onChange[/prop] and shows whatever its value then holds, so a change can be refused by writing the old value back. Here at least one way to be reached must stay on: whichever box is the last one on refuses to go off."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Refusing.vue`">
        <RefusingDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Decoration"
        content="Anything drawn over the box goes through [prop]renderDecoration[/prop], which is handed the checkbox's state like the painter is: here a corner highlight shows while it is pressed."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Decorated.vue`">
        <DecoratedDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Tooltip"
        content="Give a checkbox [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the checkbox's description. A disabled checkbox shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and pressing it still changes nothing."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                label="Reachable when disabled"
                hint="Keeps a disabled checkbox's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled checkbox shows no tooltip at all. It only matters while Disabled is on."
                controls="Sets CheckboxProps.isReachableWhenDisabled"
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
                hint="Turns the checkbox off: neither a click nor Space changes it, and the Tab key skips it."
                controls="Sets CheckboxProps.isDisabled"
            >
                <PageCheckField
                    :value="isTooltipDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isTooltipDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
