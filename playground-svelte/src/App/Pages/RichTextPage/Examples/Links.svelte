<script lang="ts">
    import type { Snippet } from "svelte";

    import { RichText } from "@thewaver/ss-components-svelte";
    import { toOwnAppHref } from "@thewaver/ss-playground/App/PageComponents/FrameworkSwitch/FrameworkSwitch.const";
    import { LINKS_CONTENT } from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/RichTextPage/RichTextPage.css";

    const LINK_ATTRIBUTES = { a: ["href"] };

    const SAFE_HREF_RE = /^(https:\/\/|\/(?!\/)|#)/;
</script>

{#snippet renderLinkTag(
    tag: string,
    renderChildren: Snippet,
    attributes: Record<string, string>,
    renderDefault: Snippet,
)}
    {#if tag === "a" && SAFE_HREF_RE.test(attributes.href ?? "")}
        <a href={toOwnAppHref(attributes.href)} class={styles.link}>
            {@render renderChildren()}
        </a>
    {:else}
        {@render renderDefault()}
    {/if}
{/snippet}

<div class={styles.proseText}>
    <RichText content={LINKS_CONTENT} allowedAttributes={LINK_ATTRIBUTES} renderTag={renderLinkTag} />
</div>
