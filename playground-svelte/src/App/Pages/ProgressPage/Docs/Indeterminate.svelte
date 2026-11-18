<script lang="ts">
    import { Progress } from "@thewaver/ss-components-svelte";

    import PageProgressContent from "../../../StyledComponents/ProgressContent/ProgressContent.svelte";
    import { RETICULATING_SPLINES_LABEL } from "@thewaver/ss-playground/App/Pages/ProgressPage/ProgressPage.const";
</script>

<Progress ariaLabel={RETICULATING_SPLINES_LABEL}>
    {#snippet renderContent(state)}
        <PageProgressContent {state} />
    {/snippet}
</Progress>
