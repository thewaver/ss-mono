import { useState } from "react";

import { PAGINATOR_DEFAULTS } from "@thewaver/ss-components-react";
import { PaginatorKnobs } from "@thewaver/ss-playground/App/Knobs/Paginators.const";
import { COUNT_FIELD_WIDTH, DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.const";

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
                        <PageProp
                            itemKey={"itemCount"}
                            label={"Item count"}
                            hint={
                                "How many items there are to page through. The page count is worked out from this and the page size."
                            }
                            controls={"Sets PaginatorProps.itemCount"}
                        >
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

                        <PageProp
                            itemKey={"pageSize"}
                            label={"Page size"}
                            hint={"How many items one page holds. The last page holds whatever is left over."}
                            controls={"Sets PaginatorProps.pageSize"}
                        >
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

                        <PageProp
                            itemKey={"siblingCount"}
                            label={"Sibling count"}
                            hint={
                                "How many pages are shown on each side of the current one before the run is broken by a gap."
                            }
                            controls={"Sets PaginatorProps.siblingCount"}
                        >
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

                        <PageProp
                            itemKey={"boundaryCount"}
                            label={"Boundary count"}
                            hint={"How many pages are always shown at each end, however far away the current page is."}
                            controls={"Sets PaginatorProps.boundaryCount"}
                        >
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

                        <PageProp
                            itemKey={"isDisabled"}
                            label={"Disabled"}
                            hint={"Turns the paginator off, so none of its pages or steps respond."}
                            controls={"Sets PaginatorProps.isDisabled"}
                        >
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

            <PageDocsSection
                title={"Jumps to either end"}
                content={
                    "The row draws previous and next unless told otherwise. Pass [prop]steps[/prop] to choose which steps it draws and in what order; here first and last join them. A step with nowhere to go is disabled, so on the first page first and previous go quiet together, and next and last on the final page."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Ends.tsx`}>
                <EndsDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the row starts from the right: the first page and the steps leading back to it sit rightmost. The arrows here are characters the browser draws mirrored in right-to-left text, so each still points the way it steps; an arrow drawn as a picture has to be turned by the painter."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Pages that are links"}
                content={
                    "Pass [prop]computeHref[/prop] and every page and step is drawn as a native HTML anchor element, with an address worked out from the page it leads to; a step with nowhere to go carries no address. In a routed app, pass [prop]linkComponent[/prop], a custom link component such as your router's, and the controls are drawn with it instead."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Links.tsx`}
                renderKnobs={() => (
                    <PageProp
                        itemKey={"hasLinkComponent"}
                        label={"Custom link component"}
                        hint={
                            "Draws the pages and steps with a custom link component, as a router's link would be. Off, they use the native HTML anchor element."
                        }
                        controls={"Sets PaginatorProps.linkComponent"}
                    >
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

            <PageDocsSection
                title={"Arrows with a count between"}
                content={
                    'Paginator is built from pieces you can arrange yourself. PaginatorRoot holds the numbers and the navigation landmark, PaginatorSteps draws the steps with whatever you put between them, and PaginatorPages draws the number row. Here the steps hold the page\'s own "3 of 20" text, with the page count from PaginatorUtils.computePageCount, and there is no number row at all.'
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Count.tsx`}>
                <CountDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"A go-to-page field"}
                content={
                    "A field for jumping to a page is yours to add: it writes the same page the row reads, and the row follows. Here it sits inside the root beside the steps and the number row, named by its visible caption."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Jump.tsx`}>
                <JumpDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Round half a dial"}
                content={
                    "Pass [prop]computeLayout[/prop] and each step, page and gap is placed in a box the layout works out, in the order the controls already have, which is the order Tab walks them. Here a ring lays the row round half a dial."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Dial.tsx`}>
                <DialDocsExample />
            </PageDocsExample>
        </>
    );
};
