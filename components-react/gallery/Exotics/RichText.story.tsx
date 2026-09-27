import { type ReactNode, useState } from "react";

import { RichText, Tooltip } from "../../src";

const TAG_DEFS = [
    { tag: "b", name: "bold" },
    { tag: "i", name: "italic" },
    { tag: "s", name: "strikethrough" },
    { tag: "u", name: "underlined" },
    { tag: "li", name: "an item" },
];

const STARTING_CONTENT = [
    "[b]Rich text[/b] paints a [i]plain string[/i], so the words can arrive from anywhere.",
    "",
    "[li]a first item[/li]",
    "[li]a second item, with [u]a word underlined[/u][/li]",
    "",
    "An [warning]unknown tag[/warning] stays put unless you ask for it to go, and an [b]unclosed one is printed the way it was typed.",
].join("\n");

const DIFF_CONTENT = [
    "The class map is [sub]the library's[/sub][add]the consumer's[/add], so this page can name",
    "[add][b]two tags of its own[/b][/add] and paint them [sub]the way every other tag is painted[/sub]",
    "[add]however it likes[/add].",
].join(" ");

const GLOSSARY_CONTENT = [
    'The keep was raised by masons paid in [term tip="A weight of silver, not a coin."]marks[/term]',
    'rather than in coin, and every payment was cut into a [term tip="A split stick notched with the sum."][i]tally[/i][/term],',
    "which is why the accounts survive at all.",
].join(" ");

const LINKS_CONTENT = [
    'This one goes to the [a href="/tooltip"]Tooltip page[/a],',
    'this one [a href="https://developer.mozilla.org/"]leaves the site[/a],',
    'this one is [a href="/shape"][b]bold inside a link[/b][/a], and',
    '[a href="javascript:alert(1)"]this one[/a] was turned down, so it prints as typed.',
].join(" ");

const GLOSSARY_ATTRIBUTES = { term: ["tip"] };
const LINK_ATTRIBUTES = { a: ["href"] };
const SAFE_HREF_RE = /^(https:\/\/|\/(?!\/)|#)/;
const TOOLTIP_PLACEMENT = { x: "center", y: "top-out" } as const;

const computeDiffClassNames = (defaultClasses: Record<string, string>) => ({
    ...defaultClasses,
    add: "diff-added",
    sub: "diff-removed",
});

const GlossaryTerm = ({ tip, children }: { tip: string; children: ReactNode }) => {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    return (
        <span>
            <span ref={setAnchor} tabIndex={0}>
                {children}
            </span>
            <Tooltip
                anchorRef={anchor ?? undefined}
                placement={TOOLTIP_PLACEMENT}
                hoverShowDelayMs={0}
                focusShowDelayMs={0}
                renderContent={(visibilityTarget) => <span style={{ opacity: visibilityTarget }}>{tip}</span>}
            />
        </span>
    );
};

export const Default = () => {
    const [content, setContent] = useState(STARTING_CONTENT);
    const [removeOtherTags, setRemoveOtherTags] = useState(false);

    return (
        <>
            <div data-testid="defaultTags">
                {TAG_DEFS.map((def) => (
                    <span key={def.tag}>
                        <span>
                            <span>{`[${def.tag}]`}</span>
                            <span>{def.name}</span>
                            <span>{`[/${def.tag}]`}</span>
                        </span>
                        <span>
                            <RichText content={`[${def.tag}]${def.name}[/${def.tag}]`} />
                        </span>
                    </span>
                ))}
            </div>
            <div data-testid="customTags">
                <RichText content={DIFF_CONTENT} computeClassNames={computeDiffClassNames} />
            </div>
            <textarea
                aria-label="Custom text"
                value={content}
                onChange={(event) => setContent(event.currentTarget.value)}
            />
            <label>
                <input
                    type="checkbox"
                    data-testid="removeOtherTags"
                    checked={removeOtherTags}
                    onChange={(event) => setRemoveOtherTags(event.currentTarget.checked)}
                />
                Remove other tags
            </label>
            <div id="customInputPreview" style={{ whiteSpace: "pre-wrap" }}>
                <RichText content={content} removeOtherTags={removeOtherTags} />
            </div>
            <div data-testid="glossary">
                <RichText
                    content={GLOSSARY_CONTENT}
                    allowedAttributes={GLOSSARY_ATTRIBUTES}
                    renderTag={(tag, renderChildren, attributes) =>
                        tag === "term" && attributes.tip !== undefined ? (
                            <GlossaryTerm tip={attributes.tip}>{renderChildren()}</GlossaryTerm>
                        ) : undefined
                    }
                />
            </div>
            <div data-testid="links">
                <RichText
                    content={LINKS_CONTENT}
                    allowedAttributes={LINK_ATTRIBUTES}
                    renderTag={(tag, renderChildren, attributes) =>
                        tag === "a" && SAFE_HREF_RE.test(attributes.href ?? "") ? (
                            <a href={attributes.href}>{renderChildren()}</a>
                        ) : undefined
                    }
                />
            </div>
        </>
    );
};
