<script lang="ts">
    import { SplitPane } from "@thewaver/ss-components-svelte";
    import { COMPARE } from "@thewaver/ss-playground/App/Pages/SplitPanePage/SplitPanePage.const";
    import knight_date from "@thewaver/ss-playground/App/knight_date.webp";
    import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";

    import PageSplitPaneCompareBox from "../../../StyledComponents/SplitPaneContent/PageSplitPaneCompareBox.svelte";
    import PageSplitPaneCompareFrame from "../../../StyledComponents/SplitPaneContent/PageSplitPaneCompareFrame.svelte";
    import PageSplitPaneGutter from "../../../StyledComponents/SplitPaneContent/PageSplitPaneGutter.svelte";
    import type { SplitPaneExampleProps } from "../SplitPanePage.types";

    type Props = SplitPaneExampleProps;

    const PICTURES = [
        { src: knight_profile, alt: "The knight in an office" },
        { src: knight_date, alt: "The knight at a candlelit table" },
    ];

    let { ratios = $bindable(), ...props }: Props = $props();
</script>

<PageSplitPaneCompareFrame>
    <SplitPane
        panes={COMPARE}
        bind:ratios
        gutterSize={props.gutterSize}
        isDisabled={props.isDisabled}
        ariaLabel={"Compare two pictures"}
    >
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
