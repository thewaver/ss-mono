import { useState } from "react";

import { TreeKnobs } from "@thewaver/ss-playground/App/Knobs/Trees.const";
import type { TreeFalloff } from "@thewaver/ss-playground/App/Pages/TreePage/TreeFalloffs.types";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
    STRESS_COUNT_FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/TreePage/TreePage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { CheckboxesDocsExample } from "./Docs/Checkboxes";
import { ControlledDocsExample } from "./Docs/Controlled";
import { DisabledDocsExample } from "./Docs/Disabled";
import { LeaningDocsExample } from "./Docs/Leaning";
import { LinksDocsExample } from "./Docs/Links";
import { OnDemandDocsExample } from "./Docs/OnDemand";
import { RadialDocsExample } from "./Docs/Radial";
import { RecordsDocsExample } from "./Docs/Records";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { VirtualizedDocsExample } from "./Docs/Virtualized";

export const TreeDocs = () => {
    const [isReachable, setIsReachable] = useState(false);
    const [hasLinkComponent, setHasLinkComponent] = useState(false);
    const [count, setCount] = useState(TreeKnobs.STARTING_STRESS_COUNT);
    const [falloff, setFalloff] = useState<TreeFalloff>(TreeKnobs.STARTING_FALLOFF);

    return (
        <>
            <PageDocsExample path={`${DOCS_ROOT}/Basic.tsx`}>
                <BasicDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.openingClosingOutside} />

            <PageDocsExample path={`${DOCS_ROOT}/Controlled.tsx`}>
                <ControlledDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.disabledNodes} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Disabled.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"isReachable"} {...TreeKnobs.IS_REACHABLE_TEXT}>
                        <PageCheckField
                            value={isReachable}
                            ariaLabel={"Reachable when disabled"}
                            onChange={setIsReachable}
                        />
                    </PageProp>
                )}
            >
                <DisabledDocsExample isReachable={isReachable} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.links} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Links.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"hasLinkComponent"} {...TreeKnobs.HAS_LINK_COMPONENT_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.recordsValues} />

            <PageDocsExample path={`${DOCS_ROOT}/Records.tsx`}>
                <RecordsDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.tickingSeveral} />

            <PageDocsExample path={`${DOCS_ROOT}/Checkboxes.tsx`}>
                <CheckboxesDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.branchesThatArriveLater} />

            <PageDocsExample path={`${DOCS_ROOT}/OnDemand.tsx`}>
                <OnDemandDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.manyNodes} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Virtualized.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"count"} {...TreeKnobs.COUNT_TEXT}>
                        <PageNumberField
                            value={count}
                            min={TreeKnobs.MIN_STRESS_COUNT}
                            max={TreeKnobs.MAX_STRESS_COUNT}
                            step={TreeKnobs.STRESS_COUNT_STEP}
                            width={STRESS_COUNT_FIELD_WIDTH}
                            ariaLabel={"Node count"}
                            onInput={setCount}
                        />
                    </PageProp>
                )}
            >
                <VirtualizedDocsExample count={count} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.leaningTowardPointer} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Leaning.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"falloff"} {...TreeKnobs.FALLOFF_TEXT}>
                        <PageSelectField
                            value={falloff}
                            values={TreeKnobs.FALLOFFS}
                            ariaLabel={"Falloff"}
                            onChange={setFalloff}
                        />
                    </PageProp>
                )}
            >
                <LeaningDocsExample falloff={falloff} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.treeDrawnOutward} />

            <PageDocsExample path={`${DOCS_ROOT}/Radial.tsx`}>
                <RadialDocsExample />
            </PageDocsExample>
        </>
    );
};
