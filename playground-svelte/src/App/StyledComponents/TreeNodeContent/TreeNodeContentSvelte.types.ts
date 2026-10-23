import type {
    BaseTreeConnectorProps,
    BaseTreeNodeContentProps,
    BaseTreeNodePendingProps,
} from "@thewaver/ss-playground/App/StyledComponents/TreeNodeContent/TreeNodeContent.types";

export type TreeNodeContentProps = BaseTreeNodeContentProps & {
    setExpanderRef?: (element: HTMLElement) => void;
};

export type TreeNodePendingProps = BaseTreeNodePendingProps;

export type TreeConnectorProps = BaseTreeConnectorProps;
