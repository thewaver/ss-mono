import { createMemo, createSignal } from "solid-js";

import { COLLAPSIBLE_DEFAULTS } from "@thewaver/ss-components-solid";
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
    const [getGap, setGap] = createSignal(AccordionKnobs.STARTING_GAP);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(COLLAPSIBLE_DEFAULTS.transitionDurationMs);

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
            component: () => (
                <SectionsExample gap={getGap} transitionDurationMs={getTransitionDurationMs} expanded={multiSignal} />
            ),
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "unheld",
            name: EXAMPLE_NAMES.unheld,
            readout: () =>
                "no signal passed — the accordion keeps which sections are open itself, so the page has nothing to show here",
            component: () => <SectionsExample gap={getGap} transitionDurationMs={getTransitionDurationMs} />,
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "single",
            name: EXAMPLE_NAMES.single,
            readout: () => `expanded: ${JSON.stringify(singleSignal[0]())} — the component keeps at most one`,
            component: () => (
                <SectionsExample
                    gap={getGap}
                    transitionDurationMs={getTransitionDurationMs}
                    expanded={singleSignal}
                    isSingleExpand={true}
                />
            ),
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "required",
            name: EXAMPLE_NAMES.required,
            readout: () =>
                `expanded: ${JSON.stringify(requiredSignal[0]())} — pressing the open header does nothing, because the only way out of a section is into another one`,
            component: () => (
                <SectionsExample
                    gap={getGap}
                    transitionDurationMs={getTransitionDurationMs}
                    expanded={requiredSignal}
                    isSingleExpand={true}
                    isExpandRequired={true}
                />
            ),
            path: `${EXAMPLES_ROOT}/Sections.tsx`,
        },
        {
            key: "growing",
            name: EXAMPLE_NAMES.growing,
            readout: () => `extra lines: ${getExtraLines()} — the panel follows its content without reopening`,
            component: () => (
                <GrowingExample
                    gap={getGap}
                    transitionDurationMs={getTransitionDurationMs}
                    expanded={growingSignal}
                    extraLines={getExtraLines}
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
                `built: ${JSON.stringify(getBuilt())} — a section's content is not in the page until it is opened once, and stays there afterwards`,
            component: () => (
                <DeferredExample
                    gap={getGap}
                    transitionDurationMs={getTransitionDurationMs}
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
            component: () => (
                <ScrolledExample
                    gap={getGap}
                    transitionDurationMs={getTransitionDurationMs}
                    expanded={scrolledSignal}
                />
            ),
            path: `${EXAMPLES_ROOT}/Scrolled.tsx`,
        },
        {
            key: "row",
            name: EXAMPLE_NAMES.row,
            span: 2,
            readout: () =>
                `expanded: ${JSON.stringify(rowSignal[0]())} — the panels sit in a row and open in width; the left and right arrows walk the headers, and the new panel's content slides in from the side the person moved toward`,
            component: () => (
                <RowExample gap={getGap} transitionDurationMs={getTransitionDurationMs} expanded={rowSignal} />
            ),
            path: `${EXAMPLES_ROOT}/Row.tsx`,
        },
    ]);

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"gap"}
                    label={"Gap (px)"}
                    hint={"The space between sections."}
                    controls={"Sets AccordionProps.gap"}
                >
                    <PageNumberField
                        value={getGap}
                        min={AccordionKnobs.MIN_GAP}
                        max={AccordionKnobs.MAX_GAP}
                        step={AccordionKnobs.GAP_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Gap in pixels"}
                        onInput={setGap}
                    />
                </PageProp>

                <PageProp
                    key={"transitionDurationMs"}
                    label={"Transition duration (ms)"}
                    hint={"How long a section takes to open and close. At 0 it opens and closes at once."}
                    controls={"Sets AccordionProps.transitionDurationMs"}
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
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
