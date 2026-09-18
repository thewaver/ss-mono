import { getDefaultHighlighterConfig, highlighter } from "../../../shiki";

const WRAPPER_PATTERN = /<\/?pre[^>]*>|<\/?code[^>]*>/g;
const EMPTY_TEXT = "";

export const toHighlightedType = (type: string) =>
    highlighter.codeToHtml(type, getDefaultHighlighterConfig("ts")).replace(WRAPPER_PATTERN, EMPTY_TEXT);
