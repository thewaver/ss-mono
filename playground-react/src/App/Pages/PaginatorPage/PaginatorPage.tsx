import { useState } from "react";

import { PAGINATOR_DEFAULTS, PaginatorUtils } from "@thewaver/ss-components-react";
import { PaginatorKnobs } from "@thewaver/ss-playground/App/Knobs/Paginators.const";
import {
    COUNT_FIELD_WIDTH,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    STARTING_PAGE,
} from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { CountExample } from "./Examples/Count";
import { DialExample } from "./Examples/Dial";
import { EndsExample } from "./Examples/Ends";
import { JumpExample } from "./Examples/Jump";
import { LinkComponentExample } from "./Examples/LinkComponent";
import { LinksExample } from "./Examples/Links";
import { StepsExample } from "./Examples/Steps";
import type { PaginatorExampleProps } from "./PaginatorPageReact.types";

export const PaginatorPage = () => {
    const [itemCount, setItemCount] = useState(PaginatorKnobs.STARTING_ITEM_COUNT);
    const [pageSize, setPageSize] = useState(PaginatorKnobs.STARTING_PAGE_SIZE);
    const [siblingCount, setSiblingCount] = useState(PAGINATOR_DEFAULTS.siblingCount);
    const [boundaryCount, setBoundaryCount] = useState(PAGINATOR_DEFAULTS.boundaryCount);
    const [isDisabled, setIsDisabled] = useState(PaginatorKnobs.STARTING_IS_DISABLED);

    const [stepPage, setStepPage] = useState(STARTING_PAGE);
    const [endPage, setEndPage] = useState(STARTING_PAGE);
    const [linkPage, setLinkPage] = useState(STARTING_PAGE);
    const [customLinkPage, setCustomLinkPage] = useState(STARTING_PAGE);
    const [dialPage, setDialPage] = useState(STARTING_PAGE);
    const [countPage, setCountPage] = useState(STARTING_PAGE);
    const [jumpPage, setJumpPage] = useState(STARTING_PAGE);

    const pageCount = PaginatorUtils.computePageCount(itemCount, pageSize);

    const commonProps: Omit<PaginatorExampleProps, "page" | "onPageChange"> = {
        itemCount,
        pageSize,
        siblingCount,
        boundaryCount,
        isDisabled,
    };

    const examples = [
        {
            key: "steps",
            name: EXAMPLE_NAMES.steps,
            readout: () =>
                `page ${stepPage} of ${pageCount} — the gaps name the pages they stand for, and a gap standing for one page is spelled as that page instead`,
            component: () => <StepsExample {...commonProps} page={stepPage} onPageChange={setStepPage} />,
            path: `${EXAMPLES_ROOT}/Steps.tsx`,
        },
        {
            key: "ends",
            name: EXAMPLE_NAMES.ends,
            readout: () =>
                `page ${endPage} of ${pageCount} — first and previous go quiet together on page one, and next and last on the final page`,
            component: () => <EndsExample {...commonProps} page={endPage} onPageChange={setEndPage} />,
            path: `${EXAMPLES_ROOT}/Ends.tsx`,
        },
        {
            key: "links",
            name: EXAMPLE_NAMES.links,
            readout: () =>
                `page ${linkPage} of ${pageCount} — the consumer knows the address shape, so it computes the href from the page the library worked out`,
            component: () => <LinksExample {...commonProps} page={linkPage} onPageChange={setLinkPage} />,
            path: `${EXAMPLES_ROOT}/Links.tsx`,
        },
        {
            key: "linkComponent",
            name: EXAMPLE_NAMES.linkComponent,
            readout: () =>
                `page ${customLinkPage} of ${pageCount} — the same links rendered by a consumer's own link component`,
            component: () => (
                <LinkComponentExample {...commonProps} page={customLinkPage} onPageChange={setCustomLinkPage} />
            ),
            path: `${EXAMPLES_ROOT}/LinkComponent.tsx`,
        },
        {
            key: "count",
            name: EXAMPLE_NAMES.count,
            readout: () =>
                `page ${countPage} of ${pageCount} — the steps piece with the page's own text in its slot, and no number row at all`,
            component: () => <CountExample {...commonProps} page={countPage} onPageChange={setCountPage} />,
            path: `${EXAMPLES_ROOT}/Count.tsx`,
        },
        {
            key: "jump",
            name: EXAMPLE_NAMES.jump,
            readout: () =>
                `page ${jumpPage} of ${pageCount} — the field is the page's own, writing the same page the row reads`,
            component: () => <JumpExample {...commonProps} page={jumpPage} onPageChange={setJumpPage} />,
            path: `${EXAMPLES_ROOT}/Jump.tsx`,
        },
        {
            key: "dial",
            name: EXAMPLE_NAMES.dial,
            readout: () =>
                `page ${dialPage} of ${pageCount} — one layout function, and the steps, pages and gaps become wedges in the order they already had`,
            component: () => <DialExample {...commonProps} page={dialPage} onPageChange={setDialPage} />,
            path: `${EXAMPLES_ROOT}/Dial.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
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
                        "How many pages are shown on each side of the current one before the run is broken by an ellipsis."
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
                    hint={"Turns the paginator off, so none of its pages or arrows respond."}
                    controls={"Sets PaginatorProps.isDisabled"}
                >
                    <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} minColumnWidth={400} />
        </>
    );
};
