import { useState } from "react";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    STARTING_EXTRA_LINES,
} from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { DeferredExample } from "./Examples/Deferred";
import { GrowingExample } from "./Examples/Growing";
import { RowExample } from "./Examples/Row";
import { ScrolledExample } from "./Examples/Scrolled";
import { SectionsExample } from "./Examples/Sections";

export const AccordionPage = () => {
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
            component: () => <SectionsExample expanded={multiState} />,
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "unheld",
            name: EXAMPLE_NAMES.unheld,
            readout: () =>
                "no signal passed — the accordion keeps which sections are open itself, so the page has nothing to show here",
            component: () => <SectionsExample />,
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "single",
            name: EXAMPLE_NAMES.single,
            readout: () => `expanded: ${JSON.stringify(singleState[0])} — the component keeps at most one`,
            component: () => <SectionsExample expanded={singleState} isSingleExpand={true} />,
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "required",
            name: EXAMPLE_NAMES.required,
            readout: () =>
                `expanded: ${JSON.stringify(requiredState[0])} — pressing the open header does nothing, because the only way out of a section is into another one`,
            component: () => <SectionsExample expanded={requiredState} isSingleExpand={true} isExpandRequired={true} />,
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "growing",
            name: EXAMPLE_NAMES.growing,
            readout: () => `extra lines: ${extraLines} — the panel follows its content without reopening`,
            component: () => (
                <GrowingExample
                    expanded={growingState}
                    extraLines={extraLines}
                    onAddLine={() => {
                        setExtraLines((prev) => prev + 1);
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
            component: () => <ScrolledExample expanded={scrolledState} />,
            path: `${EXAMPLES_ROOT}/Scrolled.tsx`,
        },
        {
            key: "row",
            name: EXAMPLE_NAMES.row,
            span: 2,
            readout: () =>
                `expanded: ${JSON.stringify(rowState[0])} — the panels sit in a row and open in width; the left and right arrows walk the headers, and the new panel's content slides in from the side the person moved toward`,
            component: () => <RowExample expanded={rowState} />,
            path: `${EXAMPLES_ROOT}/Row.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
