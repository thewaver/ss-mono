<script lang="ts">
    import { SplitPane } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { PAIR, STARTING_PAIR } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";
    import { SplitPanePageUtils } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.utils";

    import PageSplitPaneBox from "../../../StyledComponents/SplitPaneContent/PageSplitPaneBox.svelte";
    import PageSplitPaneFrame from "../../../StyledComponents/SplitPaneContent/PageSplitPaneFrame.svelte";
    import PageSplitPaneGutter from "../../../StyledComponents/SplitPaneContent/PageSplitPaneGutter.svelte";
    import type { SplitPaneBasicDocsExampleProps } from "../SplitPanePageSvelte.types";

    type Props = SplitPaneBasicDocsExampleProps;

    let props: Props = $props();

    let ratios = $state(STARTING_PAIR);
</script>

<PageSplitPaneFrame>
    <SplitPane
        panes={PAIR}
        bind:ratios
        orientation={props.orientation}
        gutterSize={props.gutterSize}
        isDisabled={props.isDisabled}
        ariaLabel={"Two panes"}
    >
        {#snippet renderPane(_pane, index)}
            <PageSplitPaneBox>{index === 0 ? "Navigation" : "Content"}</PageSplitPaneBox>
        {/snippet}

        {#snippet renderGutter(flags)}
            <PageSplitPaneGutter {flags} orientation={props.orientation} />
        {/snippet}
    </SplitPane>
</PageSplitPaneFrame>

<div class={exampleStyles.exampleReadout} data-readout>{`Ratios: ${SplitPanePageUtils.toPercentText(ratios)}`}</div>
