<script lang="ts">
    import { Progress } from "@thewaver/ss-components-svelte";

    import PageProgressContent from "../../../StyledComponents/ProgressContent/ProgressContent.svelte";
    import type { ProgressBasicDocsExampleProps } from "../ProgressPageSvelte.types";

    type Props = ProgressBasicDocsExampleProps;

    let props: Props = $props();
</script>

<Progress value={props.value} hasError={props.hasError} ariaLabel={"Setup progress"}>
    {#snippet renderContent(state)}
        <PageProgressContent {state} />
    {/snippet}
</Progress>
