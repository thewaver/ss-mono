<script lang="ts" module>
    import type { Snippet } from "svelte";

    import type { InteractionFlags, MenuItem, MenuItemFlags } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.css";
    export { FAN_LAYOUT_DEFS, FAN_LAYOUT_SIZE } from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.const";

    import PageLayer from "../../../PageComponents/Layer/Layer.svelte";
    import type { FanAction } from "./FanMenuPageSvelte.types";

    const BACK_MARK = "‹";
    const SUBMENU_MARK = "›";

    export const ACTIONS: MenuItem<FanAction>[] = [
        { value: { name: "Cut", shortcut: "Ctrl+X" } },
        { value: { name: "Copy", shortcut: "Ctrl+C" } },
        { value: { name: "Paste", shortcut: "Ctrl+V" } },
        { value: { name: "Duplicate" } },
        { value: { name: "Delete", shortcut: "Del" } },
    ];

    export const NESTED_ACTIONS: MenuItem<FanAction>[] = [
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

    export { renderFanItem, renderFanFloater, renderFanPopup };
</script>

{#snippet renderFanItem(item: MenuItem<FanAction>, flags: InteractionFlags<MenuItemFlags>)}
    {@const shortcut = !flags.isBack && item.value.shortcut}

    <div
        class={[
            styles.item,
            flags.isBack && styles.itemBack,
            flags.isHighlighted && styles.itemHighlighted,
            flags.isDisabled && styles.itemDisabled,
        ]}
    >
        {#if flags.isBack}
            <span aria-hidden={"true"}>{BACK_MARK}</span>
        {/if}

        <span>{item.value.name}</span>

        {#if shortcut}
            <span class={styles.shortcut}>{shortcut}</span>
        {/if}

        {#if flags.hasSubmenu}
            <span aria-hidden={"true"}>{SUBMENU_MARK}</span>
        {/if}
    </div>
{/snippet}

{#snippet renderFanFloater(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <div
        class={[styles.itemFloater, visibilityTarget === 1 && styles.itemFloaterVisible]}
        style:transition-duration={`${transitionDurationMs}ms`}
        data-floater={"highlight"}
    ></div>
{/snippet}

{#snippet renderFanPopup(renderItems: Snippet, visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <div
        class={[styles.layer, visibilityTarget === 1 && styles.layerVisible]}
        style:transition={`opacity ${transitionDurationMs}ms, transform ${transitionDurationMs}ms`}
    >
        <PageLayer level={2}>{@render renderItems()}</PageLayer>
    </div>
{/snippet}
