import { createSignal } from "solid-js";

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
                        <PageProp key={"isReadOnly"} {...DateTimePickerKnobs.IS_READ_ONLY_TEXT}>
                            <PageCheckField value={getIsReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp key={"hasError"} {...DateTimePickerKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp key={"isDisabled"} {...DateTimePickerKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isReadOnly={getIsReadOnly} hasError={getHasError} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.twelveHoursSecond} />

            <PageDocsExample
                path={`${DOCS_ROOT}/TwelveHour.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"isTwelveHour"} {...DateTimePickerKnobs.IS_TWELVE_HOUR_TEXT}>
                            <PageCheckField
                                value={getIsTwelveHour}
                                ariaLabel={"Twelve hour"}
                                onChange={setIsTwelveHour}
                            />
                        </PageProp>

                        <PageProp key={"hasSeconds"} {...DateTimePickerKnobs.HAS_SECONDS_TEXT}>
                            <PageCheckField value={getHasSeconds} ariaLabel={"Seconds"} onChange={setHasSeconds} />
                        </PageProp>
                    </>
                )}
            >
                <TwelveHourDocsExample isTwelveHour={getIsTwelveHour} hasSeconds={getHasSeconds} />
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
                            key={"tooltipIsReachableWhenDisabled"}
                            {...DateTimePickerKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
                        >
                            <PageCheckField
                                value={getIsReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp key={"tooltipIsDisabled"} {...DateTimePickerKnobs.IS_DISABLED_TEXT}>
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
        </>
    );
};
