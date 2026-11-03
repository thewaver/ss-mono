<script lang="ts">
    import { Progress } from "@thewaver/ss-components-svelte";

    import PageProgressContent from "../../../StyledComponents/ProgressContent/ProgressContent.svelte";

    const RATIO = 0.6;
</script>

<Progress value={RATIO} ariaLabel={"Battery charge"}>
    {#snippet renderContent(state)}
        <PageProgressContent {state} orientation={"vertical"} />
    {/snippet}
</Progress>
