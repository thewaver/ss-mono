<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/NavLinkContent/NavLinkContent.css";

    import { getLayerClass } from "../../StyledComponents/Layer/Layer.context";
    import PageRouterLink from "../RouterLink/RouterLink.svelte";
    import type { PageNavLinkProps } from "./NavLink.types";

    let props: PageNavLinkProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<PageRouterLink
    href={props.href}
    class={[styles.navLinkContent, layerClass, props.isSelected && styles.isSelected]}
    aria-current={props.isSelected ? "page" : undefined}
>
    {@render props.children?.()}
</PageRouterLink>
