<script lang="ts">
    import { SplitPane } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { TRIPLE, STARTING_TRIPLE } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";
    import { SplitPanePageUtils } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.utils";

    import PageSplitPaneBox from "../../../StyledComponents/SplitPaneContent/PageSplitPaneBox.svelte";
    import PageSplitPaneFrame from "../../../StyledComponents/SplitPaneContent/PageSplitPaneFrame.svelte";
    import PageSplitPaneGutter from "../../../StyledComponents/SplitPaneContent/PageSplitPaneGutter.svelte";

    let ratios = $state(STARTING_TRIPLE);
</script>

<PageSplitPaneFrame>
    <SplitPane panes={TRIPLE} bind:ratios ariaLabel={"Three panes"}>
        {#snippet renderPane(_pane, index)}
            <PageSplitPaneBox>Pane {index + 1}</PageSplitPaneBox>
        {/snippet}

        {#snippet renderGutter(flags)}
            <PageSplitPaneGutter {flags} orientation={"horizontal"} />
        {/snippet}
    </SplitPane>
</PageSplitPaneFrame>

<div class={exampleStyles.exampleReadout} data-readout>{`Ratios: ${SplitPanePageUtils.toPercentText(ratios)}`}</div>
