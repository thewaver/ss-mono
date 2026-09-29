<script lang="ts">
    import { Progress } from "@thewaver/ss-components-svelte";

    import PageProgressRing from "../../../StyledComponents/ProgressRing/ProgressRing.svelte";
    import type { ProgressExampleProps } from "../ProgressPage.types";

    const BYTES_PER_KB = 1000;

    type Props = ProgressExampleProps;

    let props: Props = $props();
</script>

<Progress
    value={props.uploadedBytes}
    max={props.uploadTotalBytes}
    ariaLabel={"Upload, drawn as a ring"}
    ariaValueText={`${Math.round(props.uploadedBytes / BYTES_PER_KB)} of ${Math.round(
        props.uploadTotalBytes / BYTES_PER_KB,
    )} kB`}
    sizing={"fit-content"}
>
    {#snippet renderContent(state)}
        <PageProgressRing {state} />
    {/snippet}
</Progress>
