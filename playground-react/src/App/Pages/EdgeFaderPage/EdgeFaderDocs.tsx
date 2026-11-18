import { useState } from "react";

import { EDGE_FADER_DEFAULTS } from "@thewaver/ss-components-react";
import type { EdgeFaderEdge } from "@thewaver/ss-components-react";
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
    const [size, setSize] = useState(EDGE_FADER_DEFAULTS.size);
    const [edges, setEdges] = useState<EdgeFaderEdge[]>(EDGE_FADER_DEFAULTS.edges);
    const [isScrollAware, setIsScrollAware] = useState(true);

    const setHasEdge = (edge: EdgeFaderEdge, hasEdge: boolean) =>
        setEdges((current) =>
            EDGE_FADER_DEFAULTS.edges.filter((candidate) =>
                candidate === edge ? hasEdge : current.includes(candidate),
            ),
        );

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"size"} {...EdgeFaderKnobs.SIZE_TEXT}>
                        <PageNumberField
                            value={size}
                            min={EdgeFaderKnobs.MIN_SIZE}
                            max={EdgeFaderKnobs.MAX_SIZE}
                            step={EdgeFaderKnobs.SIZE_STEP}
                            ariaLabel={"Fade size in pixels"}
                            onInput={setSize}
                        />
                    </PageProp>
                )}
            >
                <BasicDocsExample size={size} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.anyMixSides} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Sides.tsx`}
                renderKnobs={() => (
                    <>
                        {EDGE_FADER_DEFAULTS.edges.map((edge) => (
                            <PageProp
                                key={edge}
                                itemKey={edge}
                                label={EDGE_LABELS[edge]}
                                hint={`Whether the ${edge} side fades.`}
                                controls={"Sets EdgeFaderProps.edges"}
                            >
                                <PageCheckField
                                    value={edges.includes(edge)}
                                    ariaLabel={EDGE_LABELS[edge]}
                                    onChange={(hasEdge) => setHasEdge(edge, hasEdge)}
                                />
                            </PageProp>
                        ))}
                    </>
                )}
            >
                <SidesDocsExample edges={edges} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.fadingOnlyOutOfView} />

            <PageDocsExample
                path={`${DOCS_ROOT}/ScrollAware.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"isScrollAware"} {...EdgeFaderKnobs.IS_SCROLL_AWARE_TEXT}>
                        <PageCheckField value={isScrollAware} ariaLabel={"Scroll-aware"} onChange={setIsScrollAware} />
                    </PageProp>
                )}
            >
                <ScrollAwareDocsExample isScrollAware={isScrollAware} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.aroundNonScrolling} />

            <PageDocsExample path={`${DOCS_ROOT}/Unscrolled.tsx`}>
                <UnscrolledDocsExample />
            </PageDocsExample>
        </>
    );
};
