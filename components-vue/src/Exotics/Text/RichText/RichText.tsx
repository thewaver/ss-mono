import { Comment, Fragment, type SlotsType, type VNodeChild, computed, defineComponent, isVNode } from "vue";

import {
    RICH_TEXT_DEFAULTS,
    RICH_TEXT_DEFAULT_CLASSES,
    type RichTextNode,
    RichTextUtils,
} from "@thewaver/ss-components";

import { declareProps } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { RichTextProps, RichTextSlots } from "./RichText.types";

type RenderDefs = {
    classMap: Record<string, string>;
    removeUnknownTags: boolean;
    renderTag: Partial<RichTextSlots>["renderTag"];
};

const getIsLeftToClassMap = (rendered: VNodeChild) =>
    rendered === undefined ||
    rendered === null ||
    (Array.isArray(rendered) && rendered.every((child) => isVNode(child) && child.type === Comment));

const renderNode = (node: RichTextNode, defs: RenderDefs): VNodeChild => {
    if (node.type === "text") return node.content;

    const renderChildren = () => renderNodes(node.children, defs);
    const rendered = defs.renderTag?.({ tag: node.tag, renderChildren, attributes: node.attributes });

    if (!getIsLeftToClassMap(rendered)) return rendered;

    const treatment = RichTextUtils.getTagTreatment(node.tag, defs.classMap, defs.removeUnknownTags);

    if (treatment.kind === "class") return <span class={treatment.className}>{renderChildren()}</span>;

    if (treatment.kind === "unwrap") return renderChildren();

    return (
        <>
            <span>{node.openingMarkup}</span>
            {renderChildren()}
            <span>{treatment.closingMarkup}</span>
        </>
    );
};

const renderNodes = (nodes: RichTextNode[], defs: RenderDefs): VNodeChild =>
    nodes.map((node, index) => <Fragment key={index}>{renderNode(node, defs)}</Fragment>);

export const RichText = defineComponent(
    (props: RichTextProps, { slots }: SlotsContext<RichTextSlots>) => {
        const parsedTree = computed(() =>
            RichTextUtils.parseContent(props.content, props.allowedAttributes ?? RICH_TEXT_DEFAULTS.allowedAttributes),
        );

        return () =>
            renderNodes(parsedTree.value, {
                classMap: props.computeClassNames?.(RICH_TEXT_DEFAULT_CLASSES) ?? RICH_TEXT_DEFAULT_CLASSES,
                removeUnknownTags: props.removeOtherTags ?? RICH_TEXT_DEFAULTS.removeOtherTags,
                renderTag: slots.renderTag,
            });
    },
    {
        name: "RichText",
        slots: Object as SlotsType<RichTextSlots>,
        props: declareProps<RichTextProps>({
            content: null,
            removeOtherTags: Boolean,
            allowedAttributes: null,
            computeClassNames: null,
        }),
    },
);
