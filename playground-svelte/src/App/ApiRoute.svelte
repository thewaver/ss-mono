<script lang="ts">
    import { toBaseRoute } from "@thewaver/ss-playground/App/PageComponents/ViewTabs/ViewTabs.const";

    import { COMPONENT_CONFIGS_BY_ROUTE, route } from "./App.router";
    import PageApiView from "./PageComponents/ApiView/PageApiView.svelte";

    const config = $derived(COMPONENT_CONFIGS_BY_ROUTE[toBaseRoute(route.pathname)]);
</script>

{#if config}
    <PageApiView name={config.name} />
{/if}
