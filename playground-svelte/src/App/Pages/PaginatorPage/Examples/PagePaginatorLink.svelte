<script lang="ts">
    import type { PaginatorLinkProps } from "@thewaver/ss-components-svelte";

    let { children, ...props }: PaginatorLinkProps = $props();
</script>

<a {...props} data-link-component="">{@render children?.()}</a>
