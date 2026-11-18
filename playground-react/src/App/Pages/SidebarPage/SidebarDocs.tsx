import { useState } from "react";

import { SIDEBAR_DEFAULTS, SIDEBAR_EDGES, SIDEBAR_LAYOUTS } from "@thewaver/ss-components-react";
import type { SidebarEdge, SidebarLayout } from "@thewaver/ss-components-react";
import { SidebarKnobs } from "@thewaver/ss-playground/App/Knobs/Sidebars.const";
import { DOCS_ROOT, DOCS_SECTIONS, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/SidebarPage/SidebarPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { HoverDocsExample } from "./Docs/Hover";
import { OverlayDocsExample } from "./Docs/Overlay";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";

export const SidebarDocs = () => {
    const [edge, setEdge] = useState<SidebarEdge>(SIDEBAR_DEFAULTS.edge);
    const [transitionDurationMs, setTransitionDurationMs] = useState(SIDEBAR_DEFAULTS.transitionDurationMs);
    const [layout, setLayout] = useState<SidebarLayout>("overlay");
    const [isExpandedOnHover, setIsExpandedOnHover] = useState(true);
    const [hoverShowDelayMs, setHoverShowDelayMs] = useState(SIDEBAR_DEFAULTS.hoverShowDelayMs);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"edge"} {...SidebarKnobs.EDGE_TEXT}>
                            <PageSelectField
                                value={edge}
                                values={SIDEBAR_EDGES}
                                ariaLabel={"Edge"}
                                onChange={setEdge}
                            />
                        </PageProp>

                        <PageProp itemKey={"transitionDurationMs"} {...SidebarKnobs.TRANSITION_DURATION_MS_TEXT}>
                            <PageNumberField
                                value={transitionDurationMs}
                                min={SidebarKnobs.MIN_TRANSITION_MS}
                                max={SidebarKnobs.MAX_TRANSITION_MS}
                                step={SidebarKnobs.TRANSITION_STEP_MS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Transition duration in milliseconds"}
                                onInput={setTransitionDurationMs}
                            />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample edge={edge} transitionDurationMs={transitionDurationMs} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.overNeighbor} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Overlay.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"layout"} {...SidebarKnobs.LAYOUT_TEXT}>
                        <PageSelectField
                            value={layout}
                            values={SIDEBAR_LAYOUTS}
                            ariaLabel={"Layout"}
                            onChange={setLayout}
                        />
                    </PageProp>
                )}
            >
                <OverlayDocsExample layout={layout} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.expandingHover} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Hover.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"isExpandedOnHover"} {...SidebarKnobs.IS_EXPANDED_ON_HOVER_TEXT}>
                            <PageCheckField
                                value={isExpandedOnHover}
                                ariaLabel={"Expands on hover"}
                                onChange={setIsExpandedOnHover}
                            />
                        </PageProp>

                        <PageProp itemKey={"hoverShowDelayMs"} {...SidebarKnobs.HOVER_SHOW_DELAY_MS_TEXT}>
                            <PageNumberField
                                value={hoverShowDelayMs}
                                min={SidebarKnobs.MIN_DELAY_MS}
                                max={SidebarKnobs.MAX_DELAY_MS}
                                step={SidebarKnobs.DELAY_STEP_MS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Hover delay in milliseconds"}
                                onInput={setHoverShowDelayMs}
                            />
                        </PageProp>
                    </>
                )}
            >
                <HoverDocsExample isExpandedOnHover={isExpandedOnHover} hoverShowDelayMs={hoverShowDelayMs} />
            </PageDocsExample>
        </>
    );
};
