import { createSignal } from "solid-js";

import type { TabsOrientation } from "@thewaver/ss-components-solid";
import { TABS_DEFAULTS, TABS_ORIENTATIONS } from "@thewaver/ss-components-solid";
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { AutomaticDocsExample } from "./Docs/Automatic";
import { BasicDocsExample } from "./Docs/Basic";
import { ClearableDocsExample } from "./Docs/Clearable";
import { DisabledTabDocsExample } from "./Docs/DisabledTab";
import { HoneycombDocsExample } from "./Docs/Honeycomb";
import { HoverPillDocsExample } from "./Docs/HoverPill";
import { LinksDocsExample } from "./Docs/Links";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";

export const TabsDocs = () => {
    const [getOrientation, setOrientation] = createSignal<TabsOrientation>(TABS_DEFAULTS.orientation);
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getHasAutoActivation, setHasAutoActivation] = createSignal(true);
    const [getIsReachableWhenDisabled, setIsReachableWhenDisabled] = createSignal(false);
    const [getHasLinkComponent, setHasLinkComponent] = createSignal(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"orientation"}
                            label={"Orientation"}
                            hint={
                                "Whether the tabs run across the page or down it, which also decides which arrow keys walk them: left and right in a row, up and down in a column."
                            }
                            controls={"Sets TabsProps.orientation"}
                        >
                            <PageSelectField
                                value={getOrientation}
                                values={TABS_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={(orientation) => setOrientation(() => orientation)}
                            />
                        </PageProp>

                        <PageProp
                            key={"isDisabled"}
                            label={"Disabled"}
                            hint={"Turns every tab off: none can be selected, and the Tab key skips the list."}
                            controls={"Sets Tab.isDisabled on every example tab sent to TabsProps.tabs"}
                        >
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample orientation={getOrientation} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the tabs run from the right and the left arrow key moves on to the next tab. The button below switches the box's direction while the tabs are on screen, and the marker and the arrow keys follow the row as it turns round."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Selecting as the arrows move"}
                content={
                    "By default the arrow keys move focus along the tabs, and Enter or Space selects the one focused. Set [prop]hasAutoActivation[/prop] and an arrow selects the tab it lands on as well, which suits panels already in the page. Leave it off where showing a panel is expensive, such as one that fetches, since every tab passed on the way would be shown."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Automatic.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"hasAutoActivation"}
                        label={"Automatic activation"}
                        hint={"Selects a tab as soon as an arrow key reaches it. Off, Enter or Space selects it."}
                        controls={"Sets TabsProps.hasAutoActivation"}
                    >
                        <PageCheckField
                            value={getHasAutoActivation}
                            ariaLabel={"Automatic activation"}
                            onChange={setHasAutoActivation}
                        />
                    </PageProp>
                )}
            >
                <AutomaticDocsExample hasAutoActivation={getHasAutoActivation} />
            </PageDocsExample>

            <PageDocsSection
                title={"A marker that follows the pointer"}
                content={
                    "Besides the marker under the selected tab, [prop]renderHighlightFloater[/prop] draws a second one that slides to whichever tab the pointer or the keyboard focus is on."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/HoverPill.tsx`}>
                <HoverPillDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"A disabled tab"}
                content={
                    "A tab whose record sets [prop]isDisabled[/prop] cannot be selected, and the arrow keys walk past it. With [prop]isReachableWhenDisabled[/prop] set on the record as well, the arrow keys stop on it, so a screen reader names it and says it is unavailable; it still cannot be selected."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/DisabledTab.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"isReachableWhenDisabled"}
                        label={"Reachable when disabled"}
                        hint={"Lets the arrow keys stop on the disabled Metrics tab without selecting it."}
                        controls={"Sets Tab.isReachableWhenDisabled on the disabled tab"}
                    >
                        <PageCheckField
                            value={getIsReachableWhenDisabled}
                            ariaLabel={"Reachable when disabled"}
                            onChange={setIsReachableWhenDisabled}
                        />
                    </PageProp>
                )}
            >
                <DisabledTabDocsExample isReachableWhenDisabled={getIsReachableWhenDisabled} />
            </PageDocsExample>

            <PageDocsSection
                title={"Links"}
                content={
                    "Give a tab an [prop]href[/prop] and it is drawn as a native HTML anchor element, and choosing it still reports through [prop]onSelectionChange[/prop]. In a routed app, pass [prop]linkComponent[/prop], a custom link component such as your router's, and the tabs are drawn with it instead. A link needs no panel here, since the page it opens may be mounted anywhere."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Links.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"hasLinkComponent"}
                        label={"Custom link component"}
                        hint={
                            "Draws the tabs with a custom link component, as a router's link would be. Off, they use the native HTML anchor element."
                        }
                        controls={"Sets TabsProps.linkComponent"}
                    >
                        <PageCheckField
                            value={getHasLinkComponent}
                            ariaLabel={"Custom link component"}
                            onChange={setHasLinkComponent}
                        />
                    </PageProp>
                )}
            >
                <LinksDocsExample hasLinkComponent={getHasLinkComponent} />
            </PageDocsExample>

            <PageDocsSection
                title={"A selection that can be cleared"}
                content={
                    "Set the selected value to undefined and no tab is selected: the marker plays itself out over [prop]transitionDurationMs[/prop], and plays back in once a tab is chosen again. Which panel shows meanwhile, if any, is yours to decide."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Clearable.tsx`}>
                <ClearableDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Placed by a layout"}
                content={
                    "Give the list [prop]computeLayout[/prop] and the tabs are placed by a layout instead of in a row or a column, here a honeycomb. The arrow keys still walk them in the order they are written, and both markers sit behind the cell they belong to."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Honeycomb.tsx`}>
                <HoneycombDocsExample />
            </PageDocsExample>
        </>
    );
};
