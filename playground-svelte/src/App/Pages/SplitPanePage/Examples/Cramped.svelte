<script lang="ts">
    import { SplitPane } from "@thewaver/ss-components-svelte";
    import { CRAMPED } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

    import PageSplitPaneBox from "../../../StyledComponents/SplitPaneContent/PageSplitPaneBox.svelte";
    import PageSplitPaneFrame from "../../../StyledComponents/SplitPaneContent/PageSplitPaneFrame.svelte";
    import PageSplitPaneGutter from "../../../StyledComponents/SplitPaneContent/PageSplitPaneGutter.svelte";
    import type { SplitPaneExampleProps } from "../SplitPanePage.types";

    const CRAMPED_WIDTH = 600;

    type Props = SplitPaneExampleProps;

    let { ratios = $bindable(), ...props }: Props = $props();
</script>

<div style:width={`${CRAMPED_WIDTH}px`} style:overflow-x={"auto"}>
    <PageSplitPaneFrame>
        <SplitPane
            panes={CRAMPED}
            bind:ratios
            gutterSize={props.gutterSize}
            isDisabled={props.isDisabled}
            ariaLabel={"Cramped panes"}
        >
            {#snippet renderPane(_pane, index)}
                <PageSplitPaneBox>{index === 0 ? "min 250px" : "min 400px"}</PageSplitPaneBox>
            {/snippet}

            {#snippet renderGutter(flags)}
                <PageSplitPaneGutter {flags} orientation={"horizontal"} />
            {/snippet}
        </SplitPane>
    </PageSplitPaneFrame>
</div>
