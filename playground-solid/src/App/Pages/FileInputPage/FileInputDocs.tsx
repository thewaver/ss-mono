import { createSignal } from "solid-js";

import { FileInputKnobs } from "@thewaver/ss-playground/App/Knobs/FileInputs.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/FileInputPage/FileInputPage.const";

import { PageDocsAlert } from "../../PageComponents/DocsAlert/DocsAlert";
import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { DropZoneDocsExample } from "./Docs/DropZone";
import { ImagesDocsExample } from "./Docs/Images";
import { LabeledDocsExample } from "./Docs/Labeled";
import { MultipleDocsExample } from "./Docs/Multiple";
import { RefusingDocsExample } from "./Docs/Refusing";
import { TooltipDocsExample } from "./Docs/Tooltip";

export const FileInputDocs = () => {
    const [getHasError, setHasError] = createSignal(false);
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getDropZoneHasError, setDropZoneHasError] = createSignal(false);
    const [getDropZoneIsDisabled, setDropZoneIsDisabled] = createSignal(false);
    const [getIsReachableWhenDisabled, setIsReachableWhenDisabled] = createSignal(false);
    const [getIsTooltipDisabled, setIsTooltipDisabled] = createSignal(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"hasError"} {...FileInputKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp key={"isDisabled"} {...FileInputKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample hasError={getHasError} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.severalFiles} />

            <PageDocsExample path={`${DOCS_ROOT}/Multiple.tsx`}>
                <MultipleDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.someFileKindsOnly} />

            <PageDocsExample path={`${DOCS_ROOT}/Images.tsx`}>
                <ImagesDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.refusingPick} />

            <PageDocsExample path={`${DOCS_ROOT}/Refusing.tsx`}>
                <RefusingDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.droppingFilesWithinLimits} />

            <PageDocsAlert severity={"alert"}>
                Keep the control pressable, and say so in what it shows. A drop is a drag, which not everyone can make,
                so pressing the control to open the dialog must reach the same files (
                <a href={WCAG_URLS["2.5.7"]}>WCAG 2.5.7</a>). Never cover the control with a drop area, or paint it as a
                place to drop alone.
            </PageDocsAlert>

            <PageDocsExample
                path={`${DOCS_ROOT}/DropZone.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"dropZoneHasError"} {...FileInputKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField
                                value={getDropZoneHasError}
                                ariaLabel={"Error"}
                                onChange={setDropZoneHasError}
                            />
                        </PageProp>

                        <PageProp key={"dropZoneIsDisabled"} {...FileInputKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField
                                value={getDropZoneIsDisabled}
                                ariaLabel={"Disabled"}
                                onChange={setDropZoneIsDisabled}
                            />
                        </PageProp>
                    </>
                )}
            >
                <DropZoneDocsExample hasError={getDropZoneHasError} isDisabled={getDropZoneIsDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.tooltip} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"tooltipIsReachableWhenDisabled"}
                            {...FileInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
                        >
                            <PageCheckField
                                value={getIsReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp key={"tooltipIsDisabled"} {...FileInputKnobs.IS_DISABLED_TEXT}>
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
