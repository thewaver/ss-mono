<script lang="ts">
    import { Progress } from "@thewaver/ss-components-svelte";

    import PageProgressContent from "../../../StyledComponents/ProgressContent/ProgressContent.svelte";
    import type { ProgressExampleProps } from "../ProgressPage.types";

    const BYTES_PER_KB = 1000;

    type Props = ProgressExampleProps;

    let props: Props = $props();
</script>

<Progress
    value={props.uploadedBytes}
    max={props.uploadTotalBytes}
    ariaLabel={"Upload"}
    ariaValueText={`${Math.round(props.uploadedBytes / BYTES_PER_KB)} of ${Math.round(
        props.uploadTotalBytes / BYTES_PER_KB,
    )} kB`}
    sizing={"fit-content"}
>
    {#snippet renderContent(state)}
        <PageProgressContent {state} />
    {/snippet}
</Progress>
