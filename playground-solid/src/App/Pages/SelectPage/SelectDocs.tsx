import { createEffect, createSignal, on } from "solid-js";

import { FrameRateMonitorSolidUtils } from "@thewaver/ss-components-solid";
import { SelectKnobs } from "@thewaver/ss-playground/App/Knobs/Selects.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { DOCS_ROOT, STRESS_COUNT_FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/SelectPage/SelectPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { AutocompleteDocsExample } from "./Docs/Autocomplete";
import { AutocompleteOnDemandDocsExample } from "./Docs/AutocompleteOnDemand";
import { BasicDocsExample } from "./Docs/Basic";
import { ClearableDocsExample } from "./Docs/Clearable";
import { DescribedDocsExample } from "./Docs/Described";
import { DisabledOptionsDocsExample } from "./Docs/DisabledOptions";
import { GroupsDocsExample } from "./Docs/Groups";
import { LabeledDocsExample } from "./Docs/Labeled";
import { OnDemandDocsExample } from "./Docs/OnDemand";
import { RecordsDocsExample } from "./Docs/Records";
import { TooltipDocsExample } from "./Docs/Tooltip";
import { VirtualizedDocsExample } from "./Docs/Virtualized";

export const SelectDocs = () => {
    const [getHasError, setHasError] = createSignal(false);
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getHasGroupBoxes, setHasGroupBoxes] = createSignal(true);
    const [getIsReachable, setIsReachable] = createSignal(false);
    const [getCount, setCount] = createSignal(SelectKnobs.STARTING_STRESS_COUNT);
    const [getIsReachableWhenDisabled, setIsReachableWhenDisabled] = createSignal(false);
    const [getIsTooltipDisabled, setIsTooltipDisabled] = createSignal(false);

    const virtualizedVisibility = createSignal(false);
    const [getOpenMs, setOpenMs] = createSignal<number>();

    const { getFrameRate } = FrameRateMonitorSolidUtils.create(() => !virtualizedVisibility[0]());

    createEffect(
        on(
            () => virtualizedVisibility[0](),
            (isOpen) => {
                if (!isOpen) return;

                const startedAt = performance.now();

                requestAnimationFrame(() => requestAnimationFrame(() => setOpenMs(performance.now() - startedAt)));
            },
            { defer: true },
        ),
    );

    const getMeasurement = () => {
        const openMs = getOpenMs();
        const opened = openMs === undefined ? "Not opened yet" : `Opened in ${Math.round(openMs)} ms`;

        return virtualizedVisibility[0]() ? `${opened}, ${getFrameRate().current.toFixed(0)} fps while open` : opened;
    };

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"hasError"}
                            label={"Error"}
                            hint={"Marks the field invalid, for screen readers as well as for the painter."}
                            controls={"Sets SelectProps.hasError"}
                        >
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp
                            key={"isDisabled"}
                            label={"Disabled"}
                            hint={"Turns the field off: it does not open, and the Tab key skips it."}
                            controls={"Sets SelectProps.isDisabled"}
                        >
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample hasError={getHasError} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection title={"Clearing the pick"}>
                {
                    "Give it renderClear and a clear button sits at the end of the field, drawn only while something is picked and reached with the Tab key after the field. It needs clearAriaLabel to name it, and pressing it empties the value and reports the change like any other pick."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Clearable.tsx`}>
                <ClearableDocsExample />
            </PageDocsExample>

            <PageDocsSection title={"Records as values"}>
                {
                    "An option's value can be any record, not only a string. Here each airport is an object, and the field and the options draw whichever of its parts you choose."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Records.tsx`}>
                <RecordsDocsExample />
            </PageDocsExample>

            <PageDocsSection title={"More than a name"}>
                {
                    "An option draws whatever its painter gives it, here a name with a line of detail beneath it, and is still one option to the arrow keys and to typing."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Described.tsx`}>
                <DescribedDocsExample />
            </PageDocsExample>

            <PageDocsSection title={"Groups"}>
                {
                    "Options can sit in groups under headings: a screen reader announces the group, and the arrow keys walk past the headings. A box drawn around each group is optional, through renderGroupBox."
                }
            </PageDocsSection>

            <PageDocsExample
                path={`${DOCS_ROOT}/Groups.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"hasGroupBoxes"}
                        label={"Group boxes"}
                        hint={"Draws a box around each group's heading and options."}
                        controls={"Passes SelectProps.renderGroupBox, or leaves it out"}
                    >
                        <PageCheckField
                            value={getHasGroupBoxes}
                            ariaLabel={"Group boxes"}
                            onChange={setHasGroupBoxes}
                        />
                    </PageProp>
                )}
            >
                <GroupsDocsExample hasGroupBoxes={getHasGroupBoxes} />
            </PageDocsExample>

            <PageDocsSection title={"Disabled options"}>
                {
                    "An option can be disabled: the arrow keys and typing skip it, and it cannot be picked. Kept reachable when disabled, the arrow keys stop on it instead, so a tooltip can say why it is off."
                }
            </PageDocsSection>

            <PageDocsExample
                path={`${DOCS_ROOT}/DisabledOptions.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"isReachable"}
                        label={"Reachable when disabled"}
                        hint={"Lets the arrow keys stop on the disabled options, which then show a tooltip."}
                        controls={"Sets SelectOption.isReachableWhenDisabled on the disabled options"}
                    >
                        <PageCheckField
                            value={getIsReachable}
                            ariaLabel={"Reachable when disabled"}
                            onChange={setIsReachable}
                        />
                    </PageProp>
                )}
            >
                <DisabledOptionsDocsExample isReachable={getIsReachable} />
            </PageDocsExample>

            <PageDocsSection title={"Many options"}>
                {
                    "Give it an estimated option height and only the options in view are built, so a list of a hundred thousand opens about as fast as one of fifty. The line under the field shows how long the list took to open and how smoothly it runs while open."
                }
            </PageDocsSection>

            <PageDocsExample
                path={`${DOCS_ROOT}/Virtualized.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"count"}
                        label={"Option count"}
                        hint={"How many options the list holds. Only the ones in view are built."}
                        controls={"Sets the number of example options sent to SelectProps.options"}
                    >
                        <PageNumberField
                            value={getCount}
                            min={SelectKnobs.MIN_STRESS_COUNT}
                            max={SelectKnobs.MAX_STRESS_COUNT}
                            step={SelectKnobs.STRESS_COUNT_STEP}
                            width={STRESS_COUNT_FIELD_WIDTH}
                            ariaLabel={"Option count"}
                            onInput={(count) => {
                                setCount(count);
                                setOpenMs(undefined);
                            }}
                        />
                    </PageProp>
                )}
            >
                <VirtualizedDocsExample count={getCount} visibility={virtualizedVisibility} />

                <div class={exampleStyles.exampleReadout}>{getMeasurement()}</div>
            </PageDocsExample>

            <PageDocsSection title={"Loaded on demand"}>
                {
                    "While hasMoreOptions is on, nearing the end of the list calls onReachEnd, so options can arrive from a server a batch at a time. The arrow keys stop at the last option held until the next batch lands."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/OnDemand.tsx`}>
                <OnDemandDocsExample />
            </PageDocsExample>

            <PageDocsSection title={"Autocomplete"}>
                {
                    "Give it a query and the field becomes a text box: the reader types to narrow the list. Which options match is yours to decide, so the filtering lives in your code."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Autocomplete.tsx`}>
                <AutocompleteDocsExample />
            </PageDocsExample>

            <PageDocsSection title={"Autocomplete, loaded on demand"}>
                {
                    "The two combine: each change of the query asks the server for its first batch of matches, and nearing the end of the list asks for the next."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/AutocompleteOnDemand.tsx`}>
                <AutocompleteOnDemandDocsExample />
            </PageDocsExample>

            <PageDocsSection title={"Tooltip"}>
                {
                    "Give a field tooltipDefs and it shows a tooltip on hover and on keyboard focus, read by screen readers as the field's description. A disabled field shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and still does not open."
                }
            </PageDocsSection>

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"tooltipIsReachableWhenDisabled"}
                            label={"Reachable when disabled"}
                            hint={
                                "Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on."
                            }
                            controls={"Sets SelectProps.isReachableWhenDisabled"}
                        >
                            <PageCheckField
                                value={getIsReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp
                            key={"tooltipIsDisabled"}
                            label={"Disabled"}
                            hint={"Turns the field off: it does not open, and the Tab key skips it."}
                            controls={"Sets SelectProps.isDisabled"}
                        >
                            <PageCheckField
                                value={getIsTooltipDisabled}
                                ariaLabel={"Disabled"}
                                onChange={setIsTooltipDisabled}
                            />
                        </PageProp>
                    </>
                )}
            >
                <TooltipDocsExample
                    isDisabled={getIsTooltipDisabled}
                    isReachableWhenDisabled={getIsReachableWhenDisabled}
                />
            </PageDocsExample>

            <PageDocsSection title={"Named by a Label"}>
                {
                    "Inside a Label, the field takes its name from the label's text, so it needs no ariaLabel, and pressing the text opens the list."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Labeled.tsx`}>
                <LabeledDocsExample />
            </PageDocsExample>
        </>
    );
};
