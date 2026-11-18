<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, MENU_DEFAULTS } from "@thewaver/ss-components-vue";
import type { AnchorHPlacement, AnchorPlacement, AnchorVPlacement } from "@thewaver/ss-components-vue";
import { MenuKnobs } from "@thewaver/ss-playground/App/Knobs/Menus.const";
import { DOCS_ROOT, DOCS_SECTIONS, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.const";

import PageDocsExample from "../../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../../PageComponents/DocsSection/PageDocsSection.vue";
import PageCheckField from "../../../PageComponents/Field/PageCheckField.vue";
import PageSelectField from "../../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import CascaderDocsExample from "./Docs/Cascader.vue";
import ContextDocsExample from "./Docs/Context.vue";
import ContextRightToLeftDocsExample from "./Docs/ContextRightToLeft.vue";
import DisabledItemsDocsExample from "./Docs/DisabledItems.vue";
import DrivenDocsExample from "./Docs/Driven.vue";
import GlideDocsExample from "./Docs/Glide.vue";
import LongListDocsExample from "./Docs/LongList.vue";
import PlacementDocsExample from "./Docs/Placement.vue";
import RepeatingDocsExample from "./Docs/Repeating.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import SectionsDocsExample from "./Docs/Sections.vue";
import StatefulDocsExample from "./Docs/Stateful.vue";
import SubmenusDocsExample from "./Docs/Submenus.vue";
import TooltipDocsExample from "./Docs/Tooltip.vue";

const isDisabled = shallowRef(false);
const placementX = shallowRef<AnchorHPlacement>(MENU_DEFAULTS.placement.ltr.x);
const placementY = shallowRef<AnchorVPlacement>("top_out");
const submenuPlacementX = shallowRef<AnchorHPlacement>(MENU_DEFAULTS.submenuPlacement.ltr.x);
const isReachable = shallowRef(false);
const isGliding = shallowRef(true);
const isReachableWhenDisabled = shallowRef(false);
const isTooltipDisabled = shallowRef(false);

const placement = computed<AnchorPlacement>(() => ({ x: placementX.value, y: placementY.value }));

const submenuPlacement = computed<AnchorPlacement>(() => ({
    x: submenuPlacementX.value,
    y: MENU_DEFAULTS.submenuPlacement.ltr.y,
}));
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample :is-disabled="isDisabled" />

        <template #renderKnobs>
            <PageProp item-key="isDisabled" v-bind="MenuKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.submenus" />

    <PageDocsExample :path="`${DOCS_ROOT}/Submenus.vue`">
        <SubmenusDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.pickingPath" />

    <PageDocsExample :path="`${DOCS_ROOT}/Cascader.vue`">
        <CascaderDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.openedRightClick" />

    <PageDocsExample :path="`${DOCS_ROOT}/Context.vue`">
        <ContextDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsExample :path="`${DOCS_ROOT}/ContextRightToLeft.vue`">
        <ContextRightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.placement" />

    <PageDocsExample :path="`${DOCS_ROOT}/Placement.vue`">
        <PlacementDocsExample :placement="placement" :submenu-placement="submenuPlacement" />

        <template #renderKnobs>
            <PageProp item-key="placementX" v-bind="MenuKnobs.PLACEMENT_X_TEXT">
                <PageSelectField
                    :value="placementX"
                    :values="ANCHOR_H_PLACEMENTS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Placement across"
                    @change="(value: AnchorHPlacement) => (placementX = value)"
                />
            </PageProp>

            <PageProp item-key="placementY" v-bind="MenuKnobs.PLACEMENT_Y_TEXT">
                <PageSelectField
                    :value="placementY"
                    :values="ANCHOR_V_PLACEMENTS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Placement down"
                    @change="(value: AnchorVPlacement) => (placementY = value)"
                />
            </PageProp>

            <PageProp item-key="submenuPlacementX" v-bind="MenuKnobs.SUBMENU_PLACEMENT_X_TEXT">
                <PageSelectField
                    :value="submenuPlacementX"
                    :values="ANCHOR_H_PLACEMENTS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Submenu placement across"
                    @change="(value: AnchorHPlacement) => (submenuPlacementX = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rowsThatHoldState" />

    <PageDocsExample :path="`${DOCS_ROOT}/Stateful.vue`">
        <StatefulDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.sections" />

    <PageDocsExample :path="`${DOCS_ROOT}/Sections.vue`">
        <SectionsDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.disabledItems" />

    <PageDocsExample :path="`${DOCS_ROOT}/DisabledItems.vue`">
        <DisabledItemsDocsExample :is-reachable="isReachable" />

        <template #renderKnobs>
            <PageProp item-key="isReachable" v-bind="MenuKnobs.IS_REACHABLE_TEXT">
                <PageCheckField
                    :value="isReachable"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachable = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.commandsWorthRepeating" />

    <PageDocsExample :path="`${DOCS_ROOT}/Repeating.vue`">
        <RepeatingDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.longList" />

    <PageDocsExample :path="`${DOCS_ROOT}/LongList.vue`">
        <LongListDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.highlightThatGlides" />

    <PageDocsExample :path="`${DOCS_ROOT}/Glide.vue`">
        <GlideDocsExample :is-gliding="isGliding" />

        <template #renderKnobs>
            <PageProp item-key="isGliding" v-bind="MenuKnobs.IS_GLIDING_TEXT">
                <PageCheckField
                    :value="isGliding"
                    ariaLabel="Gliding highlight"
                    @change="(value: boolean) => (isGliding = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.openingClosingOutside" />

    <PageDocsExample :path="`${DOCS_ROOT}/Driven.vue`">
        <DrivenDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.tooltip" />

    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                v-bind="MenuKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT"
            >
                <PageCheckField
                    :value="isReachableWhenDisabled"
                    ariaLabel="Reachable when disabled"
                    @change="(value: boolean) => (isReachableWhenDisabled = value)"
                />
            </PageProp>

            <PageProp item-key="tooltipIsDisabled" v-bind="MenuKnobs.IS_DISABLED_TEXT">
                <PageCheckField
                    :value="isTooltipDisabled"
                    ariaLabel="Disabled"
                    @change="(value: boolean) => (isTooltipDisabled = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
