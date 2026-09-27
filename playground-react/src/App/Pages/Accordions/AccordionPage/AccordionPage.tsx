import { useState } from "react";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { DeferredExample } from "./Examples/Deferred";
import { GrowingExample } from "./Examples/Growing";
import { ScrolledExample } from "./Examples/Scrolled";
import { SectionsExample } from "./Examples/Sections";

const EXAMPLES_ROOT = "/src/App/Pages/Accordions/AccordionPage/Examples";

const STARTING_EXTRA_LINES = 0;

export const AccordionPage = () => {
    const multiState = useState<string[]>(["Shipping"]);
    const singleState = useState<string[]>([]);
    const requiredState = useState<string[]>(["Shipping"]);
    const growingState = useState<string[]>(["Shipping"]);
    const scrolledState = useState<string[]>([]);
    const deferredState = useState<string[]>([]);

    const [extraLines, setExtraLines] = useState(STARTING_EXTRA_LINES);
    const [built, setBuilt] = useState<string[]>([]);

    const examples = [
        {
            key: "multi",
            name: "Many open at once",
            readout: () => `expanded: ${JSON.stringify(multiState[0])}`,
            component: () => <SectionsExample expandedState={multiState} />,
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "unheld",
            name: "Nobody holding the state",
            readout: () =>
                "no signal passed — the accordion keeps which sections are open itself, so the page has nothing to show here",
            component: () => <SectionsExample />,
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "single",
            name: "One at a time",
            readout: () => `expanded: ${JSON.stringify(singleState[0])} — the component keeps at most one`,
            component: () => <SectionsExample expandedState={singleState} isSingleExpand={true} />,
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "required",
            name: "One at a time, and always one",
            readout: () =>
                `expanded: ${JSON.stringify(requiredState[0])} — pressing the open header does nothing, because the only way out of a section is into another one`,
            component: () => (
                <SectionsExample expandedState={requiredState} isSingleExpand={true} isExpandRequired={true} />
            ),
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "growing",
            name: "Content that grows while open",
            readout: () => `extra lines: ${extraLines} — the panel follows its content without reopening`,
            component: () => (
                <GrowingExample
                    expandedState={growingState}
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
            name: "Panels built on first open",
            readout: () =>
                `built: ${JSON.stringify(built)} — a section's content is not in the page until it is opened once, and stays there afterwards`,
            component: () => (
                <DeferredExample
                    expandedState={deferredState}
                    onBuild={(value) => setBuilt((prev) => (prev.includes(value) ? prev : [...prev, value]))}
                />
            ),
            path: `${EXAMPLES_ROOT}/Deferred.tsx`,
        },
        {
            key: "scrolled",
            name: "Inside a box that scrolls",
            readout: () =>
                `expanded: ${JSON.stringify(scrolledState[0])} — opening a section below the fold brings it up`,
            component: () => <ScrolledExample expandedState={scrolledState} />,
            path: `${EXAMPLES_ROOT}/Scrolled.tsx`,
        },
    ];

    return <PageExamples items={examples} />;
};
