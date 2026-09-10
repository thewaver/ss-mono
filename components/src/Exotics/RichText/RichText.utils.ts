import type { RichTextNode } from "./RichText.types";

/** Writes a node back out as the markup it came from, for a tag that turned out never to be closed. */
const stringifyNode = (node: RichTextNode): string =>
    node.type === "text" ? node.content : `[${node.tag}]${node.children.map(stringifyNode).join("")}[/${node.tag}]`;

/**
 * Parses a small bracketed markup into a tree.
 *
 * The markup is the forum-style `[b]bold[/b]`: named tags in square brackets, nested freely. There
 * is no escaping and no attributes, which is deliberate — the input is a translated string or a
 * piece of user-facing copy, not a document format.
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
     * @param input The markup.
     * @returns The nodes, each either a run of text or a tag with children of its own. Which tags mean
     * anything is the caller's business; this only reads the structure.
     */
    export const parseContent = (input: string): RichTextNode[] => {
        const stack: { tag: string; children: RichTextNode[] }[] = [{ tag: "root", children: [] }];
        const tagRE = /\[\/?[a-z_][a-z0-9_]*\]/gi;

        let lastIndex = 0;

        for (const match of input.matchAll(tagRE)) {
            const tagRaw = match[0];
            const index = match.index!;
            const isClosing = tagRaw.startsWith("[/");
            const tag = tagRaw.replace(/\[\/?|\]/g, "");

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

                        stack[stack.length - 1].children.push({ type: "tag", tag, children: completed.children });

                        break;
                    }
                }

                if (!found) {
                    stack[stack.length - 1].children.push({ type: "text", content: tagRaw });
                }
            } else {
                stack.push({ tag, children: [] });
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
                content: `[${unclosed.tag}]` + unclosed.children.map(stringifyNode).join(""),
            });
        }

        return stack[0].children;
    };
}
