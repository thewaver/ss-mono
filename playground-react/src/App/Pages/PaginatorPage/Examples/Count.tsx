import { PaginatorRoot, PaginatorSteps, PaginatorUtils } from "@thewaver/ss-components-react";
import type { PaginatorStep } from "@thewaver/ss-components-react";
import { computePaginatorStepLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import {
    PagePaginatorCount,
    PagePaginatorDemo,
    PagePaginatorPanel,
    PagePaginatorStep,
} from "../../../StyledComponents/PaginatorContent/PaginatorContent";
import type { PaginatorExampleProps } from "../PaginatorPageReact.types";

const PAGINATOR_GAP = 5;

const COUNT_STEPS: PaginatorStep[] = ["first", "previous", "next", "last"];

type Props = PaginatorExampleProps;

export const CountExample = (props: Props) => {
    const pageCount = PaginatorUtils.computePageCount(props.itemCount, props.pageSize);

    return (
        <PagePaginatorDemo>
            <PaginatorRoot
                page={props.page}
                itemCount={props.itemCount}
                pageSize={props.pageSize}
                isDisabled={props.isDisabled}
                ariaLabel={"Results, counted"}
                onPageChange={props.onPageChange}
            >
                <PaginatorSteps
                    steps={COUNT_STEPS}
                    gap={PAGINATOR_GAP}
                    computeStepLabel={computePaginatorStepLabel}
                    renderStep={(_step, renderProps) => <PagePaginatorStep renderProps={renderProps} />}
                >
                    <PagePaginatorCount page={props.page} pageCount={pageCount} />
                </PaginatorSteps>
            </PaginatorRoot>

            <PagePaginatorPanel page={props.page} itemCount={props.itemCount} pageSize={props.pageSize} />
        </PagePaginatorDemo>
    );
};
