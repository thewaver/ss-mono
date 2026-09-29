<script lang="ts">
    import { SplitPane } from "@thewaver/ss-components-svelte";
    import { TRIPLE } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";

    import PageSplitPaneBox from "../../../StyledComponents/SplitPaneContent/PageSplitPaneBox.svelte";
    import PageSplitPaneFrame from "../../../StyledComponents/SplitPaneContent/PageSplitPaneFrame.svelte";
    import PageSplitPaneGutter from "../../../StyledComponents/SplitPaneContent/PageSplitPaneGutter.svelte";
    import type { SplitPaneExampleProps } from "../SplitPanePage.types";

    type Props = SplitPaneExampleProps;

    let { ratios = $bindable(), ...props }: Props = $props();
</script>

<PageSplitPaneFrame>
    <SplitPane
        panes={TRIPLE}
        bind:ratios
        gutterSize={props.gutterSize}
        isDisabled={props.isDisabled}
        ariaLabel={"Three panes"}
    >
        {#snippet renderPane(_pane, index)}
            <PageSplitPaneBox>Pane {index + 1}</PageSplitPaneBox>
        {/snippet}

        {#snippet renderGutter(flags)}
            <PageSplitPaneGutter {flags} orientation={"horizontal"} />
        {/snippet}
    </SplitPane>
</PageSplitPaneFrame>
