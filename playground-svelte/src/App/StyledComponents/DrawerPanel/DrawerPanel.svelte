<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/DrawerPanel/DrawerPanel.css";

    import PageLayer from "../../PageComponents/Layer/Layer.svelte";
    import { getNextLayerClass } from "../Layer/Layer.context";
    import type { DrawerPanelProps } from "./DrawerPanelSvelte.types";

    let props: DrawerPanelProps & { children?: Snippet } = $props();

    const getNextLayerClassName = getNextLayerClass();
</script>

<div
    class={[
        styles.drawerPanel,
        getNextLayerClassName(),
        styles.drawerSizeVariants[props.edge],
        props.visibilityTarget === 1 ? styles.drawerSlideOn : styles.drawerSlideOffVariants[props.edge],
    ]}
    style:transition={`transform ${props.transitionDurationMs}ms`}
>
    <PageLayer>{@render props.children?.()}</PageLayer>
</div>
