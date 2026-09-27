import { useState } from "react";

import { type PaginatorStep, PlacementLayoutUtils } from "@thewaver/ss-components";

import { Paginator, type PaginatorLinkProps, type PaginatorProps } from "../../src";

const STEP_GLYPHS: Record<PaginatorStep, string> = { first: "«", previous: "‹", next: "›", last: "»" };
const STEP_NAMES: Record<PaginatorStep, string> = { first: "First", previous: "Previous", next: "Next", last: "Last" };
const END_STEPS: PaginatorStep[] = ["first", "previous", "next", "last"];
const DIAL_LAYOUT = PlacementLayoutUtils.createRing({
    spreadDegrees: 180,
    facingDegrees: 0,
    holeRatio: 0.5,
    wedgeGapDegrees: 2,
});
const DIAL_SIZE = 240;

const LinkComponent = (props: PaginatorLinkProps) => <a {...props} data-link-component />;

type Knobs = { pageCount?: number; siblingCount?: number; boundaryCount?: number; isDisabled?: boolean };

type RowProps = Knobs & { scope: string; ariaLabel: string } & Partial<PaginatorProps>;

const Row = ({ scope, pageCount = 20, ...rest }: RowProps) => {
    const [page, setPage] = useState(1);

    return (
        <div data-testid={scope} style={scope === "dial" ? { width: DIAL_SIZE } : undefined}>
            <Paginator
                gap={5}
                computePageLabel={(value) => `Page ${value}`}
                computeStepLabel={(step) => `${STEP_NAMES[step]} page`}
                renderPage={(_entry, renderProps) => <span aria-hidden="true">{renderProps.page}</span>}
                renderGap={(entry) => <span title={`Pages ${entry.from} to ${entry.to}`}>…</span>}
                renderStep={(step) => <span aria-hidden="true">{STEP_GLYPHS[step]}</span>}
                {...rest}
                pageCount={pageCount}
                page={page}
                onPageChange={setPage}
            />
            <output data-readout="page">{`page ${page} of ${pageCount}`}</output>
        </div>
    );
};

export const Default = (knobs: Knobs) => (
    <>
        <Row scope="steps" ariaLabel={"Results"} {...knobs} />
        <Row scope="ends" ariaLabel={"Results with ends"} steps={END_STEPS} {...knobs} />
        <Row scope="links" ariaLabel={"Linked results"} computeHref={(page) => `#paginator-page-${page}`} {...knobs} />
        <Row
            scope="linkComponent"
            ariaLabel={"Routed results"}
            computeHref={(page) => `#paginator-page-${page}`}
            linkComponent={LinkComponent}
            {...knobs}
        />
        <Row
            scope="dial"
            ariaLabel={"Results round a dial"}
            steps={END_STEPS}
            computeLayout={DIAL_LAYOUT}
            gap={undefined}
            {...knobs}
        />
    </>
);
