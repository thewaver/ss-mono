<script lang="ts" generics="T">
    import { STAIRCASE_DEFAULTS, StaircaseUtils, StaircaseStyles as styles } from "@thewaver/ss-components";

    import type { StaircaseProps } from "./Staircase.types.js";

    let props: StaircaseProps<T> = $props();

    const dir = $derived(props.dir ?? STAIRCASE_DEFAULTS.dir);
    const gap = $derived(props.gap ?? STAIRCASE_DEFAULTS.gap);
    const stepCount = $derived(props.steps.length);
</script>

<div class={styles.staircaseRoot} style:gap={`${gap}px`}>
    {#each props.steps as step, index (index)}
        {@const defs = StaircaseUtils.computeStepDefs(index, stepCount, dir, props.indent)}
        {@const stepIndent = StaircaseUtils.computeStepIndent(defs, props.computeStepIndent)}
        <div
            class={styles.staircaseStep}
            style:padding-left={`${stepIndent}px`}
            style:padding-right={`${stepIndent}px`}
        >
            {@render props.renderStep(step, { ...defs, stepIndent })}
        </div>
    {/each}
</div>
