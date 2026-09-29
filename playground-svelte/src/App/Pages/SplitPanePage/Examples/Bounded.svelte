<script lang="ts">
    import { SplitPane } from "@thewaver/ss-components-svelte";
    import { BOUNDED } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

    import PageSplitPaneBox from "../../../StyledComponents/SplitPaneContent/PageSplitPaneBox.svelte";
    import PageSplitPaneFrame from "../../../StyledComponents/SplitPaneContent/PageSplitPaneFrame.svelte";
    import PageSplitPaneGutter from "../../../StyledComponents/SplitPaneContent/PageSplitPaneGutter.svelte";
    import type { SplitPaneExampleProps } from "../SplitPanePage.types";

    type Props = SplitPaneExampleProps;

    let { ratios = $bindable(), ...props }: Props = $props();
</script>

<PageSplitPaneFrame>
    <SplitPane
        panes={BOUNDED}
        bind:ratios
        gutterSize={props.gutterSize}
        isDisabled={props.isDisabled}
        ariaLabel={"Bounded panes"}
    >
        {#snippet renderPane(_pane, index)}
            <PageSplitPaneBox>{index === 0 ? "Sidebar 120–220px" : "Content min 160px"}</PageSplitPaneBox>
        {/snippet}

        {#snippet renderGutter(flags)}
            <PageSplitPaneGutter {flags} orientation={"horizontal"} />
        {/snippet}
    </SplitPane>
</PageSplitPaneFrame>
