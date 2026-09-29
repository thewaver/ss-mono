<script lang="ts">
    import type { TabLinkProps } from "@thewaver/ss-components-svelte";

    let { children, ...props }: TabLinkProps = $props();
</script>

<a {...props} data-link-component="">{@render children?.()}</a>
