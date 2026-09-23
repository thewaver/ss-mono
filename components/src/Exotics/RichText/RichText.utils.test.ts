import { afterEach, describe, expect, it, vi } from "vitest";

import { RichTextUtils } from "./RichText.utils";

const text = (content: string) => ({ type: "text", content });

const tag = (
    name: string,
    children: unknown[],
    attributes: Record<string, string> = {},
    openingMarkup = `[${name}]`,
) => ({ type: "tag", tag: name, attributes, openingMarkup, children });

afterEach(() => {
    vi.restoreAllMocks();
});

describe("parseContent", () => {
    it("returns plain text as a single node", () => {
        expect(RichTextUtils.parseContent("hello")).toEqual([text("hello")]);
    });

    it("returns nothing for an empty string", () => {
        expect(RichTextUtils.parseContent("")).toEqual([]);
    });

    it("wraps tagged content in a tag node", () => {
        expect(RichTextUtils.parseContent("[b]bold[/b]")).toEqual([tag("b", [text("bold")])]);
    });

    it("keeps the text either side of a tag", () => {
        expect(RichTextUtils.parseContent("before [b]bold[/b] after")).toEqual([
            text("before "),
            tag("b", [text("bold")]),
            text(" after"),
        ]);
    });

    it("nests tags inside one another", () => {
        expect(RichTextUtils.parseContent("[b]a[i]b[/i]c[/b]")).toEqual([
            tag("b", [text("a"), tag("i", [text("b")]), text("c")]),
        ]);
    });

    it("treats an unmatched closing tag as literal text rather than dropping it", () => {
        expect(RichTextUtils.parseContent("a[/b]c")).toEqual([text("a"), text("[/b]"), text("c")]);
    });

    it("unwinds an unclosed tag back into the text it was written as", () => {
        expect(RichTextUtils.parseContent("x[b]y")).toEqual([text("x"), text("[b]y")]);
    });

    it("unwinds nested unclosed tags in the order they were opened", () => {
        expect(RichTextUtils.parseContent("[b]a[i]b")).toEqual([text("[b]a[i]b")]);
    });

    it("matches tags case-sensitively despite finding them case-insensitively", () => {
        expect(RichTextUtils.parseContent("[B]x[/b]")).toEqual([text("[B]x[/b]")]);
    });

    it("warns and discards when a closing tag skips past an unclosed one", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const result = RichTextUtils.parseContent("[b][i]x[/b]");

        expect(result).toEqual([tag("b", [])]);
        expect(warn, "the discarded content is announced rather than silently lost").toHaveBeenCalledOnce();
        expect(warn.mock.calls[0][0]).toContain("[i]");
    });

    it("takes digits and underscores inside a tag name", () => {
        expect(RichTextUtils.parseContent("[tag_1]x[/tag_1]")).toEqual([tag("tag_1", [text("x")])]);
    });

    it("refuses a tag name that starts with a digit", () => {
        expect(RichTextUtils.parseContent("[1tag]x[/1tag]")).toEqual([text("[1tag]x[/1tag]")]);
    });

    it("leaves a bracketed word that is not a tag alone", () => {
        expect(RichTextUtils.parseContent("[123] and [b-c]")).toEqual([text("[123] and [b-c]")]);
    });
});

describe("parseContent with attributes", () => {
    const LINKS = { a: ["href"], term: ["tip", "lang"] };

    it("reads an allowed attribute onto the tag", () => {
        expect(RichTextUtils.parseContent('[a href="/about"]about[/a]', LINKS)).toEqual([
            tag("a", [text("about")], { href: "/about" }, '[a href="/about"]'),
        ]);
    });

    it("reads several attributes, each after one or more spaces", () => {
        expect(RichTextUtils.parseContent('[term  tip="a hint" lang="en"]word[/term]', LINKS)).toEqual([
            tag("term", [text("word")], { tip: "a hint", lang: "en" }, '[term  tip="a hint" lang="en"]'),
        ]);
    });

    it("prints a tag whose attribute is not allowed exactly as typed, closing tag included", () => {
        expect(RichTextUtils.parseContent('[a title="x"]about[/a]', LINKS)).toEqual([
            text('[a title="x"]'),
            text("about"),
            text("[/a]"),
        ]);
    });

    it("allows no attribute on any tag when nothing is allowed", () => {
        expect(RichTextUtils.parseContent('[a href="/about"]about[/a]')).toEqual([
            text('[a href="/about"]'),
            text("about"),
            text("[/a]"),
        ]);
    });

    it("matches attribute names case-sensitively", () => {
        expect(RichTextUtils.parseContent('[a HREF="/about"]x[/a]', LINKS)).toEqual([
            text('[a HREF="/about"]'),
            text("x"),
            text("[/a]"),
        ]);
    });

    it("refuses the same attribute twice", () => {
        expect(RichTextUtils.parseContent('[a href="/1" href="/2"]x[/a]', LINKS)).toEqual([
            text('[a href="/1" href="/2"]'),
            text("x"),
            text("[/a]"),
        ]);
    });

    it("does not look an allowed list up on the prototype chain", () => {
        expect(RichTextUtils.parseContent('[constructor name="x"]y[/constructor]', LINKS)).toEqual([
            text('[constructor name="x"]'),
            text("y"),
            text("[/constructor]"),
        ]);
    });

    it("leaves prose in brackets alone", () => {
        expect(RichTextUtils.parseContent("[see page 5] and [see note]", LINKS)).toEqual([
            text("[see page 5] and [see note]"),
        ]);
    });

    it("takes only double quotes, with nothing either side of the equals sign", () => {
        expect(RichTextUtils.parseContent("[a href='/x']y[/a]", LINKS)).toEqual([text("[a href='/x']y"), text("[/a]")]);
        expect(RichTextUtils.parseContent('[a href = "/x"]y[/a]', LINKS)).toEqual([
            text('[a href = "/x"]y'),
            text("[/a]"),
        ]);
        expect(RichTextUtils.parseContent("[a href=/x]y[/a]", LINKS)).toEqual([text("[a href=/x]y"), text("[/a]")]);
    });

    it("refuses a space before the closing bracket", () => {
        expect(RichTextUtils.parseContent('[a href="/x" ]y[/a]', LINKS)).toEqual([
            text('[a href="/x" ]y'),
            text("[/a]"),
        ]);
    });

    it("reads an escaped quote and an escaped backslash inside a value", () => {
        expect(RichTextUtils.parseContent('[term tip="say \\"hi\\" \\\\ bye"]w[/term]', LINKS)).toEqual([
            tag("term", [text("w")], { tip: 'say "hi" \\ bye' }, '[term tip="say \\"hi\\" \\\\ bye"]'),
        ]);
    });

    it("keeps any other backslash as written", () => {
        expect(RichTextUtils.parseContent('[a href="C:\\files"]x[/a]', LINKS)).toEqual([
            tag("a", [text("x")], { href: "C:\\files" }, '[a href="C:\\files"]'),
        ]);
    });

    it("keeps brackets inside a value as part of the value rather than as tags", () => {
        expect(RichTextUtils.parseContent('[term tip="write [b]bold[/b]"]w[/term]', LINKS)).toEqual([
            tag("term", [text("w")], { tip: "write [b]bold[/b]" }, '[term tip="write [b]bold[/b]"]'),
        ]);
    });

    it("prints an unclosed tag with its attributes the way it was typed", () => {
        expect(RichTextUtils.parseContent('x[a href="/y"]z', LINKS)).toEqual([text("x"), text('[a href="/y"]z')]);
    });

    it("nests tags that carry attributes", () => {
        expect(RichTextUtils.parseContent('[a href="/x"][b]y[/b][/a]', LINKS)).toEqual([
            tag("a", [tag("b", [text("y")])], { href: "/x" }, '[a href="/x"]'),
        ]);
    });
});
