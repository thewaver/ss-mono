import { useState } from "react";

import type { LabelOrientation } from "@thewaver/ss-components-react";
import { LABEL_DEFAULTS, LABEL_ORIENTATIONS } from "@thewaver/ss-components-react";
import { LabelKnobs } from "@thewaver/ss-playground/App/Knobs/Labels.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/LabelPage/LabelPage.const";

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
                        <PageProp itemKey={"orientation"} {...LabelKnobs.ORIENTATION_TEXT}>
                            <PageSelectField
                                value={orientation}
                                values={LABEL_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={setOrientation}
                            />
                        </PageProp>

                        <PageProp itemKey={"isDisabled"} {...LabelKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample orientation={orientation} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.captionFirst} />

            <PageDocsExample path={`${DOCS_ROOT}/CaptionFirst.tsx`}>
                <CaptionFirstDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.oneLabelPerRadio} />

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
