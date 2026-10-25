<script lang="ts">
    import { SplitPane } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { BOUNDED, STARTING_BOUNDED } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";
    import { SplitPanePageUtils } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.utils";

    import PageSplitPaneBox from "../../../StyledComponents/SplitPaneContent/PageSplitPaneBox.svelte";
    import PageSplitPaneFrame from "../../../StyledComponents/SplitPaneContent/PageSplitPaneFrame.svelte";
    import PageSplitPaneGutter from "../../../StyledComponents/SplitPaneContent/PageSplitPaneGutter.svelte";

    let ratios = $state(STARTING_BOUNDED);
</script>

<PageSplitPaneFrame>
    <SplitPane panes={BOUNDED} bind:ratios ariaLabel={"Bounded panes"}>
        {#snippet renderPane(_pane, index)}
            <PageSplitPaneBox>{index === 0 ? "Sidebar 120–220px" : "Content min 160px"}</PageSplitPaneBox>
        {/snippet}

        {#snippet renderGutter(flags)}
            <PageSplitPaneGutter {flags} orientation={"horizontal"} />
        {/snippet}
    </SplitPane>
</PageSplitPaneFrame>

<div class={exampleStyles.exampleReadout} data-readout>{`Ratios: ${SplitPanePageUtils.toPercentText(ratios)}`}</div>
