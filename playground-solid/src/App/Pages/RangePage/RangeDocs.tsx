import { createSignal } from "solid-js";

import type { RangeOrientation } from "@thewaver/ss-components-solid";
import { RANGE_DEFAULTS, RANGE_ORIENTATIONS } from "@thewaver/ss-components-solid";
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
    const [getOrientation, setOrientation] = createSignal<RangeOrientation>(RANGE_DEFAULTS.orientation);
    const [getHasError, setHasError] = createSignal(false);
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getMin, setMin] = createSignal(DIFFICULTY_MIN);
    const [getMax, setMax] = createSignal(DIFFICULTY_MAX);
    const [getStep, setStep] = createSignal(DIFFICULTY_STEP);
    const [getIsPairDisabled, setIsPairDisabled] = createSignal(false);
    const [getIsReachableWhenDisabled, setIsReachableWhenDisabled] = createSignal(false);
    const [getIsTooltipDisabled, setIsTooltipDisabled] = createSignal(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"orientation"} {...RangeKnobs.ORIENTATION_TEXT}>
                            <PageSelectField
                                value={getOrientation}
                                values={RANGE_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={(orientation) => setOrientation(() => orientation)}
                            />
                        </PageProp>

                        <PageProp key={"hasError"} {...RangeKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp key={"isDisabled"} {...RangeKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample orientation={getOrientation} hasError={getHasError} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.steppingLimits} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Stepping.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"min"} {...RangeKnobs.MIN_TEXT}>
                            <PageNumberField
                                value={getMin}
                                min={RangeKnobs.MIN_LIMIT}
                                max={RangeKnobs.MAX_LIMIT}
                                step={RangeKnobs.LIMIT_STEP}
                                ariaLabel={"Min"}
                                onInput={setMin}
                            />
                        </PageProp>

                        <PageProp key={"max"} {...RangeKnobs.MAX_TEXT}>
                            <PageNumberField
                                value={getMax}
                                min={RangeKnobs.MIN_LIMIT}
                                max={RangeKnobs.MAX_LIMIT}
                                step={RangeKnobs.LIMIT_STEP}
                                ariaLabel={"Max"}
                                onInput={setMax}
                            />
                        </PageProp>

                        <PageProp key={"step"} {...RangeKnobs.STEP_TEXT}>
                            <PageNumberField
                                value={getStep}
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
                <SteppingDocsExample min={getMin} max={getMax} step={getStep} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.twoThumbs} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Pair.tsx`}
                renderKnobs={() => (
                    <PageProp key={"pairIsDisabled"} {...RangeKnobs.PAIR_IS_DISABLED_TEXT}>
                        <PageCheckField value={getIsPairDisabled} ariaLabel={"Disabled"} onChange={setIsPairDisabled} />
                    </PageProp>
                )}
            >
                <PairDocsExample isDisabled={getIsPairDisabled} />
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
                            key={"tooltipIsReachableWhenDisabled"}
                            {...RangeKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
                        >
                            <PageCheckField
                                value={getIsReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp key={"tooltipIsDisabled"} {...RangeKnobs.IS_DISABLED_TEXT}>
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
