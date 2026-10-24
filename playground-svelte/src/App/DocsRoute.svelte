<script lang="ts">
    import { toBaseRoute } from "@thewaver/ss-playground/App/PageComponents/ViewTabs/ViewTabs.const";

    import { COMPONENT_CONFIGS_BY_ROUTE, route } from "./App.router";
    import PageDocsView from "./PageComponents/DocsView/PageDocsView.svelte";
    import { MENU_DESCRIPTIONS } from "@thewaver/ss-playground/App/MenuDescriptions.const";

    const config = $derived(COMPONENT_CONFIGS_BY_ROUTE[toBaseRoute(route.pathname)]);
</script>

{#if config}
    <PageDocsView description={MENU_DESCRIPTIONS[config.name]}>
        {#if config.docs}
            {#await config.docs() then { default: Docs }}
                <Docs />
            {/await}
        {/if}
    </PageDocsView>
{/if}
