import { For, createSignal } from "solid-js";

import { EDGE_FADER_DEFAULTS } from "@thewaver/ss-components-solid";
import type { EdgeFaderEdge } from "@thewaver/ss-components-solid";
import { EdgeFaderKnobs } from "@thewaver/ss-playground/App/Knobs/EdgeFaders.const";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
    EDGE_LABELS,
} from "@thewaver/ss-playground/App/Pages/EdgeFaderPage/EdgeFaderPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { ScrollAwareDocsExample } from "./Docs/ScrollAware";
import { SidesDocsExample } from "./Docs/Sides";
import { UnscrolledDocsExample } from "./Docs/Unscrolled";

export const EdgeFaderDocs = () => {
    const [getSize, setSize] = createSignal(EDGE_FADER_DEFAULTS.size);
    const [getEdges, setEdges] = createSignal<EdgeFaderEdge[]>(EDGE_FADER_DEFAULTS.edges);
    const [getIsScrollAware, setIsScrollAware] = createSignal(true);

    const setHasEdge = (edge: EdgeFaderEdge, hasEdge: boolean) =>
        setEdges((edges) =>
            EDGE_FADER_DEFAULTS.edges.filter((candidate) => (candidate === edge ? hasEdge : edges.includes(candidate))),
        );

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <PageProp key={"size"} {...EdgeFaderKnobs.SIZE_TEXT}>
                        <PageNumberField
                            value={getSize}
                            min={EdgeFaderKnobs.MIN_SIZE}
                            max={EdgeFaderKnobs.MAX_SIZE}
                            step={EdgeFaderKnobs.SIZE_STEP}
                            ariaLabel={"Fade size in pixels"}
                            onInput={setSize}
                        />
                    </PageProp>
                )}
            >
                <BasicDocsExample size={getSize} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.anyMixSides} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Sides.tsx`}
                renderKnobs={() => (
                    <For each={EDGE_FADER_DEFAULTS.edges}>
                        {(edge) => (
                            <PageProp
                                key={edge}
                                label={EDGE_LABELS[edge]}
                                hint={`Whether the ${edge} side fades.`}
                                controls={"Sets EdgeFaderProps.edges"}
                            >
                                <PageCheckField
                                    value={() => getEdges().includes(edge)}
                                    ariaLabel={EDGE_LABELS[edge]}
                                    onChange={(hasEdge) => setHasEdge(edge, hasEdge)}
                                />
                            </PageProp>
                        )}
                    </For>
                )}
            >
                <SidesDocsExample edges={getEdges} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.fadingOnlyOutOfView} />

            <PageDocsExample
                path={`${DOCS_ROOT}/ScrollAware.tsx`}
                renderKnobs={() => (
                    <PageProp key={"isScrollAware"} {...EdgeFaderKnobs.IS_SCROLL_AWARE_TEXT}>
                        <PageCheckField
                            value={getIsScrollAware}
                            ariaLabel={"Scroll-aware"}
                            onChange={setIsScrollAware}
                        />
                    </PageProp>
                )}
            >
                <ScrollAwareDocsExample isScrollAware={getIsScrollAware} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.aroundNonScrolling} />

            <PageDocsExample path={`${DOCS_ROOT}/Unscrolled.tsx`}>
                <UnscrolledDocsExample />
            </PageDocsExample>
        </>
    );
};
