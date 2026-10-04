<script lang="ts" generics="T">
    import { on } from "svelte/events";

    import { LISTBOX_DEFAULTS } from "@thewaver/ss-components";

    import { NavigatorSvelteUtils } from "../../../Abstracts/Navigator/NavigatorSvelte.utils.svelte.js";
    import type { ListboxCompositeProps } from "./Listbox.types.js";
    import ListboxOptions from "./ListboxOptions.svelte";
    import { ListboxSvelteUtils } from "./ListboxSvelte.utils.svelte.js";

    let props: ListboxCompositeProps<T> = $props();

    const fallbackId = $props.id();

    let root = $state<HTMLDivElement>();

    const getDirection = NavigatorSvelteUtils.createDirection(() => root);

    const orientation = $derived(props.orientation ?? LISTBOX_DEFAULTS.orientation);
    const isDisabled = $derived(props.isDisabled ?? false);
    const isMultiple = $derived(props.isMultiple ?? false);
    const listboxId = $derived(props.id ?? fallbackId);

    const cursor = ListboxSvelteUtils.createCursor<T>({
        focusModel: "roving",
        getListboxId: () => listboxId,
        getOptions: () => props.options,
        getSelectedOptions: () => props.selectedOptions,
        getIsDisabled: () => isDisabled,
        getIsMultiple: () => isMultiple,
        getHasMoreOptions: () => props.hasMoreOptions ?? false,
        getOrientation: () => orientation,
        getDirection,
        get computeCustomText() {
            return props.computeCustomText;
        },
        onPick: (value) => props.onPick(value),
    });
</script>

<div
    bind:this={root}
    {@attach (element) => on(element, "keydown", (e) => cursor.handleKeyDown(e))}
    id={listboxId}
    role="listbox"
    aria-label={props.ariaLabel}
    aria-multiselectable={isMultiple || undefined}
    aria-orientation={orientation}
    aria-disabled={isDisabled || undefined}
    onfocusin={() => cursor.setHasFocus(true)}
    onfocusout={(e) => {
        const next = e.relatedTarget;

        cursor.setHasFocus(next instanceof Node && (root?.contains(next) ?? false));
    }}
>
    <ListboxOptions
        {cursor}
        isLive={true}
        {isDisabled}
        hasMoreOptions={props.hasMoreOptions}
        computeEstimatedOptionHeight={props.computeEstimatedOptionHeight}
        computeEstimatedGroupHeight={props.computeEstimatedGroupHeight}
        computeIsSelected={props.computeIsSelected}
        renderOption={props.renderOption}
        renderGroup={props.renderGroup}
        floaterTransitionDurationMs={props.floaterTransitionDurationMs}
        renderSelectionFloater={props.renderSelectionFloater}
        renderHighlightFloater={props.renderHighlightFloater}
        onReachEnd={props.onReachEnd}
    />
</div>
