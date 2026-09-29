<script lang="ts">
    import { Progress } from "@thewaver/ss-components-svelte";

    import PageProgressContent from "../../../StyledComponents/ProgressContent/ProgressContent.svelte";

    const RATIO = 0.4;
</script>

<Progress value={RATIO} ariaLabel={"Setup progress"} sizing={"fit-content"}>
    {#snippet renderContent(state)}
        <PageProgressContent {state} />
    {/snippet}
</Progress>
