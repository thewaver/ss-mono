<script lang="ts">
    import { onMount } from "svelte";

    import { Progress } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import {
        BYTES_PER_KB,
        UPLOAD_TICK_BYTES,
        UPLOAD_TICK_MS,
        UPLOAD_TOTAL_BYTES,
    } from "@thewaver/ss-playground/App/Pages/ProgressPage/ProgressPage.const";

    import PageProgressRing from "../../../StyledComponents/ProgressRing/ProgressRing.svelte";

    let uploadedBytes = $state(0);

    const valueText = $derived(
        `${Math.round(uploadedBytes / BYTES_PER_KB)} of ${Math.round(UPLOAD_TOTAL_BYTES / BYTES_PER_KB)} kB`,
    );

    onMount(() => {
        const timer = setInterval(() => {
            uploadedBytes = uploadedBytes >= UPLOAD_TOTAL_BYTES ? 0 : uploadedBytes + UPLOAD_TICK_BYTES;
        }, UPLOAD_TICK_MS);

        return () => {
            clearInterval(timer);
        };
    });
</script>

<Progress
    value={uploadedBytes}
    max={UPLOAD_TOTAL_BYTES}
    ariaLabel={"Upload, drawn as a ring"}
    ariaValueText={valueText}
    sizing={"fit-content"}
>
    {#snippet renderContent(state)}
        <PageProgressRing {state} />
    {/snippet}
</Progress>

<div class={exampleStyles.exampleReadout} data-readout>{`Read out as: ${valueText}`}</div>
