import { useState } from "react";

import { PAGINATOR_DEFAULTS } from "@thewaver/ss-components-react";
import { PaginatorKnobs } from "@thewaver/ss-playground/App/Knobs/Paginators.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { DialExample } from "./Examples/Dial";
import { EndsExample } from "./Examples/Ends";
import { LinkComponentExample } from "./Examples/LinkComponent";
import { LinksExample } from "./Examples/Links";
import { StepsExample } from "./Examples/Steps";
import type { PaginatorExampleProps } from "./PaginatorPage.types";

const STARTING_PAGE = 1;
const COUNT_FIELD_WIDTH = 90;
const EXAMPLES_ROOT = "/src/App/Pages/PaginatorPage/Examples";

export const PaginatorPage = () => {
    const [pageCount, setPageCount] = useState(PaginatorKnobs.STARTING_PAGE_COUNT);
    const [siblingCount, setSiblingCount] = useState(PAGINATOR_DEFAULTS.siblingCount);
    const [boundaryCount, setBoundaryCount] = useState(PAGINATOR_DEFAULTS.boundaryCount);
    const [isDisabled, setIsDisabled] = useState(PaginatorKnobs.STARTING_IS_DISABLED);

    const [stepPage, setStepPage] = useState(STARTING_PAGE);
    const [endPage, setEndPage] = useState(STARTING_PAGE);
    const [linkPage, setLinkPage] = useState(STARTING_PAGE);
    const [customLinkPage, setCustomLinkPage] = useState(STARTING_PAGE);
    const [dialPage, setDialPage] = useState(STARTING_PAGE);

    const commonProps: Omit<PaginatorExampleProps, "page" | "onPageChange"> = {
        pageCount,
        siblingCount,
        boundaryCount,
        isDisabled,
    };

    const examples = [
        {
            key: "steps",
            name: "Previous and next",
            readout: () =>
                `page ${stepPage} of ${pageCount} — the gaps name the pages they stand for, and a gap standing for one page is spelled as that page instead`,
            component: () => <StepsExample {...commonProps} page={stepPage} onPageChange={setStepPage} />,
            path: `${EXAMPLES_ROOT}/Steps.tsx`,
        },
        {
            key: "ends",
            name: "Jumps to either end",
            readout: () =>
                `page ${endPage} of ${pageCount} — first and previous go quiet together on page one, and next and last on the final page`,
            component: () => <EndsExample {...commonProps} page={endPage} onPageChange={setEndPage} />,
            path: `${EXAMPLES_ROOT}/Ends.tsx`,
        },
        {
            key: "links",
            name: "Pages that are links",
            readout: () =>
                `page ${linkPage} of ${pageCount} — the consumer knows the address shape, so it computes the href from the page the library worked out`,
            component: () => <LinksExample {...commonProps} page={linkPage} onPageChange={setLinkPage} />,
            path: `${EXAMPLES_ROOT}/Links.tsx`,
        },
        {
            key: "linkComponent",
            name: "Links through a component",
            readout: () =>
                `page ${customLinkPage} of ${pageCount} — the same links rendered by a consumer's own link component`,
            component: () => (
                <LinkComponentExample {...commonProps} page={customLinkPage} onPageChange={setCustomLinkPage} />
            ),
            path: `${EXAMPLES_ROOT}/LinkComponent.tsx`,
        },
        {
            key: "dial",
            name: "The same row, round half a dial",
            readout: () =>
                `page ${dialPage} of ${pageCount} — one layout function, and the steps, pages and gaps become wedges in the order they already had`,
            component: () => <DialExample {...commonProps} page={dialPage} onPageChange={setDialPage} />,
            path: `${EXAMPLES_ROOT}/Dial.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp itemKey={"pageCount"} label={"Page count"} hint={"How many pages there are to page through."}>
                    <PageNumberField
                        value={pageCount}
                        min={PaginatorKnobs.MIN_PAGE_COUNT}
                        max={PaginatorKnobs.MAX_PAGE_COUNT}
                        step={PaginatorKnobs.COUNT_STEP}
                        width={COUNT_FIELD_WIDTH}
                        ariaLabel={"Page count"}
                        onInput={setPageCount}
                    />
                </PageProp>

                <PageProp
                    itemKey={"siblingCount"}
                    label={"Sibling count"}
                    hint={
                        "How many pages are shown on each side of the current one before the run is broken by an ellipsis."
                    }
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
                >
                    <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} minColumnWidth={400} />
        </>
    );
};
