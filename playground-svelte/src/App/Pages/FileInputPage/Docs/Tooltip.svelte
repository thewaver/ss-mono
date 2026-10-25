<script lang="ts">
    import { FileInput } from "@thewaver/ss-components-svelte";

    import PageFileInputContent from "../../../StyledComponents/FileInputContent/FileInputContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { FileInputTooltipDocsExampleProps } from "../FileInputPageSvelte.types";

    type Props = FileInputTooltipDocsExampleProps;

    let props: Props = $props();

    let files = $state.raw<File[]>([]);
</script>

<FileInput
    bind:files
    isDisabled={props.isDisabled}
    isReachableWhenDisabled={props.isReachableWhenDisabled}
    ariaLabel={"Disabled but reachable attachment"}
    tooltipDefs={{
        placement: { x: "center", y: "top_out" },
        offset: { x: 0, y: 10 },
        hoverShowDelayMs: 0,
        renderContent: tooltip,
    }}
>
    {#snippet renderContent(renderProps)}
        <PageFileInputContent {renderProps} />
    {/snippet}
</FileInput>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        Focusable so this tooltip can be read, but the file dialog must not open.
    </PageTooltipContent>
{/snippet}
