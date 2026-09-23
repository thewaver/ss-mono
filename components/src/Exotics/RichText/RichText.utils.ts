import type { RichTextAllowedAttributes, RichTextNode } from "./RichText.types";

const TAG_RE = /\[(?:\/[a-z_][a-z0-9_]*|[a-z_][a-z0-9_]*(?: +[a-z_][a-z0-9_]*="(?:[^"\\]|\\[\s\S])*")*)\]/gi;
const NAME_RE = /^\[\/?([a-z_][a-z0-9_]*)/i;
const ATTRIBUTE_RE = /([a-z_][a-z0-9_]*)="((?:[^"\\]|\\[\s\S])*)"/gi;
const ESCAPE_RE = /\\(["\\])/g;

/** Writes a node back out as the markup it came from, for a tag that turned out never to be closed. */
const stringifyNode = (node: RichTextNode): string =>
    node.type === "text"
        ? node.content
        : `${node.openingMarkup}${node.children.map(stringifyNode).join("")}[/${node.tag}]`;

/** Reads the attributes after a tag's name, or refuses the tag when one is not allowed or appears twice. */
const readAttributes = (source: string, tag: string, allowedAttributes: RichTextAllowedAttributes) => {
    const allowed = Object.hasOwn(allowedAttributes, tag) ? allowedAttributes[tag] : [];
    const entries: [string, string][] = [];

    for (const [, name, value] of source.matchAll(ATTRIBUTE_RE)) {
        if (!allowed.includes(name) || entries.some(([seen]) => seen === name)) return undefined;

        entries.push([name, value.replace(ESCAPE_RE, "$1")]);
    }

    return Object.fromEntries(entries);
};

/**
 * Parses a small bracketed markup into a tree.
 *
 * The markup is the forum-style `[b]bold[/b]`: named tags in square brackets, nested freely. A tag may
 * carry `key="value"` attributes, `[a href="/about"]`, but only the ones a caller has allowed for that tag;
 * anywhere else a bracket is prose. The input is a translated string or a piece of user-facing copy, not a
 * document format, so there is no escaping outside an attribute's value.
 */
export namespace RichTextUtils {
    /**
     * Reads bracketed markup into nodes.
     *
     * Nothing is ever rejected: malformed markup comes back as the literal text it was written as, so a
     * stray bracket in a translated string shows up on screen rather than swallowing the rest of the
     * sentence. A closing tag with no opening one is text. A tag left unclosed at the end is text, and
     * so is everything inside it. A closing tag that skips over an unclosed tag closes the one it names
     * and turns the skipped one back into text, warning as it goes, since that case is almost always a
     * typo rather than an intention.
     *
     * A tag name, and an attribute name, is a letter or an underscore followed by letters, digits and
     * underscores. Attributes follow the name, each after one or more spaces, written `key="value"` with
     * nothing either side of the `=`. The value is always in double quotes, and inside it `\"` is a quote
     * and `\\` a backslash; any other backslash is kept as written, and a `]` needs no escaping. An opening
     * tag carrying an attribute its tag does not allow, or the same attribute twice, is text, and its closing tag
     * is then left with nothing to close. Closing tags carry no attributes.
     *
     * @param input The markup.
     * @param allowedAttributes Which attribute names each tag name accepts. Both are matched
     * case-sensitively. Left out, no tag takes attributes.
     * @returns The nodes, each either a run of text or a tag with its attributes, the opening markup as
     * it was typed, and children of its own. Which tags mean anything is the caller's business; this only
     * reads the structure.
     */
    export const parseContent = (input: string, allowedAttributes: RichTextAllowedAttributes = {}): RichTextNode[] => {
        const stack: {
            tag: string;
            attributes: Record<string, string>;
            openingMarkup: string;
            children: RichTextNode[];
        }[] = [{ tag: "root", attributes: {}, openingMarkup: "", children: [] }];

        let lastIndex = 0;

        for (const match of input.matchAll(TAG_RE)) {
            const tagRaw = match[0];
            const index = match.index!;
            const isClosing = tagRaw.startsWith("[/");
            const tag = tagRaw.match(NAME_RE)![1];

            if (index > lastIndex) {
                stack[stack.length - 1].children.push({
                    type: "text",
                    content: input.slice(lastIndex, index),
                });
            }

            if (isClosing) {
                let found = false;

                for (let i = stack.length - 1; i >= 1; i--) {
                    if (stack[i].tag === tag) {
                        found = true;

                        const popped = stack.splice(i);
                        const completed = popped[0];

                        if (popped.length > 1) {
                            console.warn(
                                `RichText: closing [${tag}] discarded content from unclosed ` +
                                    `${popped
                                        .slice(1)
                                        .map((frame) => `[${frame.tag}]`)
                                        .join(", ")} in: ${input}`,
                            );
                        }

                        stack[stack.length - 1].children.push({
                            type: "tag",
                            tag,
                            attributes: completed.attributes,
                            openingMarkup: completed.openingMarkup,
                            children: completed.children,
                        });

                        break;
                    }
                }

                if (!found) {
                    stack[stack.length - 1].children.push({ type: "text", content: tagRaw });
                }
            } else {
                const attributes = readAttributes(tagRaw.slice(tag.length + 1, -1), tag, allowedAttributes);

                if (attributes) {
                    stack.push({ tag, attributes, openingMarkup: tagRaw, children: [] });
                } else {
                    stack[stack.length - 1].children.push({ type: "text", content: tagRaw });
                }
            }

            lastIndex = index + tagRaw.length;
        }

        if (lastIndex < input.length) {
            stack[stack.length - 1].children.push({
                type: "text",
                content: input.slice(lastIndex),
            });
        }

        while (stack.length > 1) {
            const unclosed = stack.pop()!;
            stack[stack.length - 1].children.push({
                type: "text",
                content: unclosed.openingMarkup + unclosed.children.map(stringifyNode).join(""),
            });
        }

        return stack[0].children;
    };
}
