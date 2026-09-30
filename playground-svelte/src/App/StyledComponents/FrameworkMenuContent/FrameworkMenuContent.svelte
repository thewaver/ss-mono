<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/FrameworkMenuContent/FrameworkMenuContent.css";

    import type { FrameworkMenuTriggerProps } from "./FrameworkMenuContent.types";

    let props: FrameworkMenuTriggerProps & { children?: Snippet } = $props();
</script>

<span
    class={[
        styles.frameworkMenuTrigger,
        props.flags.isHovered && styles.isHovered,
        props.flags.isOpen && styles.isOpen,
    ]}
>
    <span class={styles.frameworkMenuName}>{@render props.children?.()}</span>

    <span class={styles.frameworkMenuChevron} aria-hidden="true">{props.flags.isOpen ? "▴" : "▾"}</span>
</span>
