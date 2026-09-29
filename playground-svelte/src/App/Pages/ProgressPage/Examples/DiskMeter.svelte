<script lang="ts">
    import { Progress } from "@thewaver/ss-components-svelte";

    import PageProgressContent from "../../../StyledComponents/ProgressContent/ProgressContent.svelte";

    const USED_GB = 412;
    const TOTAL_GB = 512;
</script>

<Progress
    role={"meter"}
    value={USED_GB}
    max={TOTAL_GB}
    ariaLabel={"Disk usage"}
    ariaValueText={`${USED_GB} of ${TOTAL_GB} GB used`}
    sizing={"fit-content"}
>
    {#snippet renderContent(state)}
        <PageProgressContent {state} />
    {/snippet}
</Progress>
