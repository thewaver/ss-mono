import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { DeferredExample } from "./Examples/Deferred";
import { GrowingExample } from "./Examples/Growing";
import { RowExample } from "./Examples/Row";
import { ScrolledExample } from "./Examples/Scrolled";
import { SectionsExample } from "./Examples/Sections";
import { WidthsExample } from "./Examples/Widths";

const EXAMPLES_ROOT = "/src/App/Pages/Accordions/AccordionPage/Examples";

const STARTING_EXTRA_LINES = 0;

export const AccordionPage = () => {
    const multiSignal = createSignal<string[]>(["Shipping"]);
    const singleSignal = createSignal<string[]>([]);
    const requiredSignal = createSignal<string[]>(["Shipping"]);
    const growingSignal = createSignal<string[]>(["Shipping"]);
    const scrolledSignal = createSignal<string[]>([]);
    const deferredSignal = createSignal<string[]>([]);
    const rowSignal = createSignal<string[]>(["Mountains"]);
    const widthsSignal = createSignal<string[]>(["Mountains"]);

    const [getExtraLines, setExtraLines] = createSignal(STARTING_EXTRA_LINES);
    const [getBuilt, setBuilt] = createSignal<string[]>([]);

    const getExamples = createMemo(() => [
        {
            key: "multi",
            name: "Many open at once",
            readout: () => `expanded: ${JSON.stringify(multiSignal[0]())}`,
            component: () => <SectionsExample expanded={multiSignal} />,
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
            readout: () => `expanded: ${JSON.stringify(singleSignal[0]())} — the component keeps at most one`,
            component: () => <SectionsExample expanded={singleSignal} isSingleExpand={true} />,
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "required",
            name: "One at a time, and always one",
            readout: () =>
                `expanded: ${JSON.stringify(requiredSignal[0]())} — pressing the open header does nothing, because the only way out of a section is into another one`,
            component: () => (
                <SectionsExample expanded={requiredSignal} isSingleExpand={true} isExpandRequired={true} />
            ),
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "growing",
            name: "Content that grows while open",
            readout: () => `extra lines: ${getExtraLines()} — the panel follows its content without reopening`,
            component: () => (
                <GrowingExample
                    expanded={growingSignal}
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
                    expanded={deferredSignal}
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
            component: () => <ScrolledExample expanded={scrolledSignal} />,
            path: `${EXAMPLES_ROOT}/Scrolled.tsx`,
        },
        {
            key: "row",
            name: "Side by side",
            span: 2,
            readout: () =>
                `expanded: ${JSON.stringify(rowSignal[0]())} — the panels sit in a row and open in width; the left and right arrows walk the headers, and the new panel's content slides in from the side the person moved toward`,
            component: () => <RowExample expanded={rowSignal} />,
            path: `${EXAMPLES_ROOT}/Row.tsx`,
        },
        {
            key: "widths",
            name: "A width for each panel",
            span: 2,
            readout: () =>
                `expanded: ${JSON.stringify(widthsSignal[0]())} — the row fills the box, and each panel opens to its own share of it; the one without a share takes what is left, and resizing the window keeps the shares`,
            component: () => <WidthsExample expanded={widthsSignal} />,
            path: `${EXAMPLES_ROOT}/Widths.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
