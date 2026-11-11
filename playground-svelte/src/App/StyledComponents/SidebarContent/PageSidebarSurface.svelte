<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SidebarContent/SidebarContent.css";

    import PageLayer from "../../PageComponents/Layer/Layer.svelte";
    import { getNextLayerClass } from "../Layer/Layer.context";
    import type { SidebarSurfaceProps } from "./SidebarContentSvelte.types";

    let props: SidebarSurfaceProps & { children?: Snippet } = $props();

    const getNextLayerClassName = getNextLayerClass();
</script>

<div class={[styles.sidebarSurface, getNextLayerClassName()]}>
    <div class={styles.sidebarSurfaceContent} style:width={`${props.width}px`}>
        <PageLayer>{@render props.children?.()}</PageLayer>
    </div>
</div>
