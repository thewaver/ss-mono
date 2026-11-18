import { useState } from "react";

import { COLLAPSIBLE_DEFAULTS, COLLAPSIBLE_SIDES } from "@thewaver/ss-components-react";
import type { CollapsibleSide } from "@thewaver/ss-components-react";
import { AccordionKnobs } from "@thewaver/ss-playground/App/Knobs/Accordions.const";
import { CollapsibleKnobs } from "@thewaver/ss-playground/App/Knobs/Collapsibles.const";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/Accordions/CollapsiblePage/CollapsiblePage.const";

import { PageDocsExample } from "../../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../../PageComponents/DocsSection/DocsSection";
import { PageNumberField, PageSelectField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { ControlledDocsExample } from "./Docs/Controlled";
import { DeferredDocsExample } from "./Docs/Deferred";
import { SideDocsExample } from "./Docs/Side";

export const CollapsibleDocs = () => {
    const [transitionDurationMs, setTransitionDurationMs] = useState(COLLAPSIBLE_DEFAULTS.transitionDurationMs);
    const [side, setSide] = useState<CollapsibleSide>("right");

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"transitionDurationMs"} {...CollapsibleKnobs.TRANSITION_DURATION_MS_TEXT}>
                        <PageNumberField
                            value={transitionDurationMs}
                            min={AccordionKnobs.MIN_TRANSITION_MS}
                            max={AccordionKnobs.MAX_TRANSITION_MS}
                            step={AccordionKnobs.TRANSITION_STEP_MS}
                            width={FIELD_WIDTH}
                            ariaLabel={"Transition duration in milliseconds"}
                            onInput={setTransitionDurationMs}
                        />
                    </PageProp>
                )}
            >
                <BasicDocsExample transitionDurationMs={transitionDurationMs} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.openingClosingOutside} />

            <PageDocsExample path={`${DOCS_ROOT}/Controlled.tsx`}>
                <ControlledDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.builtFirstOpen} />

            <PageDocsExample path={`${DOCS_ROOT}/Deferred.tsx`}>
                <DeferredDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.openingSide} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Side.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"side"} {...CollapsibleKnobs.SIDE_TEXT}>
                        <PageSelectField
                            value={side}
                            values={COLLAPSIBLE_SIDES}
                            ariaLabel={"Side"}
                            onChange={setSide}
                        />
                    </PageProp>
                )}
            >
                <SideDocsExample side={side} />
            </PageDocsExample>
        </>
    );
};
