<script lang="ts" module>
    import type { Snippet } from "svelte";

    import { ShortcutUtils } from "@thewaver/ss-components-svelte";
    import type {
        CommandPaletteAction,
        CommandPaletteActionGroup,
        CommandPaletteOptionRenderProps,
        InteractionFlags,
        TextFieldFlags,
    } from "@thewaver/ss-components-svelte";
    import { CommandPalettePageUtils } from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.utils";
    import * as popupStyles from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

    import PageListboxSurface from "../../../StyledComponents/ListboxSurface/ListboxSurface.svelte";
    import PageModalOverlay from "../../../StyledComponents/ModalOverlay/ModalOverlay.svelte";
    import PageModalPanel from "../../../StyledComponents/ModalPanel/PageModalPanel.svelte";
    import PageSelectGroupContent from "../../../StyledComponents/SelectGroupContent/SelectGroupContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import PageTextFieldContent from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";

    export * from "@thewaver/ss-playground/App/Pages/Menus/CommandPalettePage/CommandPalettePage.const";

    const formatOptionShortcut = (renderProps: CommandPaletteOptionRenderProps) =>
        renderProps.shortcut === undefined
            ? undefined
            : CommandPalettePageUtils.formatShortcut(renderProps.shortcut, ShortcutUtils.getIsApplePlatform());

    export {
        renderPaletteOverlay,
        renderPaletteField,
        renderPalettePlaceholder,
        renderPaletteOption,
        renderPaletteGroupHeader,
        renderPalettePanel,
    };
</script>

{#snippet renderPaletteOverlay(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageModalOverlay {visibilityTarget} {transitionDurationMs} />
{/snippet}

{#snippet renderPaletteField(flags: InteractionFlags<TextFieldFlags>)}
    <PageTextFieldContent {flags} />
{/snippet}

{#snippet renderPalettePlaceholder(flags: InteractionFlags<TextFieldFlags>)}
    <PageTextFieldPlaceholder {flags}>Search the actions</PageTextFieldPlaceholder>
{/snippet}

{#snippet renderPaletteOption(action: CommandPaletteAction<string>, renderProps: CommandPaletteOptionRenderProps)}
    <PageSelectOptionContent isGliding hasMark={false} flags={renderProps} shortcut={formatOptionShortcut(renderProps)}>
        {action.value}
    </PageSelectOptionContent>
{/snippet}

{#snippet renderPaletteGroupHeader(group: CommandPaletteActionGroup<string>)}
    <PageSelectGroupContent>{group.label}</PageSelectGroupContent>
{/snippet}

{#snippet renderPalettePanel(
    renderField: Snippet,
    renderOptions: Snippet,
    visibilityTarget: 0 | 1,
    transitionDurationMs: number,
    hasActions: boolean,
)}
    <PageModalPanel {visibilityTarget} {transitionDurationMs}>
        {@render renderField()}

        <PageListboxSurface>
            {#if hasActions}
                {@render renderOptions()}
            {:else}
                <div class={popupStyles.popoverSurfaceEmpty}>No action matches that</div>
            {/if}
        </PageListboxSurface>
    </PageModalPanel>
{/snippet}
