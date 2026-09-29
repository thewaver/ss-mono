<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/DrawerPanel/DrawerPanel.css";

    import PageLayer from "../../PageComponents/Layer/Layer.svelte";
    import type { DrawerPanelProps } from "./DrawerPanel.types";

    let props: DrawerPanelProps & { children?: Snippet } = $props();
</script>

<div
    class={[
        styles.drawerPanel,
        styles.drawerSizeVariants[props.edge],
        props.visibilityTarget === 1 ? styles.drawerSlideOn : styles.drawerSlideOffVariants[props.edge],
    ]}
    style:transition={`transform ${props.transitionDurationMs}ms`}
>
    <PageLayer level={1}>{@render props.children?.()}</PageLayer>
</div>
