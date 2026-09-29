<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import { on } from "svelte/events";

    import {
        RADIO_GROUP_DEFAULTS,
        type RadioGroupEntry,
        type RadioGroupFloaterBounds,
        RadioGroupUtils,
        RadioGroupStyles as styles,
    } from "@thewaver/ss-components";

    import { ElementFaderSvelteUtils } from "../../../Abstracts/ElementFader/ElementFaderSvelte.utils.svelte.js";
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
    let floater = $state<HTMLDivElement>();
    let entries = $state.raw<RadioGroupEntry[]>([]);
    let measuredBounds = $state.raw<RadioGroupFloaterBounds>();

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

    const floaterBounds = $derived(
        RadioGroupUtils.computeFloaterBounds(
            layout,
            measuredBounds,
            selectedEntry === undefined ? undefined : computePlacement(selectedEntry),
        ),
    );

    const isFloaterShown = $derived(selectedEntry !== undefined && floaterBounds !== undefined);

    const floaterFader = ElementFaderSvelteUtils.createFader(() => isFloaterShown, {
        getTransitionDurationMs: () => transitionDurationMs,
        getRef: () => floater ?? undefined,
    });

    $effect(() => {
        if (floaterFader.getIsVisible()) return;

        measuredBounds = undefined;
    });

    $effect(() => {
        const element = root;
        const selectedElement = selectedEntry?.getElementRef();

        if (!props.renderFloater || layout !== undefined || !element || !selectedElement) return;

        return untrack(() =>
            RadioGroupUtils.observeSelectedBounds(element, selectedElement, (bounds) => {
                measuredBounds = bounds;
            }),
        );
    });

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

{#snippet content()}
    {#if props.renderFloater && floaterFader.getIsVisible() && floaterBounds}
        <div
            bind:this={floater}
            class={styles.radioGroupFloater}
            style={toStyle(floaterBounds, { transitionDuration: `${transitionDurationMs}ms` })}
        >
            {@render props.renderFloater(floaterFader.getTransitionTarget(), transitionDurationMs)}
        </div>
    {/if}

    {@render props.children?.()}
{/snippet}

<div
    bind:this={root}
    {@attach (element) => on(element, "keydown", handleKeyDown)}
    class={layout === undefined ? styles.radioGroupRoot : styles.radioGroupPlacedRoot}
    style:flex-direction={orientation === "horizontal" ? "row" : "column"}
    style:gap={`${props.gap ?? RADIO_GROUP_DEFAULTS.gap}px`}
    role="radiogroup"
    aria-label={props.ariaLabel}
    aria-required={props.isRequired || undefined}
    aria-invalid={props.hasError || undefined}
>
    {#if layout}
        <PlacementBox {layout} computeEffect={props.computeEffect}>
            {@render content()}
        </PlacementBox>
    {:else}
        {@render content()}
    {/if}
</div>
