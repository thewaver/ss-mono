<script lang="ts">
    import { FileInput } from "@thewaver/ss-components-svelte";

    import PageFileInputContent from "../../../StyledComponents/FileInputContent/FileInputContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { FileInputExampleProps } from "../FileInputPage.types";

    type Props = FileInputExampleProps;

    let { files = $bindable() }: Props = $props();
</script>

<FileInput
    bind:files
    isDisabled={true}
    isReachableWhenDisabled={true}
    ariaLabel={"Disabled but reachable attachment"}
    tooltipDefs={{
        placement: { x: "center", y: "top-out" },
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
