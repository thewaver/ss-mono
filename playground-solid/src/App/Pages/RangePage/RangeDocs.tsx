import { createSignal } from "solid-js";

import type { RangeOrientation } from "@thewaver/ss-components-solid";
import { RANGE_DEFAULTS, RANGE_ORIENTATIONS } from "@thewaver/ss-components-solid";
import { RangeKnobs } from "@thewaver/ss-playground/App/Knobs/Ranges.const";
import {
    DIFFICULTY_MAX,
    DIFFICULTY_MIN,
    DIFFICULTY_STEP,
    DOCS_ROOT,
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
                        <PageProp
                            key={"orientation"}
                            label={"Orientation"}
                            hint={
                                "Whether the track runs across the page or up it. Upright, the lowest value is at the bottom."
                            }
                            controls={"Sets RangeProps.orientation"}
                        >
                            <PageSelectField
                                value={getOrientation}
                                values={RANGE_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={(orientation) => setOrientation(() => orientation)}
                            />
                        </PageProp>

                        <PageProp
                            key={"hasError"}
                            label={"Error"}
                            hint={"Marks the range invalid, for screen readers as well as for the painter."}
                            controls={"Sets RangeProps.hasError"}
                        >
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp
                            key={"isDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the range off: neither dragging nor the arrow keys move it, and the Tab key skips it."
                            }
                            controls={"Sets RangeProps.isDisabled"}
                        >
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample orientation={getOrientation} hasError={getHasError} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection
                title={"Stepping and limits"}
                content={
                    "A thumb sits between [prop]min[/prop] and [prop]max[/prop] and moves in steps of [prop]step[/prop], counted from the minimum. The arrow keys move it one step, Home and End take it to either end, and a drag lands on the same steps."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Stepping.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"min"}
                            label={"Min"}
                            hint={"The lowest value a thumb can take."}
                            controls={"Sets RangeProps.min"}
                        >
                            <PageNumberField
                                value={getMin}
                                min={RangeKnobs.MIN_LIMIT}
                                max={RangeKnobs.MAX_LIMIT}
                                step={RangeKnobs.LIMIT_STEP}
                                ariaLabel={"Min"}
                                onInput={setMin}
                            />
                        </PageProp>

                        <PageProp
                            key={"max"}
                            label={"Max"}
                            hint={"The highest value a thumb can take."}
                            controls={"Sets RangeProps.max"}
                        >
                            <PageNumberField
                                value={getMax}
                                min={RangeKnobs.MIN_LIMIT}
                                max={RangeKnobs.MAX_LIMIT}
                                step={RangeKnobs.LIMIT_STEP}
                                ariaLabel={"Max"}
                                onInput={setMax}
                            />
                        </PageProp>

                        <PageProp
                            key={"step"}
                            label={"Step"}
                            hint={"How far one press of an arrow key moves a thumb, and the spacing a drag snaps to."}
                            controls={"Sets RangeProps.step"}
                        >
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

            <PageDocsSection
                title={"Two thumbs"}
                content={
                    "Hand it [prop]range[/prop], a start and an end, in place of [prop]value[/prop], and it draws two thumbs over one track. Each thumb is a slider of its own, named by its entry in [prop]thumbLabels[/prop] and with its own stop for the Tab key, and neither can pass the other. Turned off, both thumbs leave the tab order."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Pair.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"pairIsDisabled"}
                        label={"Disabled"}
                        hint={"Turns the range off: neither thumb moves, and the Tab key skips both."}
                        controls={"Sets RangeProps.isDisabled"}
                    >
                        <PageCheckField value={getIsPairDisabled} ariaLabel={"Disabled"} onChange={setIsPairDisabled} />
                    </PageProp>
                )}
            >
                <PairDocsExample isDisabled={getIsPairDisabled} />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the track runs from the right: the lowest value is at the right end, so the thumb for the start of the range sits to the right of the one for its end, and the left arrow key raises a thumb's value rather than lowering it."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Read as prices"}
                content={
                    "A screen reader reads a thumb's bare number unless you pass [prop]computeValueText[/prop], which turns a value into the words to read instead, here a price. It is handed the value and which thumb holds it. Separately, [prop]onChangeEnd[/prop] runs once a change is finished, when a drag lets go or after each key press, for work that should not run on every step of a drag."
                }
            />

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

            <PageDocsSection
                title={"Tooltip"}
                content={
                    "Give a range [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the range's description. A disabled range shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and neither the arrow keys nor a drag move it."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"tooltipIsReachableWhenDisabled"}
                            label={"Reachable when disabled"}
                            hint={
                                "Keeps a disabled range's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled range shows no tooltip at all. It only matters while Disabled is on."
                            }
                            controls={"Sets RangeProps.isReachableWhenDisabled"}
                        >
                            <PageCheckField
                                value={getIsReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp
                            key={"tooltipIsDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the range off: neither dragging nor the arrow keys move it, and the Tab key skips it."
                            }
                            controls={"Sets RangeProps.isDisabled"}
                        >
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
