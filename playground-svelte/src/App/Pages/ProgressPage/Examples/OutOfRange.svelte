<script lang="ts">
    import { Progress } from "@thewaver/ss-components-svelte";

    import PageProgressContent from "../../../StyledComponents/ProgressContent/ProgressContent.svelte";

    const OVERSHOOTING_VALUE = 5;
</script>

<Progress value={OVERSHOOTING_VALUE} ariaLabel={"Clamped progress"} sizing={"fit-content"}>
    {#snippet renderContent(state)}
        <PageProgressContent {state} />
    {/snippet}
</Progress>
