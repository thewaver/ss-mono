import type { BracketNode } from "@thewaver/ss-components";

export const NOTHING_PICKED = "nothing picked yet";

export const seed = (value: string): BracketNode<string> => ({ value });

export const branch = (value: string, ...children: BracketNode<string>[]): BracketNode<string> => ({
    value,
    children,
});
