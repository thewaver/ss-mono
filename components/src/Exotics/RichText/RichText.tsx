import { createMemo } from "solid-js";
import type { JSX } from "solid-js";

import { access } from "../../Utils/propUtils";
import { RICH_TEXT_DEFAULTS } from "./RichText.const";
import type { RichTextNode, RichTextProps, RichTextRenderDefs } from "./RichText.types";
import { RichTextUtils } from "./RichText.utils";

import * as styles from "./RichText.css";

const DEFAULT_RICH_TEXT_CLASSES = {
    b: styles.boldText,
    i: styles.italicText,
    s: styles.strikedText,
    u: styles.underlineText,
    li: styles.listItem,
} as const;

const renderNodes = (nodes: RichTextNode[], defs: RichTextRenderDefs): JSX.Element[] => {
    return nodes.map((node) => {
        if (node.type === "text") {
            return <>{node.content}</>;
        }

        const renderChildren = () => renderNodes(node.children, defs);
        const rendered = defs.renderTag?.(node.tag, renderChildren, node.attributes);

        if (rendered !== undefined) {
            return rendered;
        }

        const className = Object.hasOwn(defs.classMap, node.tag) ? defs.classMap[node.tag] : undefined;

        if (className) {
            return <span class={className}>{renderChildren()}</span>;
        }

        if (defs.removeUnknownTags) {
            return <>{renderChildren()}</>;
        }

        return (
            <>
                <span>{node.openingMarkup}</span>
                {renderChildren()}
                <span>{`[/${node.tag}]`}</span>
            </>
        );
    });
};

export const RichText = (props: RichTextProps) => {
    const getParsedTree = createMemo(() =>
        RichTextUtils.parseContent(
            access(props.content),
            access(props.allowedAttributes) ?? RICH_TEXT_DEFAULTS.allowedAttributes,
        ),
    );

    return (
        <>
            {renderNodes(getParsedTree(), {
                classMap: props.computeClassNames?.(DEFAULT_RICH_TEXT_CLASSES) ?? DEFAULT_RICH_TEXT_CLASSES,
                removeUnknownTags: access(props.removeOtherTags) ?? RICH_TEXT_DEFAULTS.removeOtherTags,
                renderTag: props.renderTag,
            })}
        </>
    );
};
