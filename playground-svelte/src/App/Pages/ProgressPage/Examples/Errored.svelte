<script lang="ts">
    import { Progress } from "@thewaver/ss-components-svelte";

    import PageProgressContent from "../../../StyledComponents/ProgressContent/ProgressContent.svelte";

    const STALLED_RATIO = 0.62;
</script>

<Progress value={STALLED_RATIO} hasError={true} ariaLabel={"Failed upload"} sizing={"fit-content"}>
    {#snippet renderContent(state)}
        <PageProgressContent {state} />
    {/snippet}
</Progress>
