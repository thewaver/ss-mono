<script lang="ts">
    import {
        RICH_TEXT_DEFAULTS,
        RICH_TEXT_DEFAULT_CLASSES,
        type RichTextNode,
        RichTextUtils,
    } from "@thewaver/ss-components";

    import type { RichTextProps } from "./RichText.types.js";

    let props: RichTextProps = $props();

    const allowedAttributes = $derived(props.allowedAttributes ?? RICH_TEXT_DEFAULTS.allowedAttributes);

    const parsedTree = $derived(RichTextUtils.parseContent(props.content, allowedAttributes));

    const classMap = $derived(props.computeClassNames?.(RICH_TEXT_DEFAULT_CLASSES) ?? RICH_TEXT_DEFAULT_CLASSES);

    const removeUnknownTags = $derived(props.removeOtherTags ?? RICH_TEXT_DEFAULTS.removeOtherTags);
</script>

{#snippet renderNodes(nodes: RichTextNode[])}
    {#each nodes as node, index (index)}
        {#if node.type === "text"}
            {node.content}
        {:else}
            {#snippet renderChildren()}
                {@render renderNodes(node.children)}
            {/snippet}

            {#snippet renderDefault()}
                {@const treatment = RichTextUtils.getTagTreatment(node.tag, classMap, removeUnknownTags)}
                {#if treatment.kind === "class"}
                    <span class={treatment.className}>{@render renderChildren()}</span>
                {:else if treatment.kind === "unwrap"}
                    {@render renderChildren()}
                {:else}
                    <span>{node.openingMarkup}</span>{@render renderChildren()}<span>{treatment.closingMarkup}</span>
                {/if}
            {/snippet}

            {#if props.renderTag}
                {@render props.renderTag(node.tag, renderChildren, node.attributes, renderDefault)}
            {:else}
                {@render renderDefault()}
            {/if}
        {/if}
    {/each}
{/snippet}

{@render renderNodes(parsedTree)}
