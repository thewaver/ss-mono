<script lang="ts">
    import { SplitPane } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { RIGHT_TO_LEFT, STARTING_RIGHT_TO_LEFT, TWO_PANES_RIGHT_LEFT_LABEL } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.css";
    import { SplitPanePageUtils } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.utils";

    import PageSplitPaneBox from "../../../StyledComponents/SplitPaneContent/PageSplitPaneBox.svelte";
    import PageSplitPaneFrame from "../../../StyledComponents/SplitPaneContent/PageSplitPaneFrame.svelte";
    import PageSplitPaneGutter from "../../../StyledComponents/SplitPaneContent/PageSplitPaneGutter.svelte";

    let ratios = $state(STARTING_RIGHT_TO_LEFT);
</script>

<div dir={"rtl"} class={styles.docsDirectionBox}>
    <PageSplitPaneFrame>
        <SplitPane panes={RIGHT_TO_LEFT} bind:ratios ariaLabel={TWO_PANES_RIGHT_LEFT_LABEL}>
            {#snippet renderPane(_pane, index)}
                <PageSplitPaneBox>{index === 0 ? "Navigation" : "Content"}</PageSplitPaneBox>
            {/snippet}

            {#snippet renderGutter(flags)}
                <PageSplitPaneGutter {flags} orientation={"horizontal"} />
            {/snippet}
        </SplitPane>
    </PageSplitPaneFrame>
</div>

<div class={exampleStyles.exampleReadout} data-readout>{`Ratios: ${SplitPanePageUtils.toPercentText(ratios)}`}</div>
