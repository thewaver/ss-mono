import { useState } from "react";

import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, MENU_DEFAULTS } from "@thewaver/ss-components-react";
import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-react";
import { MenuKnobs } from "@thewaver/ss-playground/App/Knobs/Menus.const";
import { DOCS_ROOT, DOCS_SECTIONS, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.const";

import { PageDocsExample } from "../../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageSelectField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { CascaderDocsExample } from "./Docs/Cascader";
import { ContextDocsExample } from "./Docs/Context";
import { ContextRightToLeftDocsExample } from "./Docs/ContextRightToLeft";
import { DisabledItemsDocsExample } from "./Docs/DisabledItems";
import { DrivenDocsExample } from "./Docs/Driven";
import { GlideDocsExample } from "./Docs/Glide";
import { LongListDocsExample } from "./Docs/LongList";
import { PlacementDocsExample } from "./Docs/Placement";
import { RepeatingDocsExample } from "./Docs/Repeating";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { SectionsDocsExample } from "./Docs/Sections";
import { StatefulDocsExample } from "./Docs/Stateful";
import { SubmenusDocsExample } from "./Docs/Submenus";
import { TooltipDocsExample } from "./Docs/Tooltip";

export const MenuDocs = () => {
    const [isDisabled, setIsDisabled] = useState(false);
    const [placementX, setPlacementX] = useState<AnchorHPlacement>(MENU_DEFAULTS.placement.ltr.x);
    const [placementY, setPlacementY] = useState<AnchorVPlacement>("top_out");
    const [submenuPlacementX, setSubmenuPlacementX] = useState<AnchorHPlacement>(MENU_DEFAULTS.submenuPlacement.ltr.x);
    const [isReachable, setIsReachable] = useState(false);
    const [isGliding, setIsGliding] = useState(true);
    const [isReachableWhenDisabled, setIsReachableWhenDisabled] = useState(false);
    const [isTooltipDisabled, setIsTooltipDisabled] = useState(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"isDisabled"} {...MenuKnobs.IS_DISABLED_TEXT}>
                        <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                    </PageProp>
                )}
            >
                <BasicDocsExample isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.submenus} />

            <PageDocsExample path={`${DOCS_ROOT}/Submenus.tsx`}>
                <SubmenusDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.pickingPath} />

            <PageDocsExample path={`${DOCS_ROOT}/Cascader.tsx`}>
                <CascaderDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.openedRightClick} />

            <PageDocsExample path={`${DOCS_ROOT}/Context.tsx`}>
                <ContextDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsExample path={`${DOCS_ROOT}/ContextRightToLeft.tsx`}>
                <ContextRightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.placement} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Placement.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"placementX"} {...MenuKnobs.PLACEMENT_X_TEXT}>
                            <PageSelectField
                                value={placementX}
                                values={ANCHOR_H_PLACEMENTS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Placement across"}
                                onChange={setPlacementX}
                            />
                        </PageProp>

                        <PageProp itemKey={"placementY"} {...MenuKnobs.PLACEMENT_Y_TEXT}>
                            <PageSelectField
                                value={placementY}
                                values={ANCHOR_V_PLACEMENTS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Placement down"}
                                onChange={setPlacementY}
                            />
                        </PageProp>

                        <PageProp itemKey={"submenuPlacementX"} {...MenuKnobs.SUBMENU_PLACEMENT_X_TEXT}>
                            <PageSelectField
                                value={submenuPlacementX}
                                values={ANCHOR_H_PLACEMENTS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Submenu placement across"}
                                onChange={setSubmenuPlacementX}
                            />
                        </PageProp>
                    </>
                )}
            >
                <PlacementDocsExample
                    placement={{ x: placementX, y: placementY }}
                    submenuPlacement={{ x: submenuPlacementX, y: MENU_DEFAULTS.submenuPlacement.ltr.y }}
                />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rowsThatHoldState} />

            <PageDocsExample path={`${DOCS_ROOT}/Stateful.tsx`}>
                <StatefulDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.sections} />

            <PageDocsExample path={`${DOCS_ROOT}/Sections.tsx`}>
                <SectionsDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.disabledItems} />

            <PageDocsExample
                path={`${DOCS_ROOT}/DisabledItems.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"isReachable"} {...MenuKnobs.IS_REACHABLE_TEXT}>
                        <PageCheckField
                            value={isReachable}
                            ariaLabel={"Reachable when disabled"}
                            onChange={setIsReachable}
                        />
                    </PageProp>
                )}
            >
                <DisabledItemsDocsExample isReachable={isReachable} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.commandsWorthRepeating} />

            <PageDocsExample path={`${DOCS_ROOT}/Repeating.tsx`}>
                <RepeatingDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.longList} />

            <PageDocsExample path={`${DOCS_ROOT}/LongList.tsx`}>
                <LongListDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.highlightThatGlides} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Glide.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"isGliding"} {...MenuKnobs.IS_GLIDING_TEXT}>
                        <PageCheckField value={isGliding} ariaLabel={"Gliding highlight"} onChange={setIsGliding} />
                    </PageProp>
                )}
            >
                <GlideDocsExample isGliding={isGliding} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.openingClosingOutside} />

            <PageDocsExample path={`${DOCS_ROOT}/Driven.tsx`}>
                <DrivenDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.tooltip} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"tooltipIsReachableWhenDisabled"}
                            {...MenuKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
                        >
                            <PageCheckField
                                value={isReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp itemKey={"tooltipIsDisabled"} {...MenuKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField
                                value={isTooltipDisabled}
                                ariaLabel={"Disabled"}
                                onChange={setIsTooltipDisabled}
                            />
                        </PageProp>
                    </>
                )}
            >
                <TooltipDocsExample isDisabled={isTooltipDisabled} isReachableWhenDisabled={isReachableWhenDisabled} />
            </PageDocsExample>
        </>
    );
};
