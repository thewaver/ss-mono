<script lang="ts">
    import { SplitPane } from "@thewaver/ss-components-svelte";
    import { PAIR } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

    import PageSplitPaneBox from "../../../StyledComponents/SplitPaneContent/PageSplitPaneBox.svelte";
    import PageSplitPaneFrame from "../../../StyledComponents/SplitPaneContent/PageSplitPaneFrame.svelte";
    import PageSplitPaneGutter from "../../../StyledComponents/SplitPaneContent/PageSplitPaneGutter.svelte";
    import type { SplitPaneExampleProps } from "../SplitPanePage.types";

    type Props = SplitPaneExampleProps;

    let { ratios = $bindable(), ...props }: Props = $props();
</script>

<PageSplitPaneFrame>
    <SplitPane
        panes={PAIR}
        bind:ratios
        orientation={"vertical"}
        gutterSize={props.gutterSize}
        isDisabled={props.isDisabled}
        ariaLabel={"Stacked panes"}
    >
        {#snippet renderPane(_pane, index)}
            <PageSplitPaneBox>{index === 0 ? "Top" : "Bottom"}</PageSplitPaneBox>
        {/snippet}

        {#snippet renderGutter(flags)}
            <PageSplitPaneGutter {flags} orientation={"vertical"} />
        {/snippet}
    </SplitPane>
</PageSplitPaneFrame>
