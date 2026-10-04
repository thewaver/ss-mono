<script lang="ts">
    import { Tabs } from "@thewaver/ss-components-svelte";
    import type { Tab } from "@thewaver/ss-components-svelte";
    import {
        PANEL_BODIES,
        ROW_TABS,
        ROW_TAB_GAP,
        getPanelId,
        getTabId,
    } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

    import PageTabPanel from "../../../PageComponents/TabPanel/TabPanel.svelte";
    import PageGlideFloater from "../../../StyledComponents/GlideFloater/PageGlideFloater.svelte";
    import PageTabContent from "../../../StyledComponents/TabContent/PageTabContent.svelte";
    import PageTabFloater from "../../../StyledComponents/TabContent/PageTabFloater.svelte";
    import PageTabGutter from "../../../StyledComponents/TabContent/PageTabGutter.svelte";
    import type { TabsExampleProps } from "../TabsPage.types";

    const DEFAULT_ID_PREFIX = "row";

    type Props = TabsExampleProps & {
        tabs?: Tab<string>[];
        idPrefix?: string;
        hasHoverPill?: boolean;
    };

    let props: Props = $props();

    const idPrefix = $derived(props.idPrefix ?? DEFAULT_ID_PREFIX);
</script>

{#snippet hoverPill(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageGlideFloater kind={"highlight"} {visibilityTarget} {transitionDurationMs} />
{/snippet}

<div class={styles.rowDemo}>
    <Tabs
        orientation={"horizontal"}
        tabGap={ROW_TAB_GAP}
        ariaLabel={"Example views"}
        hasAutoActivation={props.hasAutoActivation}
        tabs={props.tabs ?? ROW_TABS}
        selectedValue={props.selectedValue}
        onSelectionChange={props.onSelectionChange}
        renderHighlightFloater={props.hasHoverPill ? hoverPill : undefined}
    >
        {#snippet renderGutter()}
            <PageTabGutter orientation={"horizontal"} />
        {/snippet}

        {#snippet renderSelectionFloater(visibilityTarget, transitionDurationMs)}
            <PageTabFloater orientation={"horizontal"} {visibilityTarget} {transitionDurationMs} />
        {/snippet}

        {#snippet renderTab(tab, flags)}
            <PageTabContent {flags} orientation={"horizontal"} isSelected={tab.value === props.selectedValue}>
                {tab.value}
            </PageTabContent>
        {/snippet}
    </Tabs>

    <PageTabPanel
        id={getPanelId(idPrefix, props.selectedValue ?? "")}
        tabId={getTabId(idPrefix, props.selectedValue ?? "")}
    >
        {PANEL_BODIES[props.selectedValue ?? ""]}
    </PageTabPanel>
</div>
