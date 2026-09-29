<script lang="ts">
    import type { TabLinkProps } from "@thewaver/ss-components-svelte";

    import PageRouterLink from "../RouterLink/RouterLink.svelte";

    let props: TabLinkProps = $props();
</script>

<PageRouterLink {...props} replace={true} data-view-tab={props.href} />
