<script lang="ts">
    import { Menubar } from "@thewaver/ss-components-svelte";
    import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

    import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { WORDS, renderMenubarItem, renderMenubarPopup } from "../MenubarPage.const.svelte";
    import type { MenubarExampleProps } from "../MenubarPage.types";

    type Props = MenubarExampleProps;

    let { checked = $bindable(), ...props }: Props = $props();
</script>

<Menubar
    actions={WORDS}
    ariaLabel={"Editor"}
    overflowAriaLabel={"More menus"}
    bind:checked
    submenuOffset={{ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET }}
    renderItem={renderMenubarItem}
    renderPopup={renderMenubarPopup}
    onActivate={props.onActivate}
>
    {#snippet renderAction(action, flags)}
        <PageMenuTriggerContent {flags}>{action.value.name}</PageMenuTriggerContent>
    {/snippet}

    {#snippet renderOverflowTrigger(flags)}
        <PageMenuTriggerContent {flags}>More</PageMenuTriggerContent>
    {/snippet}
</Menubar>
