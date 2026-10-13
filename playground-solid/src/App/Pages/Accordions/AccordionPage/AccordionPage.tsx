import { createMemo, createSignal } from "solid-js";

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
    const multiSignal = createSignal<string[]>(["Shipping"]);
    const singleSignal = createSignal<string[]>([]);
    const requiredSignal = createSignal<string[]>(["Shipping"]);
    const growingSignal = createSignal<string[]>(["Shipping"]);
    const scrolledSignal = createSignal<string[]>([]);
    const deferredSignal = createSignal<string[]>([]);
    const rowSignal = createSignal<string[]>(["Mountains"]);

    const [getExtraLines, setExtraLines] = createSignal(STARTING_EXTRA_LINES);
    const [getBuilt, setBuilt] = createSignal<string[]>([]);

    const getExamples = createMemo(() => [
        {
            key: "multi",
            name: EXAMPLE_NAMES.multi,
            readout: () => `expanded: ${JSON.stringify(multiSignal[0]())}`,
            component: () => <SectionsExample expanded={multiSignal} />,
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
            readout: () => `expanded: ${JSON.stringify(singleSignal[0]())} — the component keeps at most one`,
            component: () => <SectionsExample expanded={singleSignal} isSingleExpand={true} />,
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "required",
            name: EXAMPLE_NAMES.required,
            readout: () =>
                `expanded: ${JSON.stringify(requiredSignal[0]())} — pressing the open header does nothing, because the only way out of a section is into another one`,
            component: () => (
                <SectionsExample expanded={requiredSignal} isSingleExpand={true} isExpandRequired={true} />
            ),
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "growing",
            name: EXAMPLE_NAMES.growing,
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
            name: EXAMPLE_NAMES.deferred,
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
            name: EXAMPLE_NAMES.scrolled,
            readout: () =>
                `expanded: ${JSON.stringify(scrolledSignal[0]())} — opening a section below the fold brings it up`,
            component: () => <ScrolledExample expanded={scrolledSignal} />,
            path: `${EXAMPLES_ROOT}/Scrolled.tsx`,
        },
        {
            key: "row",
            name: EXAMPLE_NAMES.row,
            span: 2,
            readout: () =>
                `expanded: ${JSON.stringify(rowSignal[0]())} — the panels sit in a row and open in width; the left and right arrows walk the headers, and the new panel's content slides in from the side the person moved toward`,
            component: () => <RowExample expanded={rowSignal} />,
            path: `${EXAMPLES_ROOT}/Row.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
