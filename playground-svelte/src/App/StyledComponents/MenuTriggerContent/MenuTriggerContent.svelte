<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/MenuTriggerContent/MenuTriggerContent.css";

    import type { MenuTriggerContentProps } from "./MenuTriggerContent.types";

    let props: MenuTriggerContentProps & { children?: Snippet } = $props();
</script>

<div
    class={[
        styles.menuTriggerContent,
        props.flags.isHovered && styles.isHovered,
        props.flags.isActive && styles.isActive,
        props.flags.isOpen && styles.isOpen,
        props.flags.isDisabled && styles.isDisabled,
    ]}
>
    <div>{@render props.children?.()}</div>
    <div class={styles.menuTriggerChevron}></div>
</div>
