<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SidebarContent/SidebarContent.css";

    import PageLayer from "../../PageComponents/Layer/Layer.svelte";
    import type { SidebarSurfaceProps } from "./SidebarContent.types";

    let props: SidebarSurfaceProps & { children?: Snippet } = $props();
</script>

<div class={styles.sidebarSurface}>
    <div class={styles.sidebarSurfaceContent} style:width={`${props.width}px`}>
        <PageLayer level={1}>{@render props.children?.()}</PageLayer>
    </div>
</div>
