import type { ApiGroup, ApiGroupKind } from "virtual:component-api";

import { getDefaultHighlighterConfig, highlighter } from "../../../shiki";
import type { DocsTableOfContentsEntry } from "./DocsView.types";

const WRAPPER_PATTERN = /<\/?pre[^>]*>|<\/?code[^>]*>/g;
const EMPTY_TEXT = "";
const GROUP_DEPTH = 0;
const TABLE_DEPTH = 1;

export const toHighlightedType = (type: string) =>
    highlighter.codeToHtml(type, getDefaultHighlighterConfig("ts")).replace(WRAPPER_PATTERN, EMPTY_TEXT);

export const loadApiGroups = async (name: string): Promise<ApiGroup[]> => {
    const { default: api } = await import("virtual:component-api");

    return (await api[name.toLowerCase()]?.())?.default ?? [];
};

export const toDocsGroupId = (kind: ApiGroupKind) => `docs-${kind}`;

export const toDocsTableId = (kind: ApiGroupKind, name: string) => `docs-${kind}-${name}`;

export const toDocsTableOfContents = (
    groups: ApiGroup[],
    titles: Record<ApiGroupKind, string>,
): DocsTableOfContentsEntry[] =>
    groups.flatMap((group) => [
        { id: toDocsGroupId(group.kind), title: titles[group.kind], depth: GROUP_DEPTH },
        ...group.tables
            .filter((table) => table.heading)
            .map((table) => ({ id: toDocsTableId(group.kind, table.name), title: table.heading, depth: TABLE_DEPTH })),
    ]);
