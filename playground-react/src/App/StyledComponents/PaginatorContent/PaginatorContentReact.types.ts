import type { PropsWithChildren } from "react";

import type { PlacementRect } from "@thewaver/ss-components-react";
import type {
    BasePaginatorDialGapContentProps,
    BasePaginatorGapContentProps,
    BasePaginatorPageContentProps,
    BasePaginatorPanelProps,
    BasePaginatorStepContentProps,
} from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.types";

export type PaginatorPageContentProps = BasePaginatorPageContentProps;

export type PaginatorStepContentProps = BasePaginatorStepContentProps;

export type PaginatorGapContentProps = BasePaginatorGapContentProps;

export type PaginatorDialGapContentProps = BasePaginatorDialGapContentProps;

export type PaginatorWedgeProps = PropsWithChildren<{
    placement: PlacementRect;
    isCurrent?: boolean;
    isHovered?: boolean;
    isActive?: boolean;
    isDisabled?: boolean;
}>;

export type PaginatorPanelProps = BasePaginatorPanelProps;
