<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SidebarContent/SidebarContent.css";

    import type { SidebarFrameProps } from "./SidebarContent.types";

    let props: SidebarFrameProps & { children?: Snippet } = $props();
</script>

<div class={[styles.sidebarFrame, styles.sidebarFrameVariants[props.edge]]}>{@render props.children?.()}</div>
