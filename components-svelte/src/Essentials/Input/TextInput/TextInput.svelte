<script lang="ts" generics="T = string">
    import {
        type AnchorPlacement,
        type InteractionFlags,
        ListboxUtils,
        type SelectOptionFlags,
    } from "@thewaver/ss-components";

    import Popover from "../../../Primitives/Popover/Popover.svelte";
    import TextField from "../../../Primitives/TextField/TextField.svelte";
    import ListboxOptions from "../Listbox/ListboxOptions.svelte";
    import { ListboxSvelteUtils } from "../Listbox/ListboxSvelte.utils.svelte.js";
    import type { SelectOption } from "../Select/Select.types.js";
    import type { TextInputProps } from "./TextInput.types.js";

    const EMPTY_SELECTION: never[] = [];
    const NO_AUTOCOMPLETE = "off";

    let { value = $bindable(), ref = $bindable(), ...props }: TextInputProps<T> = $props();

    const listboxId = $props.id();

    let isWanted = $state(false);

    const hasSuggestions = $derived(props.suggestions !== undefined);
    const isRefused = $derived(!hasSuggestions || (props.isDisabled ?? false) || (props.isReadOnly ?? false));

    const options = $derived(
        props.suggestions === undefined
            ? EMPTY_SELECTION
            : props.suggestions.map((suggestion): SelectOption<T> => ({ value: suggestion })),
    );

    const isOpen = $derived(isWanted && !isRefused && options.length > 0);

    const open = () => {
        if (isRefused) return;

        isWanted = true;
    };

    const close = () => {
        isWanted = false;
    };

    const writeSuggestion = (suggestion: T) => {
        const index = cursor.getFlatOptions().findIndex((option) => option.value === suggestion);
        const text = ListboxUtils.computePickedText(listboxId, index, props.computeCustomSuggestionText?.(suggestion));

        value = text;

        props.onInput?.(text);
        props.onSuggestionPick?.(suggestion);
    };

    const cursor = ListboxSvelteUtils.createCursor<T>({
        focusModel: "activeDescendant",
        isHighlightExplicit: true,
        getListboxId: () => listboxId,
        getOptions: () => options,
        getSelectedOptions: () => EMPTY_SELECTION,
        getIsDisabled: () => isRefused,
        getIsOpen: () => isOpen,
        getIsFilterable: () => true,
        getIsFiltering: () => true,
        onOpen: open,
        onClose: close,
        onPick: (suggestion) => writeSuggestion(suggestion),
    });
</script>

{#snippet suggestionOption(option: SelectOption<T>, flags: InteractionFlags<SelectOptionFlags>)}
    {@render props.renderSuggestion?.(option.value, flags)}
{/snippet}

{#snippet renderSuggestions()}
    <ListboxOptions {cursor} isLive={isOpen} computeIsSelected={() => false} renderOption={suggestionOption} />
{/snippet}

{#snippet popupContent(visibilityTarget: 0 | 1, transitionDurationMs: number, placement: AnchorPlacement)}
    {@render props.renderSuggestionPopup?.(renderSuggestions, visibilityTarget, transitionDurationMs, placement)}
{/snippet}

<TextField
    {...props}
    bind:value
    bind:ref
    element="input"
    autoComplete={props.autoComplete ?? (hasSuggestions ? NO_AUTOCOMPLETE : undefined)}
    ariaAttributes={hasSuggestions
        ? ListboxUtils.computeComboboxAttributes({
              isOpen,
              listboxId,
              activeOptionId: cursor.getActiveOptionId(),
              isEditable: true,
          })
        : undefined}
    onKeyDown={(e) => cursor.handleKeyDown(e)}
    onInput={(next) => {
        if (hasSuggestions) {
            open();
            cursor.highlight(undefined);
        }

        props.onInput?.(next);
    }}
/>

{#if hasSuggestions}
    <Popover
        id={listboxId}
        role="listbox"
        ariaAttributes={{ "aria-label": props.suggestionsAriaLabel }}
        hasAnchorMinWidth={true}
        {isOpen}
        anchorRef={ref}
        onDismiss={close}
        renderContent={popupContent}
    />
{/if}
