import { useState } from "react";

import type { LabelOrientation } from "@thewaver/ss-components-react";
import { LABEL_DEFAULTS, LABEL_ORIENTATIONS } from "@thewaver/ss-components-react";
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/LabelPage/LabelPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { CaptionFirstDocsExample } from "./Docs/CaptionFirst";
import { LabelPerRadioDocsExample } from "./Docs/LabelPerRadio";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { SuppressedDocsExample } from "./Docs/Suppressed";

export const LabelDocs = () => {
    const [orientation, setOrientation] = useState<LabelOrientation>(LABEL_DEFAULTS.orientation);
    const [isDisabled, setIsDisabled] = useState(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"orientation"}
                            label={"Orientation"}
                            hint={
                                "Whether the caption and the checkbox sit side by side or one above the other, in the order they are written."
                            }
                            controls={"Sets LabelProps.orientation"}
                        >
                            <PageSelectField
                                value={orientation}
                                values={LABEL_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={setOrientation}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"isDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the checkbox off: pressing it or its caption changes nothing, and the Tab key skips it."
                            }
                            controls={"Sets CheckboxProps.isDisabled on the checkbox inside the label"}
                        >
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample orientation={orientation} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the label lays its children out from the right, so the checkbox, written first, sits to the right of its caption."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"The caption first"}
                content={
                    "The caption and the control sit in the order they are written, so a caption written first comes before the control, as is usual beside a switch. Pressing the caption still flips it."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/CaptionFirst.tsx`}>
                <CaptionFirstDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"One label per radio"}
                content={
                    "A label names one control, so in a radio group each radio gets a label of its own. The group as a whole is named through its own [prop]ariaLabel[/prop], since a caption wrapped round the whole group would name only the first radio, and pressing it would pick that one."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/LabelPerRadio.tsx`}>
                <LabelPerRadioDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"The caption wins"}
                content={
                    'Inside a label, the caption is the control\'s name. A control also given an [prop]ariaLabel[/prop] drops it and warns in the console during development, since a screen reader would otherwise announce words that are not on screen, which fails [wcag id="2.5.3"]WCAG 2.5.3[/wcag]. This checkbox was given "Announced as something else", and is still announced as its caption.'
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Suppressed.tsx`}>
                <SuppressedDocsExample />
            </PageDocsExample>
        </>
    );
};
