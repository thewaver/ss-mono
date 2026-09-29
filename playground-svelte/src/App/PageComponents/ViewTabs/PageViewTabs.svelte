<script lang="ts">
    import { Tabs } from "@thewaver/ss-components-svelte";
    import {
        PAGE_VIEW_KEYS,
        PAGE_VIEW_LABELS,
        toPageViewKey,
        toPageViewRoute,
    } from "@thewaver/ss-playground/App/PageComponents/ViewTabs/ViewTabs.const";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/ViewTabs/ViewTabs.css";

    import { navigate, route } from "../../App.router";
    import type { RoutePath } from "../../App.types";
    import PageTabContent from "../../StyledComponents/TabContent/PageTabContent.svelte";
    import PageTabFloater from "../../StyledComponents/TabContent/PageTabFloater.svelte";
    import PageTabGutter from "../../StyledComponents/TabContent/PageTabGutter.svelte";
    import PageViewTabLink from "./PageViewTabLink.svelte";
    import type { PageViewKey, PageViewTabsProps } from "./ViewTabs.types";

    const TAB_GAP = 20;
    const TAB_ORIENTATION = "horizontal";
    const EXAMPLES_VIEW: PageViewKey = "examples";

    let props: PageViewTabsProps = $props();

    const selected = $derived(toPageViewKey(route.pathname, props.baseRoute));

    const tabs = $derived(
        PAGE_VIEW_KEYS.filter((key) => props.hasExamples || key !== EXAMPLES_VIEW).map((key) => ({
            value: key,
            href: toPageViewRoute(props.baseRoute, key),
        })),
    );
</script>

<div class={styles.viewTabs} data-view-tabs="">
    <Tabs
        orientation={TAB_ORIENTATION}
        tabGap={TAB_GAP}
        ariaLabel={"Page views"}
        {tabs}
        selectedValue={selected}
        linkComponent={PageViewTabLink}
        onSelectionChange={(key) => void navigate(toPageViewRoute(props.baseRoute, key) as RoutePath)}
    >
        {#snippet renderGutter()}
            <PageTabGutter orientation={TAB_ORIENTATION} />
        {/snippet}

        {#snippet renderFloater(visibilityTarget, transitionDurationMs)}
            <PageTabFloater orientation={TAB_ORIENTATION} {visibilityTarget} {transitionDurationMs} />
        {/snippet}

        {#snippet renderTab(tab, flags)}
            <PageTabContent {flags} orientation={TAB_ORIENTATION} isSelected={tab.value === selected}>
                {PAGE_VIEW_LABELS[tab.value]}
            </PageTabContent>
        {/snippet}
    </Tabs>
</div>
