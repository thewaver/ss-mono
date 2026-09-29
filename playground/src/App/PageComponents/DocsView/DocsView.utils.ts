import type { ApiGroup } from "virtual:component-api";

import { getDefaultHighlighterConfig, highlighter } from "../../../shiki";

const WRAPPER_PATTERN = /<\/?pre[^>]*>|<\/?code[^>]*>/g;
const EMPTY_TEXT = "";

export const toHighlightedType = (type: string) =>
    highlighter.codeToHtml(type, getDefaultHighlighterConfig("ts")).replace(WRAPPER_PATTERN, EMPTY_TEXT);

export const loadApiGroups = async (name: string): Promise<ApiGroup[]> => {
    const { default: api } = await import("virtual:component-api");

    return (await api[name.toLowerCase()]?.())?.default ?? [];
};
