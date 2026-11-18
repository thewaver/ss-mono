import { createSignal } from "solid-js";

import { PAGINATOR_DEFAULTS } from "@thewaver/ss-components-solid";
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
    const [getItemCount, setItemCount] = createSignal(PaginatorKnobs.STARTING_ITEM_COUNT);
    const [getPageSize, setPageSize] = createSignal(PaginatorKnobs.STARTING_PAGE_SIZE);
    const [getSiblingCount, setSiblingCount] = createSignal(PAGINATOR_DEFAULTS.siblingCount);
    const [getBoundaryCount, setBoundaryCount] = createSignal(PAGINATOR_DEFAULTS.boundaryCount);
    const [getIsDisabled, setIsDisabled] = createSignal(PaginatorKnobs.STARTING_IS_DISABLED);
    const [getHasLinkComponent, setHasLinkComponent] = createSignal(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"itemCount"} {...PaginatorKnobs.ITEM_COUNT_TEXT}>
                            <PageNumberField
                                value={getItemCount}
                                min={PaginatorKnobs.MIN_ITEM_COUNT}
                                max={PaginatorKnobs.MAX_ITEM_COUNT}
                                step={PaginatorKnobs.COUNT_STEP}
                                width={COUNT_FIELD_WIDTH}
                                ariaLabel={"Item count"}
                                onInput={setItemCount}
                            />
                        </PageProp>

                        <PageProp key={"pageSize"} {...PaginatorKnobs.PAGE_SIZE_TEXT}>
                            <PageNumberField
                                value={getPageSize}
                                min={PaginatorKnobs.MIN_PAGE_SIZE}
                                max={PaginatorKnobs.MAX_PAGE_SIZE}
                                step={PaginatorKnobs.COUNT_STEP}
                                width={COUNT_FIELD_WIDTH}
                                ariaLabel={"Page size"}
                                onInput={setPageSize}
                            />
                        </PageProp>

                        <PageProp key={"siblingCount"} {...PaginatorKnobs.SIBLING_COUNT_TEXT}>
                            <PageNumberField
                                value={getSiblingCount}
                                min={PaginatorKnobs.MIN_COUNT}
                                max={PaginatorKnobs.MAX_COUNT}
                                step={PaginatorKnobs.COUNT_STEP}
                                width={COUNT_FIELD_WIDTH}
                                ariaLabel={"Sibling count"}
                                onInput={setSiblingCount}
                            />
                        </PageProp>

                        <PageProp key={"boundaryCount"} {...PaginatorKnobs.BOUNDARY_COUNT_TEXT}>
                            <PageNumberField
                                value={getBoundaryCount}
                                min={PaginatorKnobs.MIN_COUNT}
                                max={PaginatorKnobs.MAX_COUNT}
                                step={PaginatorKnobs.COUNT_STEP}
                                width={COUNT_FIELD_WIDTH}
                                ariaLabel={"Boundary count"}
                                onInput={setBoundaryCount}
                            />
                        </PageProp>

                        <PageProp key={"isDisabled"} {...PaginatorKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample
                    itemCount={getItemCount}
                    pageSize={getPageSize}
                    siblingCount={getSiblingCount}
                    boundaryCount={getBoundaryCount}
                    isDisabled={getIsDisabled}
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
                    <PageProp key={"hasLinkComponent"} {...PaginatorKnobs.HAS_LINK_COMPONENT_TEXT}>
                        <PageCheckField
                            value={getHasLinkComponent}
                            ariaLabel={"Custom link component"}
                            onChange={setHasLinkComponent}
                        />
                    </PageProp>
                )}
            >
                <LinksDocsExample hasLinkComponent={getHasLinkComponent} />
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
