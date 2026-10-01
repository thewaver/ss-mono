import { Fragment, type ReactNode, useMemo } from "react";

import {
    RICH_TEXT_DEFAULTS,
    RICH_TEXT_DEFAULT_CLASSES,
    type RichTextNode,
    RichTextUtils,
} from "@thewaver/ss-components";

import type { RichTextProps } from "./RichText.types";

type RenderDefs = {
    classMap: Record<string, string>;
    removeUnknownTags: boolean;
    renderTag: RichTextProps["renderTag"];
};

const renderNode = (node: RichTextNode, defs: RenderDefs): ReactNode => {
    if (node.type === "text") return node.content;

    const renderChildren = () => renderNodes(node.children, defs);
    const rendered = defs.renderTag?.(node.tag, renderChildren, node.attributes);

    if (rendered !== undefined) return rendered;

    const treatment = RichTextUtils.getTagTreatment(node.tag, defs.classMap, defs.removeUnknownTags);

    if (treatment.kind === "class") return <span className={treatment.className}>{renderChildren()}</span>;

    if (treatment.kind === "unwrap") return renderChildren();

    return (
        <>
            <span>{node.openingMarkup}</span>
            {renderChildren()}
            <span>{treatment.closingMarkup}</span>
        </>
    );
};

const renderNodes = (nodes: RichTextNode[], defs: RenderDefs): ReactNode =>
    nodes.map((node, index) => <Fragment key={index}>{renderNode(node, defs)}</Fragment>);

export const RichText = (props: RichTextProps) => {
    const allowedAttributes = props.allowedAttributes ?? RICH_TEXT_DEFAULTS.allowedAttributes;

    const parsedTree = useMemo(
        () => RichTextUtils.parseContent(props.content, allowedAttributes),
        [props.content, allowedAttributes],
    );

    return renderNodes(parsedTree, {
        classMap: props.computeClassNames?.(RICH_TEXT_DEFAULT_CLASSES) ?? RICH_TEXT_DEFAULT_CLASSES,
        removeUnknownTags: props.removeOtherTags ?? RICH_TEXT_DEFAULTS.removeOtherTags,
        renderTag: props.renderTag,
    });
};
