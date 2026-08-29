import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { DeferredExample } from "./Examples/Deferred";
import { GrowingExample } from "./Examples/Growing";
import { ScrolledExample } from "./Examples/Scrolled";
import { SectionsExample } from "./Examples/Sections";
import { SinglePanelExample } from "./Examples/SinglePanel";

const EXAMPLES_ROOT = "/src/App/Pages/AccordionPage/Examples";

export const AccordionPage = () => {
    const multiSignal = createSignal<string[]>(["Shipping"]);
    const singleSignal = createSignal<string[]>([]);
    const requiredSignal = createSignal<string[]>(["Shipping"]);
    const growingSignal = createSignal<string[]>(["Shipping"]);
    const scrolledSignal = createSignal<string[]>([]);
    const deferredSignal = createSignal<string[]>([]);

    const showMoreSignal = createSignal(false);

    const [getExtraLines, setExtraLines] = createSignal(0);
    const [getBuilt, setBuilt] = createSignal<string[]>([]);

    const getExamples = createMemo(() => [
        {
            key: "multi",
            name: "Many open at once",
            readout: () => `expanded: ${JSON.stringify(multiSignal[0]())}`,
            component: () => <SectionsExample expandedSignal={multiSignal} />,
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "single",
            name: "One at a time",
            readout: () => `expanded: ${JSON.stringify(singleSignal[0]())} — the component keeps at most one`,
            component: () => <SectionsExample expandedSignal={singleSignal} isSingleExpand={true} />,
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "required",
            name: "One at a time, and always one",
            readout: () =>
                `expanded: ${JSON.stringify(requiredSignal[0]())} — pressing the open header does nothing, because the only way out of a section is into another one`,
            component: () => (
                <SectionsExample expandedSignal={requiredSignal} isSingleExpand={true} isExpandRequired={true} />
            ),
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "growing",
            name: "Content that grows while open",
            readout: () => `extra lines: ${getExtraLines()} — the panel follows its content without reopening`,
            component: () => (
                <GrowingExample
                    expandedSignal={growingSignal}
                    extraLines={getExtraLines}
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
                `built: ${JSON.stringify(getBuilt())} — a section's content is not in the page until it is opened once, and stays there afterwards`,
            component: () => (
                <DeferredExample
                    expandedSignal={deferredSignal}
                    onBuild={(value) => setBuilt((prev) => (prev.includes(value) ? prev : [...prev, value]))}
                />
            ),
            path: `${EXAMPLES_ROOT}/Deferred.tsx`,
        },
        {
            key: "scrolled",
            name: "Inside a box that scrolls",
            readout: () =>
                `expanded: ${JSON.stringify(scrolledSignal[0]())} — opening a section below the fold brings it up`,
            component: () => <ScrolledExample expandedSignal={scrolledSignal} />,
            path: `${EXAMPLES_ROOT}/Scrolled.tsx`,
        },
        {
            key: "singlePanel",
            name: "A single panel, no heading",
            readout: () =>
                `expanded: ${showMoreSignal[0]()} — a Collapsible on its own: no heading element, no region, no arrow keys`,
            component: () => <SinglePanelExample expandedSignal={showMoreSignal} />,
            path: `${EXAMPLES_ROOT}/SinglePanel.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
