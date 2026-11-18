import { useState } from "react";

import { DateTimePickerKnobs } from "@thewaver/ss-playground/App/Knobs/DateTimePickers.const";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
} from "@thewaver/ss-playground/App/Pages/DateTimePickerPage/DateTimePickerPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { PairedDocsExample } from "./Docs/Paired";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { TooltipDocsExample } from "./Docs/Tooltip";
import { TwelveHourDocsExample } from "./Docs/TwelveHour";

export const DateTimePickerDocs = () => {
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
                        <PageProp itemKey={"isReadOnly"} {...DateTimePickerKnobs.IS_READ_ONLY_TEXT}>
                            <PageCheckField value={isReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp itemKey={"hasError"} {...DateTimePickerKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp itemKey={"isDisabled"} {...DateTimePickerKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isReadOnly={isReadOnly} hasError={hasError} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.twelveHoursSecond} />

            <PageDocsExample
                path={`${DOCS_ROOT}/TwelveHour.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"isTwelveHour"} {...DateTimePickerKnobs.IS_TWELVE_HOUR_TEXT}>
                            <PageCheckField value={isTwelveHour} ariaLabel={"Twelve hour"} onChange={setIsTwelveHour} />
                        </PageProp>

                        <PageProp itemKey={"hasSeconds"} {...DateTimePickerKnobs.HAS_SECONDS_TEXT}>
                            <PageCheckField value={hasSeconds} ariaLabel={"Seconds"} onChange={setHasSeconds} />
                        </PageProp>
                    </>
                )}
            >
                <TwelveHourDocsExample isTwelveHour={isTwelveHour} hasSeconds={hasSeconds} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.twoFieldsOfYourOwn} />

            <PageDocsExample path={`${DOCS_ROOT}/Paired.tsx`}>
                <PairedDocsExample />
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
                            {...DateTimePickerKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
                        >
                            <PageCheckField
                                value={isReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp itemKey={"tooltipIsDisabled"} {...DateTimePickerKnobs.IS_DISABLED_TEXT}>
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
        </>
    );
};
