<script lang="ts" module>
    import type { Snippet } from "svelte";

    import { PlacementUtils } from "@thewaver/ss-components-svelte";
    import type {
        InteractionFlags,
        MenuItem,
        MenuItemFlags,
        PlacementRect,
        WheelMenuCloserDefs,
        WheelMenuItem,
    } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.css";

    import PageLayer from "../../../PageComponents/Layer/Layer.svelte";
    import type { WheelAction } from "./WheelMenuPageSvelte.types";

    const HALF = 0.5;
    const SUBMENU_MARK = "›";
    const CLOSER_MARK = "✕";

    const toViewBox = (rect: PlacementRect) =>
        `${rect.leftShare - rect.widthShare * HALF} ${rect.topShare - rect.heightShare * HALF} ${rect.widthShare} ${rect.heightShare}`;

    export const ACTIONS: WheelMenuItem<WheelAction>[] = [
        { value: { name: "Cut", shortcut: "Ctrl+X" } },
        { value: { name: "Copy", shortcut: "Ctrl+C" } },
        { value: { name: "Paste", shortcut: "Ctrl+V" } },
        { value: { name: "Duplicate" } },
        { value: { name: "Delete", shortcut: "Del" } },
    ];

    export const NESTED_ACTIONS: WheelMenuItem<WheelAction>[] = [
        {
            value: { name: "New" },
            items: [
                { value: { name: "Project" } },
                {
                    value: { name: "From template" },
                    items: [
                        { value: { name: "Blank" } },
                        { value: { name: "Dashboard" } },
                        { value: { name: "Report" } },
                    ],
                },
                { value: { name: "Import" } },
            ],
        },
        { value: { name: "Open", shortcut: "Ctrl+O" } },
        {
            value: { name: "Share" },
            items: [{ value: { name: "Copy link", shortcut: "Ctrl+L" } }, { value: { name: "Email" } }],
        },
        { value: { name: "Delete", shortcut: "Del" } },
    ];

    export const WEIGHTED_ACTIONS: WheelMenuItem<WheelAction>[] = [
        { value: { name: "Confirm" }, arcDegrees: 180 },
        { value: { name: "Cancel" } },
        { value: { name: "Later" } },
        { value: { name: "Help" } },
    ];

    export const CLOSER_DEFS: WheelMenuCloserDefs = {
        ariaLabel: "Close the wheel",
        renderContent: renderWheelCloser,
    };

    export { renderWheelGradientDefs, renderWheelItem, renderWheelPopup };
</script>

{#snippet renderWheelCloser(flags: InteractionFlags<MenuItemFlags>)}
    <div class={[styles.closer, flags.isHighlighted && styles.closerHighlighted]} aria-hidden={"true"}>
        {CLOSER_MARK}
    </div>
{/snippet}

{#snippet renderWheelGradientDefs(gradientId: string)}
    <svg class={styles.wedgeDefs} aria-hidden={"true"}>
        <defs>
            <linearGradient id={gradientId} x1={"0"} y1={"1"} x2={"1"} y2={"0"}>
                <stop class={styles.wedgeGradientFrom} offset={"0%"} />
                <stop class={styles.wedgeGradientTo} offset={"100%"} />
            </linearGradient>
        </defs>
    </svg>
{/snippet}

{#snippet renderWheelItem(
    gradientId: string,
    item: MenuItem<WheelAction>,
    flags: InteractionFlags<MenuItemFlags>,
    placement: PlacementRect | undefined,
)}
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

{#snippet renderWheelPopup(renderItems: Snippet, visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <div
        class={[styles.layer, visibilityTarget === 1 && styles.layerVisible]}
        style:transition={`opacity ${transitionDurationMs}ms, transform ${transitionDurationMs}ms`}
    >
        <PageLayer level={2}>{@render renderItems()}</PageLayer>
    </div>
{/snippet}
