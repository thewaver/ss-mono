import { createSignal } from "solid-js";

import { TimeInputKnobs } from "@thewaver/ss-playground/App/Knobs/TimeInputs.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/TimeInputPage/TimeInputPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { LabeledDocsExample } from "./Docs/Labeled";
import { LimitsDocsExample } from "./Docs/Limits";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { SecondsDocsExample } from "./Docs/Seconds";
import { TooltipDocsExample } from "./Docs/Tooltip";
import { TwelveHourDocsExample } from "./Docs/TwelveHour";

export const TimeInputDocs = () => {
    const [getIsReadOnly, setIsReadOnly] = createSignal(false);
    const [getHasError, setHasError] = createSignal(false);
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getIsTwelveHour, setIsTwelveHour] = createSignal(true);
    const [getHasSeconds, setHasSeconds] = createSignal(true);
    const [getIsReachableWhenDisabled, setIsReachableWhenDisabled] = createSignal(false);
    const [getIsTooltipDisabled, setIsTooltipDisabled] = createSignal(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"isReadOnly"} {...TimeInputKnobs.IS_READ_ONLY_TEXT}>
                            <PageCheckField value={getIsReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp key={"hasError"} {...TimeInputKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp key={"isDisabled"} {...TimeInputKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isReadOnly={getIsReadOnly} hasError={getHasError} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.twelveHours} />

            <PageDocsExample
                path={`${DOCS_ROOT}/TwelveHour.tsx`}
                renderKnobs={() => (
                    <PageProp key={"isTwelveHour"} {...TimeInputKnobs.IS_TWELVE_HOUR_TEXT}>
                        <PageCheckField value={getIsTwelveHour} ariaLabel={"Twelve hour"} onChange={setIsTwelveHour} />
                    </PageProp>
                )}
            >
                <TwelveHourDocsExample isTwelveHour={getIsTwelveHour} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.second} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Seconds.tsx`}
                renderKnobs={() => (
                    <PageProp key={"hasSeconds"} {...TimeInputKnobs.HAS_SECONDS_TEXT}>
                        <PageCheckField value={getHasSeconds} ariaLabel={"Seconds"} onChange={setHasSeconds} />
                    </PageProp>
                )}
            >
                <SecondsDocsExample hasSeconds={getHasSeconds} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.withinOpeningHours} />

            <PageDocsExample path={`${DOCS_ROOT}/Limits.tsx`}>
                <LimitsDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.tooltip} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"tooltipIsReachableWhenDisabled"}
                            {...TimeInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
                        >
                            <PageCheckField
                                value={getIsReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp key={"tooltipIsDisabled"} {...TimeInputKnobs.IS_DISABLED_TEXT}>
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
