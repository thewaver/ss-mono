<script setup lang="ts">
import { shallowRef } from "vue";

import type { TabsOrientation } from "@thewaver/ss-components-vue";
import { TABS_DEFAULTS, TABS_ORIENTATIONS } from "@thewaver/ss-components-vue";
import { TabKnobs } from "@thewaver/ss-playground/App/Knobs/Tabs.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

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
            <PageProp item-key="orientation" v-bind="TabKnobs.ORIENTATION_TEXT">
                <PageSelectField
                    :value="orientation"
                    :values="TABS_ORIENTATIONS"
                    ariaLabel="Orientation"
                    @change="(value: TabsOrientation) => (orientation = value)"
                />
            </PageProp>

            <PageProp item-key="isDisabled" v-bind="TabKnobs.IS_DISABLED_TEXT">
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

    <PageDocsSection v-bind="DOCS_SECTIONS.selectingArrowsMove" />

    <PageDocsExample :path="`${DOCS_ROOT}/Automatic.vue`">
        <AutomaticDocsExample :has-auto-activation="hasAutoActivation" />

        <template #renderKnobs>
            <PageProp item-key="hasAutoActivation" v-bind="TabKnobs.HAS_AUTO_ACTIVATION_TEXT">
                <PageCheckField
                    :value="hasAutoActivation"
                    ariaLabel="Automatic activation"
                    @change="(value: boolean) => (hasAutoActivation = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.markerThatFollowsPointer" />

    <PageDocsExample :path="`${DOCS_ROOT}/HoverPill.vue`">
        <HoverPillDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.disabledTab" />

    <PageDocsExample :path="`${DOCS_ROOT}/DisabledTab.vue`">
        <DisabledTabDocsExample :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp item-key="isReachableWhenDisabled" v-bind="TabKnobs.IS_REACHABLE_WHEN_DISABLED_TEXT">
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.links" />

    <PageDocsExample :path="`${DOCS_ROOT}/Links.vue`">
        <LinksDocsExample :has-link-component="hasLinkComponent" />

        <template #renderKnobs>
            <PageProp item-key="hasLinkComponent" v-bind="TabKnobs.HAS_LINK_COMPONENT_TEXT">
                <PageCheckField
                    :value="hasLinkComponent"
                    ariaLabel="Custom link component"
                    @change="(value: boolean) => (hasLinkComponent = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.clearableSelection" />

    <PageDocsExample :path="`${DOCS_ROOT}/Clearable.vue`">
        <ClearableDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.placedLayout" />

    <PageDocsExample :path="`${DOCS_ROOT}/Honeycomb.vue`">
        <HoneycombDocsExample />
    </PageDocsExample>
</template>
