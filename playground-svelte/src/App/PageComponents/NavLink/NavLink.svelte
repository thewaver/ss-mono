<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/NavLinkContent/NavLinkContent.css";

    import { getLayerClass } from "../../StyledComponents/Layer/Layer.context";
    import PageRouterLink from "../RouterLink/RouterLink.svelte";
    import type { PageNavLinkProps } from "./NavLinkSvelte.types";

    let props: PageNavLinkProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<PageRouterLink href={props.href} class={styles.navLink} aria-current={props.isSelected ? "page" : undefined}>
    <div
        class={[
            (props.isGliding ?? false) ? styles.navLinkContent : styles.navLinkContentWithoutFloater,
            layerClass,
            props.isSelected && styles.isSelected,
        ]}
    >
        {@render props.children?.()}
    </div>
</PageRouterLink>
