<script lang="ts">
    import { PAGINATOR_DEFAULTS, PaginatorUtils, PaginatorStyles as styles } from "@thewaver/ss-components";

    import { getPaginatorContext } from "./Paginator.context.js";
    import type { PaginatorStepsProps } from "./Paginator.types.js";
    import PaginatorStepControl from "./PaginatorStepControl.svelte";

    let props: PaginatorStepsProps = $props();

    const context = getPaginatorContext("PaginatorSteps");

    const steps = $derived(PaginatorUtils.splitSteps(props.steps ?? PAGINATOR_DEFAULTS.steps));
</script>

{#if context}
    <div class={styles.paginatorRow} style:gap={`${props.gap ?? PAGINATOR_DEFAULTS.gap}px`}>
        {#each steps.leading as step, index (index)}
            <PaginatorStepControl
                {context}
                {step}
                computeStepLabel={props.computeStepLabel}
                renderStep={props.renderStep}
            />
        {/each}

        {@render props.children?.()}

        {#each steps.trailing as step, index (index)}
            <PaginatorStepControl
                {context}
                {step}
                computeStepLabel={props.computeStepLabel}
                renderStep={props.renderStep}
            />
        {/each}
    </div>
{/if}
