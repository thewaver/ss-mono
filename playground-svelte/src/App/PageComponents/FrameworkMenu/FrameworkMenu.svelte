<script lang="ts">
    import type { Snippet } from "svelte";

    import { Menu } from "@thewaver/ss-components-svelte";
    import type {
        AnchorPlacement,
        InteractionFlags,
        MenuFlags,
        MenuItem,
        MenuItemFlags,
    } from "@thewaver/ss-components-svelte";
    import {
        PLAYGROUND_FRAMEWORKS,
        PLAYGROUND_FRAMEWORK_LABELS,
        toFrameworkHref,
    } from "@thewaver/ss-playground/App/PageComponents/FrameworkSwitch/FrameworkSwitch.const";
    import type { PlaygroundFramework } from "@thewaver/ss-playground/App/PageComponents/FrameworkSwitch/PlaygroundFramework.types";

    import { route } from "../../App.router";
    import PageFrameworkMenuTrigger from "../../StyledComponents/FrameworkMenuContent/FrameworkMenuContent.svelte";
    import PageFrameworkMenuItem from "../../StyledComponents/FrameworkMenuContent/FrameworkMenuItem.svelte";
    import PagePopoverSurface from "../../StyledComponents/PopoverSurface/PopoverSurface.svelte";
    import PageLayer from "../Layer/Layer.svelte";
    import { OWN_FRAMEWORK } from "./FrameworkMenu.const";

    const FRAMEWORK_ITEMS: MenuItem<PlaygroundFramework>[] = PLAYGROUND_FRAMEWORKS.map((framework) => ({
        value: framework,
        kind: "radio",
    }));

    const CHECKED: PlaygroundFramework[] = [OWN_FRAMEWORK];
</script>

<Menu
    items={FRAMEWORK_ITEMS}
    ariaLabel={"Framework"}
    bind:checked={() => CHECKED, () => {}}
    {renderContent}
    {renderItem}
    {renderPopup}
    onActivate={(framework) => {
        if (framework === OWN_FRAMEWORK) return;

        window.location.assign(toFrameworkHref(framework, route.pathname));
    }}
/>

{#snippet renderContent(flags: InteractionFlags<MenuFlags>)}
    <PageFrameworkMenuTrigger {flags}>
        {PLAYGROUND_FRAMEWORK_LABELS[OWN_FRAMEWORK]}
    </PageFrameworkMenuTrigger>
{/snippet}

{#snippet renderItem(item: MenuItem<PlaygroundFramework>, flags: InteractionFlags<MenuItemFlags>)}
    <PageFrameworkMenuItem {flags}>
        {PLAYGROUND_FRAMEWORK_LABELS[item.value]}
    </PageFrameworkMenuItem>
{/snippet}

{#snippet renderPopup(
    renderItems: Snippet,
    visibilityTarget: 0 | 1,
    transitionDurationMs: number,
    placement: AnchorPlacement,
)}
    <PageLayer level={2}>
        <PagePopoverSurface {visibilityTarget} {transitionDurationMs} {placement}>
            {@render renderItems()}
        </PagePopoverSurface>
    </PageLayer>
{/snippet}
