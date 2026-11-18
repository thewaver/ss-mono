import { createSignal } from "solid-js";

import type { TabsOrientation } from "@thewaver/ss-components-solid";
import { TABS_DEFAULTS, TABS_ORIENTATIONS } from "@thewaver/ss-components-solid";
import { TabKnobs } from "@thewaver/ss-playground/App/Knobs/Tabs.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

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
                        <PageProp key={"orientation"} {...TabKnobs.ORIENTATION_TEXT}>
                            <PageSelectField
                                value={getOrientation}
                                values={TABS_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={(orientation) => setOrientation(() => orientation)}
                            />
                        </PageProp>

                        <PageProp key={"isDisabled"} {...TabKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample orientation={getOrientation} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.selectingArrowsMove} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Automatic.tsx`}
                renderKnobs={() => (
                    <PageProp key={"hasAutoActivation"} {...TabKnobs.HAS_AUTO_ACTIVATION_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.markerThatFollowsPointer} />

            <PageDocsExample path={`${DOCS_ROOT}/HoverPill.tsx`}>
                <HoverPillDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.disabledTab} />

            <PageDocsExample
                path={`${DOCS_ROOT}/DisabledTab.tsx`}
                renderKnobs={() => (
                    <PageProp key={"isReachableWhenDisabled"} {...TabKnobs.IS_REACHABLE_WHEN_DISABLED_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.links} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Links.tsx`}
                renderKnobs={() => (
                    <PageProp key={"hasLinkComponent"} {...TabKnobs.HAS_LINK_COMPONENT_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.clearableSelection} />

            <PageDocsExample path={`${DOCS_ROOT}/Clearable.tsx`}>
                <ClearableDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.placedLayout} />

            <PageDocsExample path={`${DOCS_ROOT}/Honeycomb.tsx`}>
                <HoneycombDocsExample />
            </PageDocsExample>
        </>
    );
};
