<script setup lang="ts">
import { shallowRef } from "vue";

import type { TabsOrientation } from "@thewaver/ss-components-vue";
import { TABS_DEFAULTS, TABS_ORIENTATIONS } from "@thewaver/ss-components-vue";
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import AutomaticDocsExample from "./Docs/Automatic.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import ClearableDocsExample from "./Docs/Clearable.vue";
import DisabledTabDocsExample from "./Docs/DisabledTab.vue";
import HoneycombDocsExample from "./Docs/Honeycomb.vue";
import HoverPillDocsExample from "./Docs/HoverPill.vue";
import LinksDocsExample from "./Docs/Links.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";

const orientation = shallowRef<TabsOrientation>(TABS_DEFAULTS.orientation);
const isDisabled = shallowRef(false);
const hasAutoActivation = shallowRef(true);
const isReachableWhenDisabled = shallowRef(false);
const hasLinkComponent = shallowRef(false);
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :orientation="orientation" :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="orientation"
                label="Orientation"
                hint="Whether the tabs run across the page or down it, which also decides which arrow keys walk them: left and right in a row, up and down in a column."
                controls="Sets TabsProps.orientation"
            >
                <PageSelectField
                    :value="orientation"
                    :values="TABS_ORIENTATIONS"
                    ariaLabel="Orientation"
                    @change="(value: TabsOrientation) => (orientation = value)"
                />
            </PageProp>

            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns every tab off: none can be selected, and the Tab key skips the list."
                controls="Sets Tab.isDisabled on every example tab sent to TabsProps.tabs"
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
        content="Inside a box whose text runs right to left, the tabs run from the right and the left arrow key moves on to the next tab. The button below switches the box's direction while the tabs are on screen, and the marker and the arrow keys follow the row as it turns round."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Selecting as the arrows move"
        content="By default the arrow keys move focus along the tabs, and Enter or Space selects the one focused. Set [prop]hasAutoActivation[/prop] and an arrow selects the tab it lands on as well, which suits panels already in the page. Leave it off where showing a panel is expensive, such as one that fetches, since every tab passed on the way would be shown."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Automatic.vue`">
        <AutomaticDocsExample :has-auto-activation="hasAutoActivation" />

        <template #renderKnobs>
            <PageProp
                item-key="hasAutoActivation"
                label="Automatic activation"
                hint="Selects a tab as soon as an arrow key reaches it. Off, Enter or Space selects it."
                controls="Sets TabsProps.hasAutoActivation"
            >
                <PageCheckField
                    :value="hasAutoActivation"
                    ariaLabel="Automatic activation"
                    @change="(value: boolean) => (hasAutoActivation = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="A marker that follows the pointer"
        content="Besides the marker under the selected tab, [prop]renderHighlightFloater[/prop] draws a second one that slides to whichever tab the pointer or the keyboard focus is on."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/HoverPill.vue`">
        <HoverPillDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="A disabled tab"
        content="A tab whose record sets [prop]isDisabled[/prop] cannot be selected, and the arrow keys walk past it. With [prop]isReachableWhenDisabled[/prop] set on the record as well, the arrow keys stop on it, so a screen reader names it and says it is unavailable; it still cannot be selected."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/DisabledTab.vue`">
        <DisabledTabDocsExample :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="isReachableWhenDisabled"
                label="Reachable when disabled"
                hint="Lets the arrow keys stop on the disabled Metrics tab without selecting it."
                controls="Sets Tab.isReachableWhenDisabled on the disabled tab"
            >
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Links"
        content="Give a tab an [prop]href[/prop] and it is drawn as a native HTML anchor element, and choosing it still reports through [prop]onSelectionChange[/prop]. In a routed app, pass [prop]linkComponent[/prop], a custom link component such as your router's, and the tabs are drawn with it instead. A link needs no panel here, since the page it opens may be mounted anywhere."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Links.vue`">
        <LinksDocsExample :has-link-component="hasLinkComponent" />

        <template #renderKnobs>
            <PageProp
                item-key="hasLinkComponent"
                label="Custom link component"
                hint="Draws the tabs with a custom link component, as a router's link would be. Off, they use the native HTML anchor element."
                controls="Sets TabsProps.linkComponent"
            >
                <PageCheckField
                    :value="hasLinkComponent"
                    ariaLabel="Custom link component"
                    @change="(value: boolean) => (hasLinkComponent = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="A selection that can be cleared"
        content="Set the selected value to undefined and no tab is selected: the marker plays itself out over [prop]transitionDurationMs[/prop], and plays back in once a tab is chosen again. Which panel shows meanwhile, if any, is yours to decide."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Clearable.vue`">
        <ClearableDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Placed by a layout"
        content="Give the list [prop]computeLayout[/prop] and the tabs are placed by a layout instead of in a row or a column, here a honeycomb. The arrow keys still walk them in the order they are written, and both markers sit behind the cell they belong to."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Honeycomb.vue`">
        <HoneycombDocsExample />
    </PageDocsExample>
</template>
