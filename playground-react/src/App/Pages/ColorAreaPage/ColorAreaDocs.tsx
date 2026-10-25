import { useState } from "react";

import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/ColorAreaPage/ColorAreaPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { PickerDocsExample } from "./Docs/Picker";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";

export const ColorAreaDocs = () => {
    const [isDisabled, setIsDisabled] = useState(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <PageProp
                        itemKey={"isDisabled"}
                        label={"Disabled"}
                        hint={
                            "Turns the square off: neither a press, a drag nor the arrow keys move it, and the Tab key skips both of its sliders."
                        }
                        controls={"Sets ColorAreaProps.isDisabled"}
                    >
                        <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                    </PageProp>
                )}
            >
                <BasicDocsExample isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the square stays as it is. It is a picture of color rather than text, so saturation still grows to the right and brightness upward, and the right arrow still moves the handle right, as it does on screen."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"A picker built around it"}
                content={
                    "The square moves saturation and brightness and nothing else, so a picker adds the rest around it. Here a button opens a dialog holding the square, a Range for the hue and a field for each channel, all reading and writing one [prop]hsv[/prop] signal. The button says what it opens through [prop]ariaHasPopup[/prop] and whether it is open through [prop]ariaExpanded[/prop], so a screen reader hears both before and after the press. ColorInput is this picker ready-made."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Picker.tsx`}>
                <PickerDocsExample />
            </PageDocsExample>
        </>
    );
};
