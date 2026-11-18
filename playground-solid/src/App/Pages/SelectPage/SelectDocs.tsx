import { createEffect, createSignal, on } from "solid-js";

import { FrameRateMonitorSolidUtils } from "@thewaver/ss-components-solid";
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
                        <PageProp key={"hasError"} {...SelectKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp key={"isDisabled"} {...SelectKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample hasError={getHasError} isDisabled={getIsDisabled} />
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
                    <PageProp key={"hasGroupBoxes"} {...SelectKnobs.HAS_GROUP_BOXES_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.disabledOptions} />

            <PageDocsExample
                path={`${DOCS_ROOT}/DisabledOptions.tsx`}
                renderKnobs={() => (
                    <PageProp key={"isReachable"} {...SelectKnobs.IS_REACHABLE_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.manyOptions} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Virtualized.tsx`}
                renderKnobs={() => (
                    <PageProp key={"count"} {...SelectKnobs.COUNT_TEXT}>
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

                <div class={exampleStyles.exampleReadout} data-readout>
                    {getMeasurement()}
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
                            key={"tooltipIsReachableWhenDisabled"}
                            {...SelectKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
                        >
                            <PageCheckField
                                value={getIsReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp key={"tooltipIsDisabled"} {...SelectKnobs.IS_DISABLED_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.namedLabel} />

            <PageDocsExample path={`${DOCS_ROOT}/Labeled.tsx`}>
                <LabeledDocsExample />
            </PageDocsExample>
        </>
    );
};
