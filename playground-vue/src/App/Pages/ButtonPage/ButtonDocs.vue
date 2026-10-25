<script setup lang="ts">
import { shallowRef } from "vue";

import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/ButtonPage/ButtonPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import DecoratedDocsExample from "./Docs/Decorated.vue";
import RepeatingDocsExample from "./Docs/Repeating.vue";
import TooltipDocsExample from "./Docs/Tooltip.vue";

const isDisabled = shallowRef(false);
const hasError = shallowRef(false);
const isPressed = shallowRef(false);
const isTooltipDisabled = shallowRef(false);
const isReachableWhenDisabled = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :is-disabled="isDisabled" :has-error="hasError" :is-pressed="isPressed" />

        <template #renderKnobs>
            <PageProp
                item-key="hasError"
                label="Error"
                hint="Puts the button in its error look. It changes nothing about what the button accepts or does."
                controls="Sets Button.hasError"
            >
                <PageCheckField :value="hasError" ariaLabel="Error" @change="(value: boolean) => (hasError = value)" />
            </PageProp>

            <PageProp
                item-key="isPressed"
                label="Pressed"
                hint="Marks the button as holding a state, like a toggle that stays down. What that looks like is up to the painter; here it gets a 4px inner ring in the secondary color."
                controls="Sets Button.isPressed"
            >
                <PageCheckField
                    :value="isPressed"
                    ariaLabel="Pressed"
                    @change="(value: boolean) => (isPressed = value)"
                />
            </PageProp>

            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns the button off: it ignores presses and hover, and the Tab key skips it."
                controls="Sets Button.isDisabled"
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
        title="Tooltip"
        content="Give a button [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, and links it to the button so screen readers read it as the button's description. A disabled button shows no tooltip unless you also keep it reachable when disabled; then it can still tell people why it is off."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                label="Reachable when disabled"
                hint="Keeps a disabled button's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled button shows no tooltip at all. It only matters while Disabled is on."
                controls="Sets Button.isReachableWhenDisabled"
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
                hint="Turns the button off: it ignores presses and hover, and the Tab key skips it."
                controls="Sets Button.isDisabled"
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
        title="Decoration"
        content="Anything drawn over the button goes through [prop]renderDecoration[/prop], which is handed the button's state like the painter is. Here a corner highlight shows while the button is pressed, and a ripple spreads from where it was pressed, which [prop]onActivation[/prop] reports."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Decorated.vue`">
        <DecoratedDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Hold to repeat"
        content="A button reports the pointer going down and up through [prop]onPointerDown[/prop] and [prop]onPointerUp[/prop], which is enough to repeat an action while it is held: here a step happens at once, then again and again after a short wait until the pointer lifts or leaves. A press from the keyboard still steps once, through [prop]onClick[/prop]."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Repeating.vue`">
        <RepeatingDocsExample />
    </PageDocsExample>
</template>
