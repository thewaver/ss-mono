import type { ComponentPublicInstance } from "vue";

import type {
    BaseTreeConnectorProps,
    BaseTreeNodeContentProps,
    BaseTreeNodePendingProps,
} from "@thewaver/ss-playground/App/StyledComponents/TreeNodeContent/TreeNodeContent.types";

export type TreeNodeContentProps = BaseTreeNodeContentProps & {
    setExpanderRef?: (target: Element | ComponentPublicInstance | null) => void;
};

export type TreeNodePendingProps = BaseTreeNodePendingProps;

export type TreeConnectorProps = BaseTreeConnectorProps;
