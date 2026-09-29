<script lang="ts">
    import { PlacementUtils, WheelMenu } from "@thewaver/ss-components-svelte";
    import type { InteractionFlags, MenuItemFlags, PlacementRect } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.css";

    import PageLayer from "../../../../PageComponents/Layer/Layer.svelte";
    import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import type { WheelMenuExampleProps } from "../WheelMenuPage.types";
    import WedgeDefs from "./WedgeDefs.svelte";

    const HALF = 0.5;
    const SUBMENU_MARK = "›";
    const CLOSER_MARK = "✕";

    const toViewBox = (rect: PlacementRect) =>
        `${rect.leftShare - rect.widthShare * HALF} ${rect.topShare - rect.heightShare * HALF} ${rect.widthShare} ${rect.heightShare}`;

    const WHEEL_HOLE_RADIUS = 64;
    const WHEEL_BAND_WIDTH = 84;
    const WHEEL_LEVEL_GAP = 8;

    let props: WheelMenuExampleProps = $props();

    const gradientId = $props.id();
</script>

<div class={styles.stage}>
    <WedgeDefs {gradientId} />

    <WheelMenu
        layoutSize={"368px"}
        items={props.items}
        ariaLabel={"Edit actions"}
        spreadDegrees={props.spreadDegrees}
        opensOnHold={props.opensOnHold}
        layoutDefs={props.layoutDefs}
        holeRadius={props.holeRadius ?? WHEEL_HOLE_RADIUS}
        bandWidth={props.bandWidth ?? WHEEL_BAND_WIDTH}
        levelGap={WHEEL_LEVEL_GAP}
        placement={{ x: "center", y: "center" }}
        closerDefs={{
            ariaLabel: "Close the wheel",
            renderContent: closer,
        }}
        onActivate={props.onActivate}
    >
        {#snippet renderContent(flags)}
            <PageMenuTriggerContent {flags}>{props.caption}</PageMenuTriggerContent>
        {/snippet}

        {#snippet renderItem(item, flags, placement)}
            {@const sector = placement?.sector}

            {#if placement && sector}
                <svg class={styles.canvas} viewBox={toViewBox(placement)} aria-hidden={"true"}>
                    <path
                        class={[styles.wedge, flags.isDisabled && styles.wedgeDisabled]}
                        style:fill={flags.isHighlighted ? `url(#${gradientId})` : undefined}
                        d={PlacementUtils.getSectorPath(sector)}
                    />
                </svg>

                <div class={[styles.label, flags.isHighlighted && styles.labelHighlighted]}>
                    <span>{item.value.name}</span>

                    {#if item.value.shortcut}
                        <span class={styles.shortcut}>{item.value.shortcut}</span>
                    {/if}

                    {#if flags.hasSubmenu}
                        <span aria-hidden={"true"}>{SUBMENU_MARK}</span>
                    {/if}
                </div>
            {/if}
        {/snippet}

        {#snippet renderPopup(renderItems, visibilityTarget, transitionDurationMs)}
            <div
                class={[styles.layer, visibilityTarget === 1 && styles.layerVisible]}
                style:transition={`opacity ${transitionDurationMs}ms, transform ${transitionDurationMs}ms`}
            >
                <PageLayer level={2}>{@render renderItems()}</PageLayer>
            </div>
        {/snippet}
    </WheelMenu>
</div>

{#snippet closer(flags: InteractionFlags<MenuItemFlags>)}
    <div class={[styles.closer, flags.isHighlighted && styles.closerHighlighted]} aria-hidden={"true"}>
        {CLOSER_MARK}
    </div>
{/snippet}
