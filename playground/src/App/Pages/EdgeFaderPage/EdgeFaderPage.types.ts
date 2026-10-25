import type { EdgeFaderEdge } from "@thewaver/ss-components";

export type BaseEdgeFaderExampleValues = {
    size: number;
    isScrollAware: boolean;
};

export type BaseEdgeFaderExampleProps = BaseEdgeFaderExampleValues;

export type BaseEdgeFaderBasicDocsExampleValues = {
    size: number;
};

export type BaseEdgeFaderSidesDocsExampleValues = {
    edges: EdgeFaderEdge[];
};

export type BaseEdgeFaderScrollAwareDocsExampleValues = {
    isScrollAware: boolean;
};
