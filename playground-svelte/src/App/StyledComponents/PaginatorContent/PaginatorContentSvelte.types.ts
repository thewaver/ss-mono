import type { Snippet } from "svelte";

import type { PlacementRect } from "@thewaver/ss-components-svelte";
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

export type PaginatorWedgeProps = {
    placement: PlacementRect;
    isCurrent?: boolean;
    isHovered?: boolean;
    isActive?: boolean;
    isDisabled?: boolean;
    children?: Snippet;
};

export type PaginatorPanelProps = BasePaginatorPanelProps;
