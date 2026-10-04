<script lang="ts" generics="T">
    import type { Snippet } from "svelte";
    import { on } from "svelte/events";

    import {
        FloaterStyles as floaterStyles,
        RADIO_GROUP_DEFAULTS,
        type RadioGroupEntry,
        RadioGroupUtils,
        RadioGroupStyles as styles,
    } from "@thewaver/ss-components";

    import { FloaterSvelteUtils } from "../../../Abstracts/Floater/FloaterSvelte.utils.svelte.js";
    import { NavigatorSvelteUtils } from "../../../Abstracts/Navigator/NavigatorSvelte.utils.svelte.js";
    import PlacementBox from "../../../Primitives/PlacementBox/PlacementBox.svelte";
    import { createHeldValue } from "../../../Utils/bindableUtils.svelte.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import { setRadioGroupContext } from "./RadioGroup.context.js";
    import type { RadioGroupProps } from "./RadioGroup.types.js";

    let { value = $bindable(), ...props }: RadioGroupProps<T> = $props();

    const [getValue, setValue] = createHeldValue<unknown>([
        () => value,
        (next) => {
            value = next as T;
        },
    ]);

    const fallbackName = $props.id();

    let root = $state<HTMLDivElement>();
    let entries = $state.raw<RadioGroupEntry[]>([]);
    let hoveredEntry = $state.raw<RadioGroupEntry>();
    let focusedEntry = $state.raw<RadioGroupEntry>();

    const orientation = $derived(props.orientation ?? RADIO_GROUP_DEFAULTS.orientation);
    const transitionDurationMs = $derived(props.transitionDurationMs ?? RADIO_GROUP_DEFAULTS.transitionDurationMs);

    const getDirection = NavigatorSvelteUtils.createDirection(() => root ?? undefined);

    const layout = $derived(props.computeLayout?.({ itemCount: entries.length }));

    const orderedEntries = $derived(RadioGroupUtils.orderEntries(entries));
    const navigableEntries = $derived(RadioGroupUtils.computeNavigableEntries(orderedEntries));
    const rovingEntry = $derived(RadioGroupUtils.computeRovingEntry(navigableEntries, getValue()));
    const selectedEntry = $derived(RadioGroupUtils.computeSelectedEntry(orderedEntries, getValue()));

    const computePlacement = (entry: RadioGroupEntry) =>
        RadioGroupUtils.computePlacement(orderedEntries, layout, entry);

    const findEntry = (target: EventTarget | null) =>
        target instanceof Node
            ? orderedEntries.find((entry) => entry.getElementRef()?.parentElement?.contains(target) ?? false)
            : undefined;

    const createFloater = (getIsEnabled: () => boolean, getEntry: () => RadioGroupEntry | undefined) =>
        FloaterSvelteUtils.create({
            getIsEnabled,
            getContainer: () => (layout === undefined ? (root ?? undefined) : undefined),
            getTarget: () => (getEntry()?.getElementRef()?.offsetParent as HTMLElement | null) ?? undefined,
            getLayout: () => layout,
            getPlacement: () => {
                const entry = getEntry();

                return entry === undefined ? undefined : computePlacement(entry);
            },
            getTransitionDurationMs: () => transitionDurationMs,
        });

    const selectionFloater = createFloater(
        () => props.renderSelectionFloater !== undefined,
        () => selectedEntry,
    );

    const highlightFloater = createFloater(
        () => props.renderHighlightFloater !== undefined,
        () => hoveredEntry ?? focusedEntry,
    );

    setRadioGroupContext({
        getName: () => props.name ?? fallbackName,
        getValue,
        setValue,
        computeIsTabbable: (candidate) => rovingEntry?.getValue() === candidate,
        computePlacement,
        register: (entry) => {
            entries = [...entries, entry];

            return () => {
                entries = entries.filter((item) => item !== entry);
            };
        },
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        const next = RadioGroupUtils.computeKeyTarget(e.key, navigableEntries, {
            focusedElement: document.activeElement,
            rovingEntry,
            direction: layout === undefined ? getDirection() : undefined,
        });

        if (next === undefined) return;

        e.preventDefault();

        next.getElementRef()?.focus();

        if (!next.getIsDisabled()) setValue(next.getValue());
    };
</script>

{#snippet floaterView(
    floater: ReturnType<typeof createFloater>,
    renderContent: Snippet<[visibilityTarget: 0 | 1, transitionDurationMs: number]> | undefined,
)}
    {#if floater.getIsRendered()}
        <div
            {@attach floater.attachRef}
            class={floaterStyles.floater}
            style={toStyle(floater.getBounds(), { transitionDuration: `${transitionDurationMs}ms` })}
        >
            {@render renderContent?.(floater.getVisibilityTarget(), transitionDurationMs)}
        </div>
    {/if}
{/snippet}

{#snippet content()}
    {@render floaterView(highlightFloater, props.renderHighlightFloater)}
    {@render floaterView(selectionFloater, props.renderSelectionFloater)}

    {@render props.children?.()}
{/snippet}

<div
    bind:this={root}
    {@attach (element) => on(element, "keydown", handleKeyDown)}
    {@attach (element) =>
        on(element, "pointerover", (e) => {
            hoveredEntry = findEntry(e.target);
        })}
    {@attach (element) =>
        on(element, "pointerleave", () => {
            hoveredEntry = undefined;
        })}
    class={layout === undefined ? styles.radioGroupRoot : styles.radioGroupPlacedRoot}
    style:flex-direction={orientation === "horizontal" ? "row" : "column"}
    style:gap={`${props.gap ?? RADIO_GROUP_DEFAULTS.gap}px`}
    role="radiogroup"
    aria-label={props.ariaLabel}
    aria-required={props.isRequired || undefined}
    aria-invalid={props.hasError || undefined}
    onfocusin={(e) => {
        focusedEntry = findEntry(e.target);
    }}
    onfocusout={() => {
        focusedEntry = undefined;
    }}
>
    {#if layout}
        <PlacementBox {layout} computeEffect={props.computeEffect}>
            {@render content()}
        </PlacementBox>
    {:else}
        {@render content()}
    {/if}
</div>
