<script lang="ts">
    import type { Snippet } from "svelte";

    import { RichText } from "@thewaver/ss-components-svelte";
    import { GLOSSARY_CONTENT } from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.css";

    import GlossaryTerm from "./GlossaryTerm.svelte";

    const GLOSSARY_ATTRIBUTES = { term: ["tip"] };
</script>

{#snippet renderGlossaryTag(
    tag: string,
    renderChildren: Snippet,
    attributes: Record<string, string>,
    renderDefault: Snippet,
)}
    {#if tag === "term" && attributes.tip !== undefined}
        <GlossaryTerm tip={attributes.tip}>{@render renderChildren()}</GlossaryTerm>
    {:else}
        {@render renderDefault()}
    {/if}
{/snippet}

<div class={styles.proseText}>
    <RichText content={GLOSSARY_CONTENT} allowedAttributes={GLOSSARY_ATTRIBUTES} renderTag={renderGlossaryTag} />
</div>
