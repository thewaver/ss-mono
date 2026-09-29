import { createMemo } from "solid-js";
import type { JSX } from "solid-js";

import {
    RICH_TEXT_DEFAULTS,
    RICH_TEXT_DEFAULT_CLASSES,
    type RichTextNode,
    RichTextUtils,
} from "@thewaver/ss-components";

import { access } from "../../Utils/propUtils";
import type { RichTextProps, RichTextRenderDefs } from "./RichTextSolid.types";

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

        const treatment = RichTextUtils.getTagTreatment(node.tag, defs.classMap, defs.removeUnknownTags);

        if (treatment.kind === "class") {
            return <span class={treatment.className}>{renderChildren()}</span>;
        }

        if (treatment.kind === "unwrap") {
            return <>{renderChildren()}</>;
        }

        return (
            <>
                <span>{node.openingMarkup}</span>
                {renderChildren()}
                <span>{treatment.closingMarkup}</span>
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
                classMap: props.computeClassNames?.(RICH_TEXT_DEFAULT_CLASSES) ?? RICH_TEXT_DEFAULT_CLASSES,
                removeUnknownTags: access(props.removeOtherTags) ?? RICH_TEXT_DEFAULTS.removeOtherTags,
                renderTag: props.renderTag,
            })}
        </>
    );
};
