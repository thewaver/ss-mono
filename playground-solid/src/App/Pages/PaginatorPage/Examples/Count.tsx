import { PaginatorRoot, PaginatorSteps, PaginatorUtils, access } from "@thewaver/ss-components-solid";
import type { PaginatorStep } from "@thewaver/ss-components-solid";
import { computePaginatorStepLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import {
    PagePaginatorCount,
    PagePaginatorDemo,
    PagePaginatorPanel,
    PagePaginatorStep,
} from "../../../StyledComponents/PaginatorContent/PaginatorContent";
import type { PaginatorExampleProps } from "../PaginatorPageSolid.types";

const PAGINATOR_GAP = 5;

const COUNT_STEPS: PaginatorStep[] = ["first", "previous", "next", "last"];

type Props = PaginatorExampleProps;

export const CountExample = (props: Props) => {
    const getPageCount = () => PaginatorUtils.computePageCount(access(props.itemCount), access(props.pageSize));

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
                    renderStep={(_getStep, getRenderProps) => <PagePaginatorStep renderProps={getRenderProps} />}
                >
                    <PagePaginatorCount page={props.page} pageCount={getPageCount} />
                </PaginatorSteps>
            </PaginatorRoot>

            <PagePaginatorPanel page={props.page} itemCount={props.itemCount} pageSize={props.pageSize} />
        </PagePaginatorDemo>
    );
};
