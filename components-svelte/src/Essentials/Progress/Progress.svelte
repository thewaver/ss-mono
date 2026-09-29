<script lang="ts">
    import { untrack } from "svelte";

    import { PROGRESS_DEFAULTS, ProgressUtils, ProgressStyles as styles } from "@thewaver/ss-components";

    import type { ProgressProps } from "./Progress.types.js";

    let props: ProgressProps = $props();

    const sizing = $derived(props.sizing ?? PROGRESS_DEFAULTS.sizing);
    const min = $derived(props.min ?? PROGRESS_DEFAULTS.min);
    const max = $derived(props.max ?? PROGRESS_DEFAULTS.max);
    const role = $derived(props.role ?? PROGRESS_DEFAULTS.role);

    const progressState = $derived(
        ProgressUtils.computeState({
            value: props.value,
            min,
            max,
            role,
            hasError: props.hasError ?? false,
        }),
    );

    $effect(() => untrack(() => ProgressUtils.warnIfEmptyRange(min, max)));
</script>

<div
    id={props.id}
    class={[styles.progressRoot, styles.progressSizingVariants[sizing]]}
    {role}
    aria-label={props.ariaLabel}
    aria-labelledby={props.ariaLabelledBy}
    aria-valuemin={min}
    aria-valuemax={max}
    aria-valuenow={progressState.value}
    aria-valuetext={props.ariaValueText}
    aria-invalid={progressState.hasError || undefined}
>
    {@render props.renderContent(progressState)}
</div>
