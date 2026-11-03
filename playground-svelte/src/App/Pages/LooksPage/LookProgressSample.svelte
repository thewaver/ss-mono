<script lang="ts">
    import { Progress } from "@thewaver/ss-components-svelte";
    import { LOOK_SAMPLE_PROGRESS } from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.const";

    import PageProgressContent from "../../StyledComponents/ProgressContent/ProgressContent.svelte";
    import LookBarCell from "./LookBarCell.svelte";
    import type { LookStateProps } from "./LooksPage.types";

    let props: LookStateProps = $props();
</script>

<LookBarCell state={props.state}>
    <Progress value={LOOK_SAMPLE_PROGRESS} hasError={props.hasError} ariaLabel={props.state}>
        {#snippet renderContent(state)}
            <PageProgressContent {state} />
        {/snippet}
    </Progress>
</LookBarCell>
