<script lang="ts" generics="T">
    import { FlyoutMenuStyles as styles } from "@thewaver/ss-components";

    import type { FlyoutMenuLinkListProps } from "./FlyoutMenu.types.js";
    import FlyoutMenuLink from "./FlyoutMenuLink.svelte";

    let props: FlyoutMenuLinkListProps<T> = $props();
</script>

<ul id={props.id} class={styles.flyoutMenuPanelList}>
    {#each props.links as link (link)}
        <li>
            <FlyoutMenuLink
                {link}
                linkComponent={props.linkComponent}
                renderLink={props.renderLink}
                onFollow={props.onFollow}
            />
        </li>
    {/each}
</ul>
