<script lang="ts" generics="T">
    import { type FlyoutMenuLinkFlags, FlyoutMenuStyles as styles } from "@thewaver/ss-components";

    import InteractionWrapper from "../../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import type { FlyoutMenuLinkProps } from "./FlyoutMenu.types.js";

    let props: FlyoutMenuLinkProps<T> = $props();

    const extraFlags: FlyoutMenuLinkFlags = $derived({ isCurrent: props.link.isCurrent ?? false });
</script>

<InteractionWrapper {extraFlags}>
    {#snippet renderControl(attachElement, flags)}
        {#if props.linkComponent}
            <props.linkComponent
                {@attach attachElement}
                href={props.link.href}
                class={styles.flyoutMenuLink}
                aria-current={props.link.isCurrent ? "page" : undefined}
                onclick={props.onFollow}
            >
                {@render props.renderLink(props.link, flags)}
            </props.linkComponent>
        {:else}
            <a
                {@attach attachElement}
                href={props.link.href}
                class={styles.flyoutMenuLink}
                aria-current={props.link.isCurrent ? "page" : undefined}
                onclick={props.onFollow}
            >
                {@render props.renderLink(props.link, flags)}
            </a>
        {/if}
    {/snippet}
</InteractionWrapper>
