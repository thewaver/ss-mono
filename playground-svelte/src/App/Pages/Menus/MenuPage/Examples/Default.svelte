<script lang="ts">
    import { Menu } from "@thewaver/ss-components-svelte";
    import type { MenuItem } from "@thewaver/ss-components-svelte";

    import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const.svelte";
    import type { Action, MenuExampleProps } from "../MenuPage.types";

    type Props = MenuExampleProps & { items?: MenuItem<Action>[]; caption?: string };

    let props: Props = $props();
</script>

<Menu
    items={props.items ?? ACTIONS}
    ariaLabel={"Edit actions"}
    renderItem={renderMenuItem}
    renderPopup={renderMenuPopup}
    onActivate={props.onActivate}
>
    {#snippet renderContent(flags)}
        <PageMenuTriggerContent {flags}>{props.caption ?? "Edit"}</PageMenuTriggerContent>
    {/snippet}
</Menu>
