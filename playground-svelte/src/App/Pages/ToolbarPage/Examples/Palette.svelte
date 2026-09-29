<script lang="ts">
    import { PlacementLayoutUtils, Toolbar } from "@thewaver/ss-components-svelte";
    import type { ArcDefs, ToolbarAction } from "@thewaver/ss-components-svelte";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPage.const.svelte";
    import type { ToolbarExampleProps } from "../ToolbarPage.types";

    const ACTIONS: ToolbarAction<string>[] = [
        { value: "Select" },
        { value: "Brush" },
        { value: "Erase" },
        { value: "Fill" },
        { value: "Text" },
        { value: "Shape" },
        { value: "Crop" },
        { value: "Zoom" },
    ];

    const PALETTE_DEFS: ArcDefs = {
        curveHeightRatio: 1,
        spreadDegrees: 360,
        facingDegrees: 70,
        itemWidthRatio: 0.3542,
        itemHeightRatio: 0.4706,
    };

    const PALETTE_LAYOUT = PlacementLayoutUtils.createArc(PALETTE_DEFS);

    const PALETTE_WIDTH = "390px";

    type Props = ToolbarExampleProps;

    let props: Props = $props();
</script>

<div style:width={PALETTE_WIDTH}>
    <Toolbar
        actions={ACTIONS}
        ariaLabel={"Tools"}
        overflowAriaLabel={"More tools"}
        computeLayout={PALETTE_LAYOUT}
        renderOverflowItem={renderToolbarOverflowItem}
        renderOverflowPopup={renderToolbarPopup}
        onActivate={props.onActivate}
    >
        {#snippet renderAction(action, flags)}
            <PageButtonContent {flags}>{action.value}</PageButtonContent>
        {/snippet}

        {#snippet renderOverflowTrigger(flags)}
            <PageMenuTriggerContent {flags}>More</PageMenuTriggerContent>
        {/snippet}
    </Toolbar>
</div>
