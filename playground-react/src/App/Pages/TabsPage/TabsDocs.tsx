import { useState } from "react";

import type { TabsOrientation } from "@thewaver/ss-components-react";
import { TABS_DEFAULTS, TABS_ORIENTATIONS } from "@thewaver/ss-components-react";
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
    const [orientation, setOrientation] = useState<TabsOrientation>(TABS_DEFAULTS.orientation);
    const [isDisabled, setIsDisabled] = useState(false);
    const [hasAutoActivation, setHasAutoActivation] = useState(true);
    const [isReachableWhenDisabled, setIsReachableWhenDisabled] = useState(false);
    const [hasLinkComponent, setHasLinkComponent] = useState(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"orientation"} {...TabKnobs.ORIENTATION_TEXT}>
                            <PageSelectField
                                value={orientation}
                                values={TABS_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={setOrientation}
                            />
                        </PageProp>

                        <PageProp itemKey={"isDisabled"} {...TabKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample orientation={orientation} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.selectingArrowsMove} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Automatic.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"hasAutoActivation"} {...TabKnobs.HAS_AUTO_ACTIVATION_TEXT}>
                        <PageCheckField
                            value={hasAutoActivation}
                            ariaLabel={"Automatic activation"}
                            onChange={setHasAutoActivation}
                        />
                    </PageProp>
                )}
            >
                <AutomaticDocsExample hasAutoActivation={hasAutoActivation} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.markerThatFollowsPointer} />

            <PageDocsExample path={`${DOCS_ROOT}/HoverPill.tsx`}>
                <HoverPillDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.disabledTab} />

            <PageDocsExample
                path={`${DOCS_ROOT}/DisabledTab.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"isReachableWhenDisabled"} {...TabKnobs.IS_REACHABLE_WHEN_DISABLED_TEXT}>
                        <PageCheckField
                            value={isReachableWhenDisabled}
                            ariaLabel={"Reachable when disabled"}
                            onChange={setIsReachableWhenDisabled}
                        />
                    </PageProp>
                )}
            >
                <DisabledTabDocsExample isReachableWhenDisabled={isReachableWhenDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.links} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Links.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"hasLinkComponent"} {...TabKnobs.HAS_LINK_COMPONENT_TEXT}>
                        <PageCheckField
                            value={hasLinkComponent}
                            ariaLabel={"Custom link component"}
                            onChange={setHasLinkComponent}
                        />
                    </PageProp>
                )}
            >
                <LinksDocsExample hasLinkComponent={hasLinkComponent} />
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
