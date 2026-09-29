<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ButtonContent/ButtonContent.css";

    import type { ButtonContentProps } from "./ButtonContent.types";

    let props: ButtonContentProps & { children?: Snippet } = $props();
</script>

<div
    class={[
        styles.buttonContent,
        props.flags.isHovered && styles.isHovered,
        props.flags.isActive && styles.isActive,
        props.flags.isDisabled && styles.isDisabled,
        props.flags.hasError && styles.hasError,
    ]}
>
    {@render props.children?.()}
</div>
