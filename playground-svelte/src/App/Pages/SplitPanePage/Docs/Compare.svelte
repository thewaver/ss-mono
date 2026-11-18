<script lang="ts">
    import { SplitPane } from "@thewaver/ss-components-svelte";
    import { COMPARE, STARTING_COMPARE, PICTURES, COMPARE_TWO_PICTURES_LABEL } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

    import PageSplitPaneCompareBox from "../../../StyledComponents/SplitPaneContent/PageSplitPaneCompareBox.svelte";
    import PageSplitPaneCompareFrame from "../../../StyledComponents/SplitPaneContent/PageSplitPaneCompareFrame.svelte";
    import PageSplitPaneGutter from "../../../StyledComponents/SplitPaneContent/PageSplitPaneGutter.svelte";

    let ratios = $state(STARTING_COMPARE);
</script>

<PageSplitPaneCompareFrame>
    <SplitPane panes={COMPARE} bind:ratios ariaLabel={COMPARE_TWO_PICTURES_LABEL}>
        {#snippet renderPane(_pane, index)}
            <PageSplitPaneCompareBox
                side={index === 0 ? "start" : "end"}
                src={PICTURES[index].src}
                alt={PICTURES[index].alt}
            />
        {/snippet}

        {#snippet renderGutter(flags)}
            <PageSplitPaneGutter {flags} orientation={"horizontal"} />
        {/snippet}
    </SplitPane>
</PageSplitPaneCompareFrame>
