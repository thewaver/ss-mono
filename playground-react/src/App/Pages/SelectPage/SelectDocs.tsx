import { useEffect, useRef, useState } from "react";

import { FrameRateMonitorReactUtils } from "@thewaver/ss-components-react";
import { SelectKnobs } from "@thewaver/ss-playground/App/Knobs/Selects.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
    STRESS_COUNT_FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/SelectPage/SelectPage.const";

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
                        <PageProp itemKey={"hasError"} {...SelectKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp itemKey={"isDisabled"} {...SelectKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample hasError={hasError} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.clearingPick} />

            <PageDocsExample path={`${DOCS_ROOT}/Clearable.tsx`}>
                <ClearableDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.recordsValues} />

            <PageDocsExample path={`${DOCS_ROOT}/Records.tsx`}>
                <RecordsDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.moreThanName} />

            <PageDocsExample path={`${DOCS_ROOT}/Described.tsx`}>
                <DescribedDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.groups} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Groups.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"hasGroupBoxes"} {...SelectKnobs.HAS_GROUP_BOXES_TEXT}>
                        <PageCheckField value={hasGroupBoxes} ariaLabel={"Group boxes"} onChange={setHasGroupBoxes} />
                    </PageProp>
                )}
            >
                <GroupsDocsExample hasGroupBoxes={hasGroupBoxes} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.disabledOptions} />

            <PageDocsExample
                path={`${DOCS_ROOT}/DisabledOptions.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"isReachable"} {...SelectKnobs.IS_REACHABLE_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.manyOptions} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Virtualized.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"count"} {...SelectKnobs.COUNT_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.loadedDemand} />

            <PageDocsExample path={`${DOCS_ROOT}/OnDemand.tsx`}>
                <OnDemandDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.autocomplete} />

            <PageDocsExample path={`${DOCS_ROOT}/Autocomplete.tsx`}>
                <AutocompleteDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.autocompleteLoadedDemand} />

            <PageDocsExample path={`${DOCS_ROOT}/AutocompleteOnDemand.tsx`}>
                <AutocompleteOnDemandDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.tooltip} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"tooltipIsReachableWhenDisabled"}
                            {...SelectKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
                        >
                            <PageCheckField
                                value={isReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp itemKey={"tooltipIsDisabled"} {...SelectKnobs.IS_DISABLED_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.namedLabel} />

            <PageDocsExample path={`${DOCS_ROOT}/Labeled.tsx`}>
                <LabeledDocsExample />
            </PageDocsExample>
        </>
    );
};
