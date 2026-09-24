import { createMemo, createSignal } from "solid-js";

import { PAGINATOR_DEFAULTS } from "@thewaver/ss-components";

import { PaginatorKnobs } from "../../Knobs/Paginators.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageNumberField } from "../../StyledComponents/Field/Field";
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
    const [getPageCount, setPageCount] = createSignal(PaginatorKnobs.STARTING_PAGE_COUNT);
    const [getSiblingCount, setSiblingCount] = createSignal(PAGINATOR_DEFAULTS.siblingCount);
    const [getBoundaryCount, setBoundaryCount] = createSignal(PAGINATOR_DEFAULTS.boundaryCount);
    const [getIsDisabled, setIsDisabled] = createSignal(PaginatorKnobs.STARTING_IS_DISABLED);

    const [getStepPage, setStepPage] = createSignal(STARTING_PAGE);
    const [getEndPage, setEndPage] = createSignal(STARTING_PAGE);
    const [getLinkPage, setLinkPage] = createSignal(STARTING_PAGE);
    const [getCustomLinkPage, setCustomLinkPage] = createSignal(STARTING_PAGE);
    const [getDialPage, setDialPage] = createSignal(STARTING_PAGE);

    const getExamples = createMemo(() => {
        const commonProps: Omit<PaginatorExampleProps, "page" | "onPageChange"> = {
            pageCount: getPageCount,
            siblingCount: getSiblingCount,
            boundaryCount: getBoundaryCount,
            isDisabled: getIsDisabled,
        };

        return [
            {
                key: "steps",
                name: "Previous and next",
                readout: () =>
                    `page ${getStepPage()} of ${getPageCount()} — the gaps name the pages they stand for, and a gap standing for one page is spelled as that page instead`,
                component: () => <StepsExample {...commonProps} page={getStepPage} onPageChange={setStepPage} />,
                path: `${EXAMPLES_ROOT}/Steps.tsx`,
            },
            {
                key: "ends",
                name: "Jumps to either end",
                readout: () =>
                    `page ${getEndPage()} of ${getPageCount()} — first and previous go quiet together on page one, and next and last on the final page`,
                component: () => <EndsExample {...commonProps} page={getEndPage} onPageChange={setEndPage} />,
                path: `${EXAMPLES_ROOT}/Ends.tsx`,
            },
            {
                key: "links",
                name: "Pages that are links",
                readout: () =>
                    `page ${getLinkPage()} of ${getPageCount()} — the consumer knows the address shape, so it computes the href from the page the library worked out`,
                component: () => <LinksExample {...commonProps} page={getLinkPage} onPageChange={setLinkPage} />,
                path: `${EXAMPLES_ROOT}/Links.tsx`,
            },
            {
                key: "linkComponent",
                name: "Links through a component",
                readout: () =>
                    `page ${getCustomLinkPage()} of ${getPageCount()} — the same links rendered by a consumer's own link component`,
                component: () => (
                    <LinkComponentExample {...commonProps} page={getCustomLinkPage} onPageChange={setCustomLinkPage} />
                ),
                path: `${EXAMPLES_ROOT}/LinkComponent.tsx`,
            },
            {
                key: "dial",
                name: "The same row, round a dial",
                readout: () =>
                    `page ${getDialPage()} of ${getPageCount()} — one layout function, and the steps, pages and gaps become wedges in the order they already had`,
                component: () => <DialExample {...commonProps} page={getDialPage} onPageChange={setDialPage} />,
                path: `${EXAMPLES_ROOT}/Dial.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"pageCount"} label={"Page count"} hint={"How many pages there are to page through."}>
                    <PageNumberField
                        value={getPageCount}
                        min={() => PaginatorKnobs.MIN_PAGE_COUNT}
                        max={() => PaginatorKnobs.MAX_PAGE_COUNT}
                        step={() => PaginatorKnobs.COUNT_STEP}
                        width={() => COUNT_FIELD_WIDTH}
                        ariaLabel={"Page count"}
                        onInput={setPageCount}
                    />
                </PageProp>

                <PageProp
                    key={"siblingCount"}
                    label={"Sibling count"}
                    hint={
                        "How many pages are shown on each side of the current one before the run is broken by an ellipsis."
                    }
                >
                    <PageNumberField
                        value={getSiblingCount}
                        min={() => PaginatorKnobs.MIN_COUNT}
                        max={() => PaginatorKnobs.MAX_COUNT}
                        step={() => PaginatorKnobs.COUNT_STEP}
                        width={() => COUNT_FIELD_WIDTH}
                        ariaLabel={"Sibling count"}
                        onInput={setSiblingCount}
                    />
                </PageProp>

                <PageProp
                    key={"boundaryCount"}
                    label={"Boundary count"}
                    hint={"How many pages are always shown at each end, however far away the current page is."}
                >
                    <PageNumberField
                        value={getBoundaryCount}
                        min={() => PaginatorKnobs.MIN_COUNT}
                        max={() => PaginatorKnobs.MAX_COUNT}
                        step={() => PaginatorKnobs.COUNT_STEP}
                        width={() => COUNT_FIELD_WIDTH}
                        ariaLabel={"Boundary count"}
                        onInput={setBoundaryCount}
                    />
                </PageProp>

                <PageProp
                    key={"isDisabled"}
                    label={"Disabled"}
                    hint={"Turns the paginator off, so none of its pages or arrows respond."}
                >
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} minColumnWidth={400} />
        </>
    );
};
