<script lang="ts">
    import { PlacementLayoutUtils, Tabs } from "@thewaver/ss-components-svelte";
    import type { HoneycombDefs } from "@thewaver/ss-components-svelte";
    import {
        HONEYCOMB_TABS,
        PANEL_BODIES,
        getPanelId,
        getTabId,
    } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.css";

    import PageTabPanel from "../../../PageComponents/TabPanel/TabPanel.svelte";
    import PageTabCell from "../../../StyledComponents/TabContent/PageTabCell.svelte";
    import PageTabHexFloater from "../../../StyledComponents/TabContent/PageTabHexFloater.svelte";
    import type { TabsExampleProps } from "../TabsPage.types";

    const HONEYCOMB_DEFS: HoneycombDefs = { perRow: 3, gapRatio: 0 };

    const HONEYCOMB_LAYOUT = PlacementLayoutUtils.createHoneycomb(HONEYCOMB_DEFS);

    const HONEYCOMB_WIDTH = "294px";

    const ID_PREFIX = "honeycomb";

    type Props = TabsExampleProps;

    let props: Props = $props();
</script>

<div class={styles.rowDemo}>
    <div style:width={HONEYCOMB_WIDTH}>
        <Tabs
            ariaLabel={"Honeycomb views"}
            tabs={HONEYCOMB_TABS}
            selectedValue={props.selectedValue}
            computeLayout={HONEYCOMB_LAYOUT}
            onSelectionChange={props.onSelectionChange}
        >
            {#snippet renderFloater(visibilityTarget, transitionDurationMs)}
                <PageTabHexFloater orientation={"horizontal"} {visibilityTarget} {transitionDurationMs} />
            {/snippet}

            {#snippet renderTab(tab, flags)}
                <PageTabCell {flags} isSelected={tab.value === props.selectedValue}>{tab.value}</PageTabCell>
            {/snippet}
        </Tabs>
    </div>

    <PageTabPanel
        id={getPanelId(ID_PREFIX, props.selectedValue ?? "")}
        tabId={getTabId(ID_PREFIX, props.selectedValue ?? "")}
    >
        {PANEL_BODIES[props.selectedValue ?? ""]}
    </PageTabPanel>
</div>
