<script lang="ts">
    import type { Snippet } from "svelte";

    import { RichText } from "@thewaver/ss-components-svelte";
    import {
        DOCS_PROSE_ALLOWED_ATTRIBUTES,
        DOCS_PROSE_WCAG_TAG,
    } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
    import {
        toDocsProseClasses,
        toWcagHref,
    } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.utils";

    import type { PageDocsProseProps } from "./DocsProseSvelte.types";

    let props: PageDocsProseProps = $props();
</script>

{#snippet renderProseTag(
    tag: string,
    renderChildren: Snippet,
    attributes: Record<string, string>,
    renderDefault: Snippet,
)}
    {@const href = tag === DOCS_PROSE_WCAG_TAG ? toWcagHref(attributes.id) : undefined}
    {#if href !== undefined}
        <a {href}>{@render renderChildren()}</a>
    {:else}
        {@render renderDefault()}
    {/if}
{/snippet}

<RichText
    content={props.content}
    allowedAttributes={DOCS_PROSE_ALLOWED_ATTRIBUTES}
    computeClassNames={toDocsProseClasses}
    renderTag={renderProseTag}
/>
