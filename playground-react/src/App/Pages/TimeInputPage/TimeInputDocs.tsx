import { useState } from "react";

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
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isTwelveHour, setIsTwelveHour] = useState(true);
    const [hasSeconds, setHasSeconds] = useState(true);
    const [isReachableWhenDisabled, setIsReachableWhenDisabled] = useState(false);
    const [isTooltipDisabled, setIsTooltipDisabled] = useState(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"isReadOnly"} {...TimeInputKnobs.IS_READ_ONLY_TEXT}>
                            <PageCheckField value={isReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp itemKey={"hasError"} {...TimeInputKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp itemKey={"isDisabled"} {...TimeInputKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isReadOnly={isReadOnly} hasError={hasError} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.twelveHours} />

            <PageDocsExample
                path={`${DOCS_ROOT}/TwelveHour.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"isTwelveHour"} {...TimeInputKnobs.IS_TWELVE_HOUR_TEXT}>
                        <PageCheckField value={isTwelveHour} ariaLabel={"Twelve hour"} onChange={setIsTwelveHour} />
                    </PageProp>
                )}
            >
                <TwelveHourDocsExample isTwelveHour={isTwelveHour} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.second} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Seconds.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"hasSeconds"} {...TimeInputKnobs.HAS_SECONDS_TEXT}>
                        <PageCheckField value={hasSeconds} ariaLabel={"Seconds"} onChange={setHasSeconds} />
                    </PageProp>
                )}
            >
                <SecondsDocsExample hasSeconds={hasSeconds} />
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
                            itemKey={"tooltipIsReachableWhenDisabled"}
                            {...TimeInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
                        >
                            <PageCheckField
                                value={isReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp itemKey={"tooltipIsDisabled"} {...TimeInputKnobs.IS_DISABLED_TEXT}>
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
