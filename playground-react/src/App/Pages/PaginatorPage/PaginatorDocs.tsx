import { useState } from "react";

import { PAGINATOR_DEFAULTS } from "@thewaver/ss-components-react";
import { PaginatorKnobs } from "@thewaver/ss-playground/App/Knobs/Paginators.const";
import {
    COUNT_FIELD_WIDTH,
    DOCS_ROOT,
    DOCS_SECTIONS,
} from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { CountDocsExample } from "./Docs/Count";
import { DialDocsExample } from "./Docs/Dial";
import { EndsDocsExample } from "./Docs/Ends";
import { JumpDocsExample } from "./Docs/Jump";
import { LinksDocsExample } from "./Docs/Links";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";

export const PaginatorDocs = () => {
    const [itemCount, setItemCount] = useState(PaginatorKnobs.STARTING_ITEM_COUNT);
    const [pageSize, setPageSize] = useState(PaginatorKnobs.STARTING_PAGE_SIZE);
    const [siblingCount, setSiblingCount] = useState(PAGINATOR_DEFAULTS.siblingCount);
    const [boundaryCount, setBoundaryCount] = useState(PAGINATOR_DEFAULTS.boundaryCount);
    const [isDisabled, setIsDisabled] = useState(PaginatorKnobs.STARTING_IS_DISABLED);
    const [hasLinkComponent, setHasLinkComponent] = useState(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"itemCount"} {...PaginatorKnobs.ITEM_COUNT_TEXT}>
                            <PageNumberField
                                value={itemCount}
                                min={PaginatorKnobs.MIN_ITEM_COUNT}
                                max={PaginatorKnobs.MAX_ITEM_COUNT}
                                step={PaginatorKnobs.COUNT_STEP}
                                width={COUNT_FIELD_WIDTH}
                                ariaLabel={"Item count"}
                                onInput={setItemCount}
                            />
                        </PageProp>

                        <PageProp itemKey={"pageSize"} {...PaginatorKnobs.PAGE_SIZE_TEXT}>
                            <PageNumberField
                                value={pageSize}
                                min={PaginatorKnobs.MIN_PAGE_SIZE}
                                max={PaginatorKnobs.MAX_PAGE_SIZE}
                                step={PaginatorKnobs.COUNT_STEP}
                                width={COUNT_FIELD_WIDTH}
                                ariaLabel={"Page size"}
                                onInput={setPageSize}
                            />
                        </PageProp>

                        <PageProp itemKey={"siblingCount"} {...PaginatorKnobs.SIBLING_COUNT_TEXT}>
                            <PageNumberField
                                value={siblingCount}
                                min={PaginatorKnobs.MIN_COUNT}
                                max={PaginatorKnobs.MAX_COUNT}
                                step={PaginatorKnobs.COUNT_STEP}
                                width={COUNT_FIELD_WIDTH}
                                ariaLabel={"Sibling count"}
                                onInput={setSiblingCount}
                            />
                        </PageProp>

                        <PageProp itemKey={"boundaryCount"} {...PaginatorKnobs.BOUNDARY_COUNT_TEXT}>
                            <PageNumberField
                                value={boundaryCount}
                                min={PaginatorKnobs.MIN_COUNT}
                                max={PaginatorKnobs.MAX_COUNT}
                                step={PaginatorKnobs.COUNT_STEP}
                                width={COUNT_FIELD_WIDTH}
                                ariaLabel={"Boundary count"}
                                onInput={setBoundaryCount}
                            />
                        </PageProp>

                        <PageProp itemKey={"isDisabled"} {...PaginatorKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample
                    itemCount={itemCount}
                    pageSize={pageSize}
                    siblingCount={siblingCount}
                    boundaryCount={boundaryCount}
                    isDisabled={isDisabled}
                />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.jumpsEitherEnd} />

            <PageDocsExample path={`${DOCS_ROOT}/Ends.tsx`}>
                <EndsDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.pagesThatAreLinks} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Links.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"hasLinkComponent"} {...PaginatorKnobs.HAS_LINK_COMPONENT_TEXT}>
                        <PageCheckField
                            value={hasLinkComponent}
                            ariaLabel={"Custom link component"}
                            onChange={setHasLinkComponent}
                        />
                    </PageProp>
                )}
            >
                <LinksDocsExample hasLinkComponent={hasLinkComponent} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.arrowsCountBetween} />

            <PageDocsExample path={`${DOCS_ROOT}/Count.tsx`}>
                <CountDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.goPageField} />

            <PageDocsExample path={`${DOCS_ROOT}/Jump.tsx`}>
                <JumpDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.roundHalfDial} />

            <PageDocsExample path={`${DOCS_ROOT}/Dial.tsx`}>
                <DialDocsExample />
            </PageDocsExample>
        </>
    );
};
