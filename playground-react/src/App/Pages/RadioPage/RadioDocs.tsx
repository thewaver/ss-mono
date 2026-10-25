import { useState } from "react";

import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { ArcDocsExample } from "./Docs/Arc";
import { BasicDocsExample } from "./Docs/Basic";
import { DecoratedDocsExample } from "./Docs/Decorated";
import { DisabledOptionDocsExample } from "./Docs/DisabledOption";
import { RatingDocsExample } from "./Docs/Rating";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { SegmentedDocsExample } from "./Docs/Segmented";

export const RadioDocs = () => {
    const [hasError, setHasError] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isReachableWhenDisabled, setIsReachableWhenDisabled] = useState(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"hasError"}
                            label={"Error"}
                            hint={
                                "Marks the group and its radios invalid, for screen readers as well as for the painter."
                            }
                            controls={"Sets RadioGroupProps.hasError and RadioProps.hasError"}
                        >
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp
                            itemKey={"isDisabled"}
                            label={"Disabled"}
                            hint={"Turns every radio off: none can be picked, and the Tab key skips the group."}
                            controls={"Sets RadioProps.isDisabled on every radio"}
                        >
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample hasError={hasError} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the radios run from the right too, and the left arrow moves on to the next one, while up and down keep their meaning."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Segmented"}
                content={
                    "Set [prop]orientation[/prop] to horizontal and the radios sit side by side; [prop]renderSelectionFloater[/prop] then draws a marker that slides to the picked one, which is the look of a segmented control."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Segmented.tsx`}>
                <SegmentedDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"A rating"}
                content={
                    "Any value can stand behind a radio, numbers included, and the painter decides what each one looks like: here the stars fill up to the one under the pointer, or up to the pick."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Rating.tsx`}>
                <RatingDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Bent into an arc"}
                content={
                    "Give the group [prop]computeLayout[/prop] and the radios are placed by a layout instead of laid in a row or a column, here along an arc. The arrow keys still walk them in the order they are written."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Arc.tsx`}>
                <ArcDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Decoration"}
                content={
                    "Anything drawn over a radio goes through [prop]renderDecoration[/prop], which is handed the radio's state like the painter is: here a corner highlight marks the one picked."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Decorated.tsx`}>
                <DecoratedDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"A disabled option"}
                content={
                    "One radio can be off while the rest work: the arrow keys skip it and it cannot be picked. Kept reachable when disabled, the arrow keys stop on it without picking it, so its tooltip can say why it is off."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/DisabledOption.tsx`}
                renderKnobs={() => (
                    <PageProp
                        itemKey={"isReachableWhenDisabled"}
                        label={"Reachable when disabled"}
                        hint={"Lets the arrow keys stop on the disabled radio, which then shows its tooltip."}
                        controls={"Sets RadioProps.isReachableWhenDisabled"}
                    >
                        <PageCheckField
                            value={isReachableWhenDisabled}
                            ariaLabel={"Reachable when disabled"}
                            onChange={setIsReachableWhenDisabled}
                        />
                    </PageProp>
                )}
            >
                <DisabledOptionDocsExample isReachableWhenDisabled={isReachableWhenDisabled} />
            </PageDocsExample>
        </>
    );
};
