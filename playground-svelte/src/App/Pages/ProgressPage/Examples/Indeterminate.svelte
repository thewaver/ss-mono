<script lang="ts">
    import { Progress } from "@thewaver/ss-components-svelte";

    import PageProgressContent from "../../../StyledComponents/ProgressContent/ProgressContent.svelte";
</script>

<Progress ariaLabel={"Reticulating splines"} sizing={"fit-content"}>
    {#snippet renderContent(state)}
        <PageProgressContent {state} />
    {/snippet}
</Progress>
