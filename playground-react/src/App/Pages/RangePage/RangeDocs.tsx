import { useState } from "react";

import type { RangeOrientation } from "@thewaver/ss-components-react";
import { RANGE_DEFAULTS, RANGE_ORIENTATIONS } from "@thewaver/ss-components-react";
import { RangeKnobs } from "@thewaver/ss-playground/App/Knobs/Ranges.const";
import {
    DIFFICULTY_MAX,
    DIFFICULTY_MIN,
    DIFFICULTY_STEP,
    DOCS_ROOT,
    DOCS_SECTIONS,
} from "@thewaver/ss-playground/App/Pages/RangePage/RangePage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { KnobDocsExample } from "./Docs/Knob";
import { PairDocsExample } from "./Docs/Pair";
import { PricesDocsExample } from "./Docs/Prices";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { SteppingDocsExample } from "./Docs/Stepping";
import { TooltipDocsExample } from "./Docs/Tooltip";

export const RangeDocs = () => {
    const [orientation, setOrientation] = useState<RangeOrientation>(RANGE_DEFAULTS.orientation);
    const [hasError, setHasError] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [min, setMin] = useState(DIFFICULTY_MIN);
    const [max, setMax] = useState(DIFFICULTY_MAX);
    const [step, setStep] = useState(DIFFICULTY_STEP);
    const [isPairDisabled, setIsPairDisabled] = useState(false);
    const [isReachableWhenDisabled, setIsReachableWhenDisabled] = useState(false);
    const [isTooltipDisabled, setIsTooltipDisabled] = useState(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"orientation"} {...RangeKnobs.ORIENTATION_TEXT}>
                            <PageSelectField
                                value={orientation}
                                values={RANGE_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={setOrientation}
                            />
                        </PageProp>

                        <PageProp itemKey={"hasError"} {...RangeKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp itemKey={"isDisabled"} {...RangeKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample orientation={orientation} hasError={hasError} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.steppingLimits} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Stepping.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"min"} {...RangeKnobs.MIN_TEXT}>
                            <PageNumberField
                                value={min}
                                min={RangeKnobs.MIN_LIMIT}
                                max={RangeKnobs.MAX_LIMIT}
                                step={RangeKnobs.LIMIT_STEP}
                                ariaLabel={"Min"}
                                onInput={setMin}
                            />
                        </PageProp>

                        <PageProp itemKey={"max"} {...RangeKnobs.MAX_TEXT}>
                            <PageNumberField
                                value={max}
                                min={RangeKnobs.MIN_LIMIT}
                                max={RangeKnobs.MAX_LIMIT}
                                step={RangeKnobs.LIMIT_STEP}
                                ariaLabel={"Max"}
                                onInput={setMax}
                            />
                        </PageProp>

                        <PageProp itemKey={"step"} {...RangeKnobs.STEP_TEXT}>
                            <PageNumberField
                                value={step}
                                min={RangeKnobs.MIN_STEP}
                                max={RangeKnobs.MAX_STEP}
                                step={RangeKnobs.STEP_STEP}
                                ariaLabel={"Step"}
                                onInput={setStep}
                            />
                        </PageProp>
                    </>
                )}
            >
                <SteppingDocsExample min={min} max={max} step={step} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.twoThumbs} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Pair.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"pairIsDisabled"} {...RangeKnobs.PAIR_IS_DISABLED_TEXT}>
                        <PageCheckField value={isPairDisabled} ariaLabel={"Disabled"} onChange={setIsPairDisabled} />
                    </PageProp>
                )}
            >
                <PairDocsExample isDisabled={isPairDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.readPrices} />

            <PageDocsExample path={`${DOCS_ROOT}/Prices.tsx`}>
                <PricesDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Drawn as a knob"}
                content={
                    'Pass [prop]computeValueAtPoint[/prop] and the range follows the pointer itself, asking that function which value a point on the control stands for. RangeUtils.computeAngularValue answers by the point\'s angle round the center, which turns the slider into a knob. A press sets the value at once, so turning it never needs a drag ([wcag id="2.5.7"]WCAG 2.5.7[/wcag]), and the arrow keys still step it.'
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Knob.tsx`}>
                <KnobDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.tooltip} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"tooltipIsReachableWhenDisabled"}
                            {...RangeKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
                        >
                            <PageCheckField
                                value={isReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp itemKey={"tooltipIsDisabled"} {...RangeKnobs.IS_DISABLED_TEXT}>
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
