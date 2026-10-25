import { useEffect, useRef, useState } from "react";

import { FrameRateMonitorReactUtils } from "@thewaver/ss-components-react";
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
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { TooltipDocsExample } from "./Docs/Tooltip";
import { VirtualizedDocsExample } from "./Docs/Virtualized";

export const SelectDocs = () => {
    const [hasError, setHasError] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [hasGroupBoxes, setHasGroupBoxes] = useState(true);
    const [isReachable, setIsReachable] = useState(false);
    const [count, setCount] = useState(SelectKnobs.STARTING_STRESS_COUNT);
    const [isReachableWhenDisabled, setIsReachableWhenDisabled] = useState(false);
    const [isTooltipDisabled, setIsTooltipDisabled] = useState(false);

    const [isVirtualizedOpen, setIsVirtualizedOpen] = useState(false);
    const [openMs, setOpenMs] = useState<number>();

    const openedAtRef = useRef(0);

    const frameRate = FrameRateMonitorReactUtils.useFrameRate(!isVirtualizedOpen);

    const virtualizedVisibility = [
        isVirtualizedOpen,
        (isOpen: boolean) => {
            if (isOpen && !isVirtualizedOpen) openedAtRef.current = performance.now();

            setIsVirtualizedOpen(isOpen);
        },
    ] as const;

    useEffect(() => {
        if (!isVirtualizedOpen) return;

        const startedAt = openedAtRef.current;

        let frame = requestAnimationFrame(() => {
            frame = requestAnimationFrame(() => setOpenMs(performance.now() - startedAt));
        });

        return () => cancelAnimationFrame(frame);
    }, [isVirtualizedOpen]);

    const opened = openMs === undefined ? "Not opened yet" : `Opened in ${Math.round(openMs)} ms`;
    const measurement = isVirtualizedOpen ? `${opened}, ${frameRate.current.toFixed(0)} fps while open` : opened;

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"hasError"}
                            label={"Error"}
                            hint={"Marks the field invalid, for screen readers as well as for the painter."}
                            controls={"Sets SelectProps.hasError"}
                        >
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp
                            itemKey={"isDisabled"}
                            label={"Disabled"}
                            hint={"Turns the field off: it does not open, and the Tab key skips it."}
                            controls={"Sets SelectProps.isDisabled"}
                        >
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample hasError={hasError} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the pick starts from the right of the field, and the arrow and the clear button sit at its left end."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Clearing the pick"}
                content={
                    "Give it [prop]renderClear[/prop] and a clear button sits at the end of the field, drawn only while something is picked and reached with the Tab key after the field. It needs [prop]clearAriaLabel[/prop] to name it, and pressing it empties the value and reports the change like any other pick."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Clearable.tsx`}>
                <ClearableDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Records as values"}
                content={
                    "An option's value can be any record, not only a string. Here each airport is an object, and the field and the options draw whichever of its parts you choose."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Records.tsx`}>
                <RecordsDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"More than a name"}
                content={
                    "An option draws whatever its painter gives it, here a name with a line of detail beneath it, and is still one option to the arrow keys and to typing."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Described.tsx`}>
                <DescribedDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Groups"}
                content={
                    "Options can sit in groups under headings: a screen reader announces the group, and the arrow keys walk past the headings. A box drawn around each group is optional, through [prop]renderGroupBox[/prop]."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Groups.tsx`}
                renderKnobs={() => (
                    <PageProp
                        itemKey={"hasGroupBoxes"}
                        label={"Group boxes"}
                        hint={"Draws a box around each group's heading and options."}
                        controls={"Passes SelectProps.renderGroupBox, or leaves it out"}
                    >
                        <PageCheckField value={hasGroupBoxes} ariaLabel={"Group boxes"} onChange={setHasGroupBoxes} />
                    </PageProp>
                )}
            >
                <GroupsDocsExample hasGroupBoxes={hasGroupBoxes} />
            </PageDocsExample>

            <PageDocsSection
                title={"Disabled options"}
                content={
                    "An option can be disabled: the arrow keys and typing skip it, and it cannot be picked. Kept reachable when disabled, the arrow keys stop on it instead, so a tooltip can say why it is off."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/DisabledOptions.tsx`}
                renderKnobs={() => (
                    <PageProp
                        itemKey={"isReachable"}
                        label={"Reachable when disabled"}
                        hint={"Lets the arrow keys stop on the disabled options, which then show a tooltip."}
                        controls={"Sets SelectOption.isReachableWhenDisabled on the disabled options"}
                    >
                        <PageCheckField
                            value={isReachable}
                            ariaLabel={"Reachable when disabled"}
                            onChange={setIsReachable}
                        />
                    </PageProp>
                )}
            >
                <DisabledOptionsDocsExample isReachable={isReachable} />
            </PageDocsExample>

            <PageDocsSection
                title={"Many options"}
                content={
                    "Give it an estimated option height and only the options in view are built, so a list of a hundred thousand opens about as fast as one of fifty. The line under the field shows how long the list took to open and how smoothly it runs while open."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Virtualized.tsx`}
                renderKnobs={() => (
                    <PageProp
                        itemKey={"count"}
                        label={"Option count"}
                        hint={"How many options the list holds. Only the ones in view are built."}
                        controls={"Sets the number of example options sent to SelectProps.options"}
                    >
                        <PageNumberField
                            value={count}
                            min={SelectKnobs.MIN_STRESS_COUNT}
                            max={SelectKnobs.MAX_STRESS_COUNT}
                            step={SelectKnobs.STRESS_COUNT_STEP}
                            width={STRESS_COUNT_FIELD_WIDTH}
                            ariaLabel={"Option count"}
                            onInput={(next) => {
                                setCount(next);
                                setOpenMs(undefined);
                            }}
                        />
                    </PageProp>
                )}
            >
                <VirtualizedDocsExample count={count} visibility={virtualizedVisibility} />

                <div className={exampleStyles.exampleReadout} data-readout>
                    {measurement}
                </div>
            </PageDocsExample>

            <PageDocsSection
                title={"Loaded on demand"}
                content={
                    "While [prop]hasMoreOptions[/prop] is on, nearing the end of the list calls [prop]onReachEnd[/prop], so options can arrive from a server a batch at a time. The arrow keys stop at the last option held until the next batch lands."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/OnDemand.tsx`}>
                <OnDemandDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Autocomplete"}
                content={
                    "Give it a [prop]query[/prop] and the field becomes a text box: the reader types to narrow the list. Which options match is yours to decide, so the filtering lives in your code."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Autocomplete.tsx`}>
                <AutocompleteDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Autocomplete, loaded on demand"}
                content={
                    "The two combine: each change of the query asks the server for its first batch of matches, and nearing the end of the list asks for the next."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/AutocompleteOnDemand.tsx`}>
                <AutocompleteOnDemandDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Tooltip"}
                content={
                    "Give a field [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the field's description. A disabled field shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and still does not open."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"tooltipIsReachableWhenDisabled"}
                            label={"Reachable when disabled"}
                            hint={
                                "Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on."
                            }
                            controls={"Sets SelectProps.isReachableWhenDisabled"}
                        >
                            <PageCheckField
                                value={isReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"tooltipIsDisabled"}
                            label={"Disabled"}
                            hint={"Turns the field off: it does not open, and the Tab key skips it."}
                            controls={"Sets SelectProps.isDisabled"}
                        >
                            <PageCheckField
                                value={isTooltipDisabled}
                                ariaLabel={"Disabled"}
                                onChange={setIsTooltipDisabled}
                            />
                        </PageProp>
                    </>
                )}
            >
                <TooltipDocsExample isDisabled={isTooltipDisabled} isReachableWhenDisabled={isReachableWhenDisabled} />
            </PageDocsExample>

            <PageDocsSection
                title={"Named by a Label"}
                content={
                    "Inside a Label, the field takes its name from the label's text, so it needs no [prop]ariaLabel[/prop], and pressing the text opens the list."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Labeled.tsx`}>
                <LabeledDocsExample />
            </PageDocsExample>
        </>
    );
};
