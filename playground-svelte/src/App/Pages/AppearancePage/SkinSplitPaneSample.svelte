<script lang="ts">
    import { SplitPane } from "@thewaver/ss-components-svelte";
    import { SKIN_SAMPLE_SPLIT } from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.const";
    import { PAIR } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

    import PageSplitPaneBox from "../../StyledComponents/SplitPaneContent/PageSplitPaneBox.svelte";
    import PageSplitPaneFrame from "../../StyledComponents/SplitPaneContent/PageSplitPaneFrame.svelte";
    import PageSplitPaneGutter from "../../StyledComponents/SplitPaneContent/PageSplitPaneGutter.svelte";

    let ratios = $state(SKIN_SAMPLE_SPLIT);
</script>

<PageSplitPaneFrame>
    <SplitPane panes={PAIR} bind:ratios orientation={"horizontal"} ariaLabel={"Split pane"}>
        {#snippet renderPane(_pane, index)}
            <PageSplitPaneBox>{index === 0 ? "Navigation" : "Content"}</PageSplitPaneBox>
        {/snippet}

        {#snippet renderGutter(flags)}
            <PageSplitPaneGutter {flags} orientation={"horizontal"} />
        {/snippet}
    </SplitPane>
</PageSplitPaneFrame>
