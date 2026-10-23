import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseTreeConnectorValues,
    BaseTreeNodeContentValues,
    BaseTreeNodePendingValues,
} from "@thewaver/ss-playground/App/StyledComponents/TreeNodeContent/TreeNodeContent.types";

export type TreeNodeContentProps = AccessorValues<BaseTreeNodeContentValues> & {
    setExpanderRef?: (element: HTMLElement) => void;
};

export type TreeNodePendingProps = AccessorValues<BaseTreeNodePendingValues>;

export type TreeConnectorProps = AccessorValues<BaseTreeConnectorValues>;
