<script lang="ts">
    import { Menubar } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarPage.css";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

    import { getLayerClass } from "../../../StyledComponents/Layer/Layer.context";
    import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import {
        NOTHING_PICKED,
        VIEW_DEFAULTS,
        WORDS,
        renderMenubarItem,
        renderMenubarPopup,
    } from "../MenubarPage.const.svelte";
    import type { MenubarOverflowDocsExampleProps } from "../MenubarPage.types";

    type Props = MenubarOverflowDocsExampleProps;

    let props: Props = $props();

    const layerClass = $derived.by(getLayerClass());

    let checked = $state.raw(VIEW_DEFAULTS);
    let lastPicked = $state(NOTHING_PICKED);
</script>

<div class={[styles.bar, layerClass]} style:width={`${props.barWidth}px`}>
    <Menubar
        actions={WORDS}
        ariaLabel={"Narrow editor"}
        overflowAriaLabel={"More menus"}
        bind:checked
        submenuOffset={{ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET }}
        renderItem={renderMenubarItem}
        renderPopup={renderMenubarPopup}
        onActivate={(entry) => {
            lastPicked = entry.name;
        }}
    >
        {#snippet renderAction(action, flags)}
            <PageMenuTriggerContent {flags}>{action.value.name}</PageMenuTriggerContent>
        {/snippet}

        {#snippet renderOverflowTrigger(flags)}
            <PageMenuTriggerContent {flags}>More</PageMenuTriggerContent>
        {/snippet}
    </Menubar>
</div>

<div class={exampleStyles.exampleReadout} data-readout>{`Last picked: ${lastPicked}`}</div>
