import { type BracketConnectorPathFn, BracketConnectorPaths, type BracketNode } from "@thewaver/ss-components";

export const NOTHING_PICKED = "nothing picked yet";

export const describeFamily = (rootValue: string, anchorValue: string | undefined) =>
    anchorValue === undefined
        ? `the top — ${rootValue} and what feeds it`
        : `what feeds ${anchorValue}, and what feeds those`;

export const seed = (value: string): BracketNode<string> => ({ value });

export const branch = (value: string, ...children: BracketNode<string>[]): BracketNode<string> => ({
    value,
    children,
});

export const BEAM_PATHS: Record<string, BracketConnectorPathFn> = {
    flat: BracketConnectorPaths.elbow,
    rounded: BracketConnectorPaths.roundedElbow,
    curved: BracketConnectorPaths.curve,
    ballAndArrow: BracketConnectorPaths.roundedElbow,
};
