<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/NavLinkContent/NavLinkContent.css";

    import { getLayerClass } from "../../StyledComponents/Layer/Layer.context";
    import PageRouterLink from "../RouterLink/RouterLink.svelte";
    import { getNavLinkGroupContext } from "./NavLink.context";
    import type { PageNavLinkProps } from "./NavLinkSvelte.types";

    let props: PageNavLinkProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
    const groupContext = getNavLinkGroupContext();

    let link = $state<HTMLElement>();

    const isHovered = $derived(link !== undefined && groupContext?.highlightedLink === link);
</script>

<PageRouterLink
    {@attach (element: HTMLElement) => {
        link = element;
    }}
    href={props.href}
    class={styles.navLink}
    aria-current={props.isSelected ? "page" : undefined}
>
    <div
        class={[
            styles.navLinkContent,
            layerClass,
            (props.hasHoverFloater ?? false) ? styles.hasHoverFloater : styles.hasNoHoverFloater,
            props.hasSelectionFloater && styles.hasSelectionFloater,
            isHovered && styles.isHovered,
            props.isSelected && styles.isSelected,
        ]}
    >
        {@render props.children?.()}
    </div>
</PageRouterLink>
