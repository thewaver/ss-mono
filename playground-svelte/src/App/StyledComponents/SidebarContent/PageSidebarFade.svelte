<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SidebarContent/SidebarContent.css";

    import type { SidebarFadeProps } from "./SidebarContent.types";

    let props: SidebarFadeProps & { children?: Snippet } = $props();
</script>

<div
    class={[
        styles.sidebarFade,
        (props.phase === "collapsing" || props.phase === "collapsed") && styles.isFaded,
        props.phase === "collapsed" && styles.isHidden,
    ]}
    style:transition-duration={`${props.transitionDurationMs}ms`}
>
    {@render props.children?.()}
</div>
