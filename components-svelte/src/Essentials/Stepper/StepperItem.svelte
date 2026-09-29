<script lang="ts" generics="TValue, TState">
    import { StepperStyles as styles } from "@thewaver/ss-components";

    import type { StepperItemProps } from "./Stepper.types.js";

    let props: StepperItemProps<TValue, TState> = $props();

    const isNavigable = $derived(props.step.isNavigable ?? false);
</script>

<button
    {@attach props.attachElement}
    type="button"
    class={styles.stepperItem}
    id={props.step.id}
    aria-label={props.ariaLabel}
    aria-current={props.flags.isCurrent ? "step" : undefined}
    aria-disabled={isNavigable ? undefined : true}
    onclick={() => {
        if (!isNavigable) return;

        props.onSelect(props.step.value);
    }}
>
    {@render props.renderContent(props.flags)}
</button>
