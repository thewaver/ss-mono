<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, MENU_DEFAULTS } from "@thewaver/ss-components-vue";
import type { AnchorHPlacement, AnchorPlacement, AnchorVPlacement } from "@thewaver/ss-components-vue";
import { DOCS_ROOT, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.const";

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
            <PageProp
                item-key="isDisabled"
                label="Disabled"
                hint="Turns the menu off: its button does not open it, and the Tab key skips it."
                controls="Sets MenuProps.isDisabled"
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
        title="Submenus"
        content="Give an item [prop]items[/prop] of its own and it opens a submenu beside it, in a popup of its own. Resting the pointer on the item opens it; from the keyboard the right arrow steps in onto the submenu's first item, and the left arrow or Escape steps back out one level. A submenu sits flush against its item, so set [prop]submenuOffset[/prop] to your surface's padding and border, or it overlaps the menu it came from."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Submenus.vue`">
        <SubmenusDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Picking a path"
        content="Submenus also make a cascading picker. An item that opens a submenu only opens it, so [prop]onActivate[/prop] runs for a city alone, never for a region or a country, and the code writes the city's whole path. The button shows the path picked so far, and its [prop]ariaLabel[/prop] says it too."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Cascader.vue`">
        <CascaderDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Opened by a right-click"
        content='For a menu opened by a right-click, use ContextMenu: the same menu, without a button. It draws a region through [prop]renderRegion[/prop], and a right-click inside it opens the menu where the pointer is. The region is a tab stop of its own, named by [prop]regionAriaLabel[/prop], so the keyboard can open the menu too, with the ContextMenu key or Shift+F10, against whatever inside the region has focus — as [wcag id="2.1.1"]WCAG 2.1.1[/wcag] asks of anything a pointer can do.'
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Context.vue`">
        <ContextDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Right to left"
        content="Inside a box whose text runs right to left, the menu hangs from the right edge of its button, and its submenus open to the left, where the left arrow steps in and the right arrow steps back out. Opened by a right-click, it spreads to the left of the pointer instead of the right. Every level takes the box's direction although it is drawn outside it, so its items read from the right. A [prop]placement[/prop] or [prop]submenuPlacement[/prop] you give is used as it stands."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsExample :path="`${DOCS_ROOT}/ContextRightToLeft.vue`">
        <ContextRightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Placement"
        content="Set [prop]placement[/prop] to choose where the menu sits against its button, across and down, and [prop]submenuPlacement[/prop] for where each submenu sits against its item. Either is used as it stands in right-to-left text too. The arrow that opens a submenu is always the one pointing at the side it opens on, and the other arrow closes it. The painter given to [prop]renderPopup[/prop] is handed the placement in use, so a surface can grow from the side it hangs on, as this one does when it opens above."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Placement.vue`">
        <PlacementDocsExample :placement="placement" :submenu-placement="submenuPlacement" />

        <template #renderKnobs>
            <PageProp
                item-key="placementX"
                label="Placement across"
                hint="Where the menu sits across its button: lined up with an edge from inside, centered, or outside it altogether."
                controls="Sets MenuProps.placement.x"
            >
                <PageSelectField
                    :value="placementX"
                    :values="ANCHOR_H_PLACEMENTS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Placement across"
                    @change="(value: AnchorHPlacement) => (placementX = value)"
                />
            </PageProp>

            <PageProp
                item-key="placementY"
                label="Placement down"
                hint="Where the menu sits above or below its button: lined up with an edge from inside, centered, or outside it altogether."
                controls="Sets MenuProps.placement.y"
            >
                <PageSelectField
                    :value="placementY"
                    :values="ANCHOR_V_PLACEMENTS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Placement down"
                    @change="(value: AnchorVPlacement) => (placementY = value)"
                />
            </PageProp>

            <PageProp
                item-key="submenuPlacementX"
                label="Submenu placement across"
                hint="Where each submenu sits across the item that opens it. Beside it on the left or the right, the arrow pointing that way opens it."
                controls="Sets MenuProps.submenuPlacement.x"
            >
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

    <PageDocsSection
        title="Rows that hold a state"
        content="An item's [prop]kind[/prop] makes it a checkbox or a radio rather than a command. Ticking a checkbox leaves the menu open, since ticking is often done several times over; picking a radio closes it. Radios written next to each other are one group, and picking one turns off whichever other one was on. Every checked value, radios included, is held in one [prop]checked[/prop] list."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Stateful.vue`">
        <StatefulDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Sections"
        content="An entry with a label and [prop]items[/prop] of its own, but no value, is a section, as a group is in Select. Its heading is drawn by [prop]renderGroupHeader[/prop] and whatever goes around it by [prop]renderGroupBox[/prop]. A screen reader announces the section's name, the arrows walk straight past the headings, and radios stay one group per section even where two sections of radios meet."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Sections.vue`">
        <SectionsDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Disabled items"
        content="An item can be disabled: the arrows skip it and it cannot be picked. Kept reachable when disabled, through [prop]isReachableWhenDisabled[/prop], the arrows stop on it instead, so a screen reader names it and says it is unavailable, and a tooltip can say why."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/DisabledItems.vue`">
        <DisabledItemsDocsExample :is-reachable="isReachable" />

        <template #renderKnobs>
            <PageProp
                item-key="isReachable"
                label="Reachable when disabled"
                hint="Lets the arrow keys stop on Paste and Duplicate, which then show a tooltip."
                controls="Sets MenuItem.isReachableWhenDisabled on the disabled items"
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
        title="Commands worth repeating"
        content="Picking a command closes the menu. Set [prop]staysOpenOnPick[/prop] on one worth pressing again, such as zooming in, and the menu stays open for the next press."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Repeating.vue`">
        <RepeatingDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="A long list"
        content="A menu taller than the room its popup is given scrolls, and the item the arrows land on is scrolled into view. Home and End reach the first and the last item."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/LongList.vue`">
        <LongListDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="A highlight that glides"
        content="Give the menu [prop]renderHighlightFloater[/prop] and one marker slides behind the items to whichever one the pointer or the arrows are on, in this menu and in every submenu, while the items paint no highlight of their own. Without it, each item paints its own highlight from the flags it is handed."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Glide.vue`">
        <GlideDocsExample :is-gliding="isGliding" />

        <template #renderKnobs>
            <PageProp
                item-key="isGliding"
                label="Gliding highlight"
                hint="Draws one marker that slides between the items. Off, each item lights up on its own."
                controls="Passes MenuProps.renderHighlightFloater, or leaves it out"
            >
                <PageCheckField
                    :value="isGliding"
                    ariaLabel="Gliding highlight"
                    @change="(value: boolean) => (isGliding = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection
        title="Opening and closing from outside"
        content="Hand the menu a [prop]visibility[/prop] signal and anything can open or close it; the menu writes to it as well, when it closes itself. Here the menu also hangs from the toggle below rather than from its own button, through [prop]anchorRef[/prop]. Since the toggle is the anchor, pressing it while the menu is open closes the menu, rather than counting as a press outside it."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Driven.vue`">
        <DrivenDocsExample />
    </PageDocsExample>

    <PageDocsSection
        title="Tooltip"
        content="Give a menu [prop]tooltipDefs[/prop] and its button shows a tooltip on hover and on keyboard focus, read by screen readers as the button's description. A disabled menu shows no tooltip unless you also keep it reachable when disabled; its button can then be focused to read why it is off, and still does not open the menu."
    />

    <PageDocsExample :path="`${DOCS_ROOT}/Tooltip.vue`">
        <TooltipDocsExample :is-disabled="isTooltipDisabled" :is-reachable-when-disabled="isReachableWhenDisabled" />

        <template #renderKnobs>
            <PageProp
                item-key="tooltipIsReachableWhenDisabled"
                label="Reachable when disabled"
                hint="Keeps a disabled menu's tooltip available: the Tab key can stop on its button and hovering it shows the tooltip. Without it a disabled menu shows no tooltip at all. It only matters while Disabled is on."
                controls="Sets MenuProps.isReachableWhenDisabled"
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
                hint="Turns the menu off: its button does not open it, and the Tab key skips it."
                controls="Sets MenuProps.isDisabled"
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
