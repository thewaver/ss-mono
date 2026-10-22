import type { ParentProps } from "solid-js";

import type { AccessorProps, AccessorValues, PlacementRect } from "@thewaver/ss-components-solid";
import type {
    BasePaginatorCountContentValues,
    BasePaginatorDialGapContentValues,
    BasePaginatorGapContentValues,
    BasePaginatorPageContentValues,
    BasePaginatorPanelValues,
    BasePaginatorStepContentValues,
} from "@thewaver/ss-playground/App/StyledComponents/PaginatorContent/PaginatorContent.types";

export type PaginatorPageContentProps = AccessorValues<BasePaginatorPageContentValues>;

export type PaginatorStepContentProps = AccessorValues<BasePaginatorStepContentValues>;

export type PaginatorGapContentProps = AccessorValues<BasePaginatorGapContentValues>;

export type PaginatorDialGapContentProps = AccessorValues<BasePaginatorDialGapContentValues>;

export type PaginatorWedgeProps = ParentProps<
    AccessorProps<{
        placement: PlacementRect;
        isCurrent?: boolean;
        isHovered?: boolean;
        isActive?: boolean;
        isDisabled?: boolean;
    }>
>;

export type PaginatorPanelProps = AccessorValues<BasePaginatorPanelValues>;

export type PaginatorCountContentProps = AccessorValues<BasePaginatorCountContentValues>;
