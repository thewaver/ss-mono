import { createSignal } from "solid-js";

import { SIDEBAR_DEFAULTS, SIDEBAR_EDGES, SIDEBAR_LAYOUTS } from "@thewaver/ss-components-solid";
import type { SidebarEdge, SidebarLayout } from "@thewaver/ss-components-solid";
import { SidebarKnobs } from "@thewaver/ss-playground/App/Knobs/Sidebars.const";
import { DOCS_ROOT, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/SidebarPage/SidebarPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { HoverDocsExample } from "./Docs/Hover";
import { OverlayDocsExample } from "./Docs/Overlay";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";

export const SidebarDocs = () => {
    const [getEdge, setEdge] = createSignal<SidebarEdge>(SIDEBAR_DEFAULTS.edge);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(SIDEBAR_DEFAULTS.transitionDurationMs);
    const [getLayout, setLayout] = createSignal<SidebarLayout>("overlay");
    const [getIsExpandedOnHover, setIsExpandedOnHover] = createSignal(true);
    const [getHoverShowDelayMs, setHoverShowDelayMs] = createSignal(SIDEBAR_DEFAULTS.hoverShowDelayMs);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"edge"}
                            label={"Edge"}
                            hint={
                                "Which side of its neighbor the sidebar is docked to, and so which way it grows. Docked to the top or bottom, it spans the width and grows in height."
                            }
                            controls={"Sets SidebarProps.edge"}
                        >
                            <PageSelectField
                                value={getEdge}
                                values={SIDEBAR_EDGES}
                                ariaLabel={"Edge"}
                                onChange={setEdge}
                            />
                        </PageProp>

                        <PageProp
                            key={"transitionDurationMs"}
                            label={"Transition duration (ms)"}
                            hint={"How long the sidebar takes to grow and shrink. At 0 it changes size at once."}
                            controls={"Sets SidebarProps.transitionDurationMs"}
                        >
                            <PageNumberField
                                value={getTransitionDurationMs}
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
                <BasicDocsExample edge={getEdge} transitionDurationMs={getTransitionDurationMs} />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the sidebar stays on the side [prop]edge[/prop] names, the left here, since its edges are the screen's sides; its contents and the content beside it run from the right."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Over its neighbor"}
                content={
                    "Set [prop]layout[/prop] to overlay and the sidebar grows over the content beside it instead of pushing it aside. In the layout it only ever takes its collapsed size, so the neighbor never moves; the panel grows out from the docked edge, raised above what it covers."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Overlay.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"layout"}
                        label={"Layout"}
                        hint={"Whether growing pushes the content beside the sidebar aside or grows over it."}
                        controls={"Sets SidebarProps.layout"}
                    >
                        <PageSelectField
                            value={getLayout}
                            values={SIDEBAR_LAYOUTS}
                            ariaLabel={"Layout"}
                            onChange={setLayout}
                        />
                    </PageProp>
                )}
            >
                <OverlayDocsExample layout={getLayout} />
            </PageDocsExample>

            <PageDocsSection
                title={"Expanding on hover"}
                content={
                    'With [prop]isExpandedOnHover[/prop] on, resting the pointer on the sidebar for [prop]hoverShowDelayMs[/prop] expands it, and moving away, pressing Escape or pressing elsewhere collapses it again ([wcag id="1.4.13"]WCAG 1.4.13[/wcag]). It never writes [prop]expanded[/prop], so the button still reads collapsed while the sidebar is only being looked at, and a sidebar expanded by the button stays expanded when the pointer leaves.'
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Hover.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"isExpandedOnHover"}
                            label={"Expands on hover"}
                            hint={
                                "Whether resting the pointer on the sidebar expands it, without changing its expanded state."
                            }
                            controls={"Sets SidebarProps.isExpandedOnHover"}
                        >
                            <PageCheckField
                                value={getIsExpandedOnHover}
                                ariaLabel={"Expands on hover"}
                                onChange={setIsExpandedOnHover}
                            />
                        </PageProp>

                        <PageProp
                            key={"hoverShowDelayMs"}
                            label={"Hover delay (ms)"}
                            hint={"How long the pointer has to rest on the sidebar before it expands."}
                            controls={"Sets SidebarProps.hoverShowDelayMs"}
                        >
                            <PageNumberField
                                value={getHoverShowDelayMs}
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
                <HoverDocsExample isExpandedOnHover={getIsExpandedOnHover} hoverShowDelayMs={getHoverShowDelayMs} />
            </PageDocsExample>
        </>
    );
};
