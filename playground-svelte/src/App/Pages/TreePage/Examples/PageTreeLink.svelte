<script lang="ts">
    import type { TreeLinkProps } from "@thewaver/ss-components-svelte";

    let { children, ...props }: TreeLinkProps = $props();
</script>

<a {...props} data-link-component="">{@render children?.()}</a>
