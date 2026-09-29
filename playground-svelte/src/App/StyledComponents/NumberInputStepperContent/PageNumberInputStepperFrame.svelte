<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/NumberInputStepperContent/NumberInputStepperContent.css";

    let props: { children?: Snippet } = $props();
</script>

<div class={styles.numberInputStepper}>{@render props.children?.()}</div>
