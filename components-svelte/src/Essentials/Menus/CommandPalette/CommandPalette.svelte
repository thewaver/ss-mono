<script lang="ts" generics="T">
    import type { Snippet } from "svelte";

    import {
        COMMAND_PALETTE_DEFAULTS,
        CommandPaletteUtils,
        type InteractionFlags,
        ListboxUtils,
        type SelectGroupFlags,
        type SelectOptionFlags,
        SelectUtils,
        ShortcutUtils,
    } from "@thewaver/ss-components";
    import { SelectConst } from "@thewaver/ss-components/internal";

    import { ShortcutSvelteUtils } from "../../../Abstracts/Shortcut/ShortcutSvelte.utils.svelte.js";
    import TextField from "../../../Primitives/TextField/TextField.svelte";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import ListboxOptions from "../../Input/Listbox/ListboxOptions.svelte";
    import { ListboxSvelteUtils } from "../../Input/Listbox/ListboxSvelte.utils.svelte.js";
    import type { SelectOption, SelectOptionGroup } from "../../Input/Select/Select.types.js";
    import Modal from "../../Overlays/Modal/Modal.svelte";
    import type { CommandPaletteAction, CommandPaletteActionGroup, CommandPaletteProps } from "./CommandPalette.types.js";

    const TAB_KEY = "Tab";

    let { visibility = $bindable(false), query = $bindable(), ...props }: CommandPaletteProps<T> = $props();

    const uid = $props.id();
    const listboxId = `${uid}-listbox`;
    const fallbackFieldId = `${uid}-field`;

    let fieldRef = $state<HTMLElement>();
    let hasModalSettled = $state(true);

    watchChange(
        () => visibility,
        (isOpen) => {
            if (!isOpen) hasModalSettled = false;
        },
        { isBeforeRender: true },
    );

    const open = () => {
        visibility = true;
    };

    const close = () => {
        visibility = false;
    };

    const cursor = ListboxSvelteUtils.createCursor<T>({
        focusModel: "active_descendant",
        getListboxId: () => listboxId,
        getOptions: () => props.actions,
        getSelectedOptions: () => SelectConst.EMPTY_SELECTION,
        getIsDisabled: () => false,
        getIsOpen: () => visibility,
        getIsFilterable: () => true,
        getIsFiltering: () => true,
        getHasMoreOptions: () => props.hasMoreOptions ?? false,
        onOpen: open,
        onClose: close,
        onPick: (value) => props.onActivate(value),
    });

    ShortcutSvelteUtils.createBindings(() => {
        const shortcut = props.shortcut;
        const actionBindings = CommandPaletteUtils.getBoundActions(props.actions).map((action) => ({
            shortcut: action.shortcut,
            onTrigger: () => props.onActivate(action.value),
        }));

        return shortcut === undefined ? actionBindings : [{ shortcut, onTrigger: open }, ...actionBindings];
    });

    $effect(() => {
        if (!SelectUtils.getIsQueryClearDue(visibility, hasModalSettled, query)) return;

        query = SelectConst.EMPTY_QUERY;
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === TAB_KEY) return;

        cursor.handleKeyDown(e);
    };
</script>

{#snippet actionOption(option: SelectOption<T>, flags: InteractionFlags<SelectOptionFlags>)}
    {@const action = option as CommandPaletteAction<T>}
    {@render props.renderOption(action, {
        ...flags,
        shortcut: action.shortcut === undefined ? undefined : ShortcutUtils.resolve(action.shortcut),
    })}
{/snippet}

{#snippet actionGroupHeader(group: SelectOptionGroup<T>, _flags: SelectGroupFlags)}
    {@render props.renderGroupHeader?.(group as CommandPaletteActionGroup<T>)}
{/snippet}

{#snippet actionGroupBox(renderContent: Snippet, group: SelectOptionGroup<T>, _flags: SelectGroupFlags)}
    {@render props.renderGroupBox?.(renderContent, group as CommandPaletteActionGroup<T>)}
{/snippet}

{#snippet renderField()}
    <TextField
        element={"input"}
        id={props.id ?? fallbackFieldId}
        bind:ref={fieldRef}
        bind:value={query}
        ariaLabel={props.fieldAriaLabel}
        padding={props.fieldPadding}
        gap={props.fieldGap}
        autoComplete={"off"}
        ariaAttributes={ListboxUtils.computeComboboxAttributes({
            isOpen: visibility && cursor.getFlatOptions().length > 0,
            listboxId,
            activeOptionId: cursor.getActiveOptionId(),
            isEditable: true,
        })}
        computeTextStyle={props.computeFieldTextStyle}
        renderContent={props.renderFieldContent}
        renderPlaceholder={props.renderFieldPlaceholder}
        renderLeading={props.renderFieldLeading}
        renderTrailing={props.renderFieldTrailing}
        onKeyDown={handleKeyDown}
        onInput={() => cursor.highlight(undefined)}
    />
{/snippet}

{#snippet renderOptions()}
    <div id={listboxId} role="listbox" aria-label={props.listAriaLabel} onmousedown={(e) => e.preventDefault()}>
        <ListboxOptions
            {cursor}
            isLive={visibility}
            hasMoreOptions={props.hasMoreOptions}
            computeEstimatedOptionHeight={props.computeEstimatedOptionHeight}
            computeEstimatedGroupHeight={props.computeEstimatedGroupHeight}
            computeIsSelected={() => false}
            renderOption={actionOption}
            renderGroupHeader={props.renderGroupHeader === undefined ? undefined : actionGroupHeader}
            renderGroupBox={props.renderGroupBox === undefined ? undefined : actionGroupBox}
            floaterTransitionDurationMs={props.floaterTransitionDurationMs ??
                COMMAND_PALETTE_DEFAULTS.floaterTransitionDurationMs}
            renderHighlightFloater={props.renderHighlightFloater}
            onReachEnd={props.onReachEnd}
        />
    </div>
{/snippet}

{#snippet panel(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    {@render props.renderPanel(renderField, renderOptions, visibilityTarget, transitionDurationMs)}
{/snippet}

<Modal
    bind:visibility
    ariaLabel={props.ariaLabel}
    alignment={props.alignment}
    margins={props.margins}
    isDismissableOnOverlayClick={props.isDismissableOnOverlayClick}
    transitionDurationMs={props.transitionDurationMs}
    initialFocusRef={fieldRef}
    onTransitionStatusChange={(hasTransitionFinished) => {
        hasModalSettled = hasTransitionFinished;
    }}
    renderOverlay={props.renderOverlay}
    renderContent={panel}
/>
