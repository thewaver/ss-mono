import { createSignal } from "solid-js";

import { COLLAPSIBLE_DEFAULTS, COLLAPSIBLE_SIDES } from "@thewaver/ss-components-solid";
import type { CollapsibleSide } from "@thewaver/ss-components-solid";
import { AccordionKnobs } from "@thewaver/ss-playground/App/Knobs/Accordions.const";
import {
    DOCS_ROOT,
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
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(COLLAPSIBLE_DEFAULTS.transitionDurationMs);
    const [getSide, setSide] = createSignal<CollapsibleSide>("right");

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"transitionDurationMs"}
                        label={"Transition duration (ms)"}
                        hint={"How long the panel takes to open and close. At 0 it opens and closes at once."}
                        controls={"Sets CollapsibleProps.transitionDurationMs"}
                    >
                        <PageNumberField
                            value={getTransitionDurationMs}
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
                <BasicDocsExample transitionDurationMs={getTransitionDurationMs} />
            </PageDocsExample>

            <PageDocsSection
                title={"Opening and closing from outside"}
                content={
                    "The collapsible keeps track of whether it is open by itself. To open or close it from elsewhere on the page, hold the boolean and pass it in as [prop]expanded[/prop]: both sides write it, so pressing the trigger updates yours and writing yours opens or closes the panel."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Controlled.tsx`}>
                <ControlledDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Built on first open"}
                content={
                    "Set [prop]isPanelBuiltOnExpand[/prop] and the panel's contents are not built until it is first opened, and they are kept once they are. It trades a cheaper first render for a pause on that first open."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Deferred.tsx`}>
                <DeferredDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Opening to a side"}
                content={
                    "Set [prop]side[/prop] to choose which side of the trigger the panel opens on. Top and bottom grow the panel's height, left and right its width; a sideways panel keeps its contents at their own width and uncovers them, so give them one."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Side.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"side"}
                        label={"Side"}
                        hint={"Which side of the trigger the panel opens on."}
                        controls={"Sets CollapsibleProps.side"}
                    >
                        <PageSelectField
                            value={getSide}
                            values={COLLAPSIBLE_SIDES}
                            ariaLabel={"Side"}
                            onChange={setSide}
                        />
                    </PageProp>
                )}
            >
                <SideDocsExample side={getSide} />
            </PageDocsExample>
        </>
    );
};
