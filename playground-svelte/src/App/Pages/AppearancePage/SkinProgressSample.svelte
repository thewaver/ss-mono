<script lang="ts">
    import { Progress } from "@thewaver/ss-components-svelte";
    import { SKIN_SAMPLE_PROGRESS } from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.const";

    import PageProgressContent from "../../StyledComponents/ProgressContent/ProgressContent.svelte";
    import SkinBarCell from "./SkinBarCell.svelte";
    import type { SkinStateProps } from "./AppearancePage.types";

    let props: SkinStateProps = $props();
</script>

<SkinBarCell state={props.state}>
    <Progress value={SKIN_SAMPLE_PROGRESS} hasError={props.hasError} ariaLabel={props.state}>
        {#snippet renderContent(state)}
            <PageProgressContent {state} />
        {/snippet}
    </Progress>
</SkinBarCell>
