<script lang="ts">
    import { Staircase, StaircaseIndents } from "@thewaver/ss-components-svelte";

    import PageStaircaseStep from "../../../StyledComponents/StaircaseContent/StaircaseContent.svelte";
    import type { StaircaseExampleProps } from "../StaircasePage.types";

    type Props = StaircaseExampleProps;

    let { indentKey, ...otherProps }: Props = $props();
</script>

<Staircase {...otherProps} computeStepIndent={(defs) => StaircaseIndents.SAMPLE_INDENTS[indentKey](defs)}>
    {#snippet renderStep(step, state)}
        <PageStaircaseStep {state}>{step}</PageStaircaseStep>
    {/snippet}
</Staircase>
