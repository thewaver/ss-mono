import { useState } from "react";

import { RadioKnobs } from "@thewaver/ss-playground/App/Knobs/Radios.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

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
                        <PageProp itemKey={"hasError"} {...RadioKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp itemKey={"isDisabled"} {...RadioKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample hasError={hasError} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.segmented} />

            <PageDocsExample path={`${DOCS_ROOT}/Segmented.tsx`}>
                <SegmentedDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rating} />

            <PageDocsExample path={`${DOCS_ROOT}/Rating.tsx`}>
                <RatingDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.bentIntoArc} />

            <PageDocsExample path={`${DOCS_ROOT}/Arc.tsx`}>
                <ArcDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.decoration} />

            <PageDocsExample path={`${DOCS_ROOT}/Decorated.tsx`}>
                <DecoratedDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.disabledOption} />

            <PageDocsExample
                path={`${DOCS_ROOT}/DisabledOption.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"isReachableWhenDisabled"} {...RadioKnobs.IS_REACHABLE_WHEN_DISABLED_TEXT}>
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
