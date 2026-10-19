import { useState } from "react";

import { COLLAPSIBLE_DEFAULTS } from "@thewaver/ss-components-react";
import { AccordionKnobs } from "@thewaver/ss-playground/App/Knobs/Accordions.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    STARTING_EXTRA_LINES,
} from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { DeferredExample } from "./Examples/Deferred";
import { GrowingExample } from "./Examples/Growing";
import { RowExample } from "./Examples/Row";
import { ScrolledExample } from "./Examples/Scrolled";
import { SectionsExample } from "./Examples/Sections";

export const AccordionPage = () => {
    const [gap, setGap] = useState(AccordionKnobs.STARTING_GAP);
    const [transitionDurationMs, setTransitionDurationMs] = useState(COLLAPSIBLE_DEFAULTS.transitionDurationMs);

    const multiState = useState<string[]>(["Shipping"]);
    const singleState = useState<string[]>([]);
    const requiredState = useState<string[]>(["Shipping"]);
    const growingState = useState<string[]>(["Shipping"]);
    const scrolledState = useState<string[]>([]);
    const deferredState = useState<string[]>([]);
    const rowState = useState<string[]>(["Mountains"]);

    const [extraLines, setExtraLines] = useState(STARTING_EXTRA_LINES);
    const [built, setBuilt] = useState<string[]>([]);

    const examples = [
        {
            key: "multi",
            name: EXAMPLE_NAMES.multi,
            readout: () => `expanded: ${JSON.stringify(multiState[0])}`,
            component: () => (
                <SectionsExample gap={gap} transitionDurationMs={transitionDurationMs} expanded={multiState} />
            ),
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "unheld",
            name: EXAMPLE_NAMES.unheld,
            readout: () =>
                "no signal passed — the accordion keeps which sections are open itself, so the page has nothing to show here",
            component: () => <SectionsExample gap={gap} transitionDurationMs={transitionDurationMs} />,
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "single",
            name: EXAMPLE_NAMES.single,
            readout: () => `expanded: ${JSON.stringify(singleState[0])} — the component keeps at most one`,
            component: () => (
                <SectionsExample
                    gap={gap}
                    transitionDurationMs={transitionDurationMs}
                    expanded={singleState}
                    isSingleExpand={true}
                />
            ),
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "required",
            name: EXAMPLE_NAMES.required,
            readout: () =>
                `expanded: ${JSON.stringify(requiredState[0])} — pressing the open header does nothing, because the only way out of a section is into another one`,
            component: () => (
                <SectionsExample
                    gap={gap}
                    transitionDurationMs={transitionDurationMs}
                    expanded={requiredState}
                    isSingleExpand={true}
                    isExpandRequired={true}
                />
            ),
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "growing",
            name: EXAMPLE_NAMES.growing,
            readout: () => `extra lines: ${extraLines} — the panel follows its content without reopening`,
            component: () => (
                <GrowingExample
                    gap={gap}
                    transitionDurationMs={transitionDurationMs}
                    expanded={growingState}
                    extraLines={extraLines}
                    onAddLine={() => {
                        setExtraLines((prev) => prev + 1);
                    }}
                    onClearLines={() => {
                        setExtraLines(STARTING_EXTRA_LINES);
                    }}
                />
            ),
            path: `${EXAMPLES_ROOT}/Growing.tsx`,
        },
        {
            key: "deferred",
            name: EXAMPLE_NAMES.deferred,
            readout: () =>
                `built: ${JSON.stringify(built)} — a section's content is not in the page until it is opened once, and stays there afterwards`,
            component: () => (
                <DeferredExample
                    gap={gap}
                    transitionDurationMs={transitionDurationMs}
                    expanded={deferredState}
                    onBuild={(value) => setBuilt((prev) => (prev.includes(value) ? prev : [...prev, value]))}
                />
            ),
            path: `${EXAMPLES_ROOT}/Deferred.tsx`,
        },
        {
            key: "scrolled",
            name: EXAMPLE_NAMES.scrolled,
            readout: () =>
                `expanded: ${JSON.stringify(scrolledState[0])} — opening a section below the fold brings it up`,
            component: () => (
                <ScrolledExample gap={gap} transitionDurationMs={transitionDurationMs} expanded={scrolledState} />
            ),
            path: `${EXAMPLES_ROOT}/Scrolled.tsx`,
        },
        {
            key: "row",
            name: EXAMPLE_NAMES.row,
            span: 2,
            readout: () =>
                `expanded: ${JSON.stringify(rowState[0])} — the panels sit in a row and open in width; the left and right arrows walk the headers, and the new panel's content slides in from the side the person moved toward`,
            component: () => <RowExample gap={gap} transitionDurationMs={transitionDurationMs} expanded={rowState} />,
            path: `${EXAMPLES_ROOT}/Row.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"gap"}
                    label={"Gap (px)"}
                    hint={"The space between sections."}
                    controls={"Sets AccordionProps.gap"}
                >
                    <PageNumberField
                        value={gap}
                        min={AccordionKnobs.MIN_GAP}
                        max={AccordionKnobs.MAX_GAP}
                        step={AccordionKnobs.GAP_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Gap in pixels"}
                        onInput={setGap}
                    />
                </PageProp>

                <PageProp
                    itemKey={"transitionDurationMs"}
                    label={"Transition duration (ms)"}
                    hint={"How long a section takes to open and close. At 0 it opens and closes at once."}
                    controls={"Sets AccordionProps.transitionDurationMs"}
                >
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
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
