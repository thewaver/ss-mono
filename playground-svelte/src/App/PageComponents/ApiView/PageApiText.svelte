<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";

    import type { PageApiTextProps } from "./ApiViewSvelte.types";

    let props: PageApiTextProps = $props();
</script>

{#each props.text as part, index (index)}{#if part.kind === "prop"}<span class={styles.docsPropName}>{part.text}</span
        >{:else if part.kind === "link"}<a href={part.href}>{part.text}</a>{:else}{part.text}{/if}{/each}
