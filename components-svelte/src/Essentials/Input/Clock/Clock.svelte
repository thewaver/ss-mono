<script lang="ts">
    import { untrack } from "svelte";
    import { on } from "svelte/events";

    import {
        CLOCK_DEFAULTS,
        type ClockColumn,
        type ClockRenderProps,
        type ClockSteps,
        type ClockUnit,
        ClockUtils,
        type InteractionFlags,
        PopoverUtils,
        ClockStyles as styles,
    } from "@thewaver/ss-components";
    import type { TimeValue } from "@thewaver/ss-utils";

    import { NavigatorSvelteUtils } from "../../../Abstracts/Navigator/NavigatorSvelte.utils.svelte.js";
    import InteractionWrapper from "../../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import type { ClockProps } from "./Clock.types.js";
    import ClockOptionControl from "./ClockOptionControl.svelte";

    const NO_CLOCK_STEPS: ClockSteps = {};

    const toOptionKey = (unit: ClockUnit, index: number) => `${unit}:${index}`;

    let { value = $bindable(), ...props }: ClockProps = $props();

    const groupId = $props.id();

    let root = $state<HTMLDivElement>();
    let highlighted = $state.raw<TimeValue>();
    let highlightedUnit = $state<ClockUnit>();

    const optionRefs = new Map<string, HTMLElement>();
    const fallbackNow = ClockUtils.fromDate(new Date());

    const getDirection = NavigatorSvelteUtils.createDirection(() => root);

    const isTwelveHour = $derived(props.isTwelveHour ?? false);
    const hasSeconds = $derived(props.hasSeconds ?? false);
    const gap = $derived(`${props.gap ?? CLOCK_DEFAULTS.gap}px`);
    const now = $derived(props.now ?? fallbackNow);

    const base = $derived(ClockUtils.computeBase(value, now, hasSeconds, props.minValue, props.maxValue));
    const units = $derived(ClockUtils.getUnits(hasSeconds, isTwelveHour));
    const meridiemNames = $derived(ClockUtils.getMeridiemNames(props.locale));
    const columns = $derived(
        ClockUtils.getColumns(units, base, isTwelveHour, props.steps ?? NO_CLOCK_STEPS, meridiemNames),
    );

    const rovingTime = $derived(highlighted ?? base);
    const rovingUnit = $derived(ClockUtils.resolveRovingUnit(highlightedUnit, units));

    const getRovingIndex = (column: ClockColumn) => ClockUtils.getRovingIndex(column, rovingTime, isTwelveHour);

    const getIsTimeDisabled = (time: TimeValue) =>
        ClockUtils.getIsTimeDisabled(time, {
            isDisabled: props.isDisabled,
            minValue: props.minValue,
            maxValue: props.maxValue,
            computeIsTimeDisabled: props.computeIsTimeDisabled,
        });

    const pick = (time: TimeValue, unit: ClockUnit) => {
        if (getIsTimeDisabled(time)) return;

        highlighted = time;
        highlightedUnit = unit;
        value = time;
    };

    $effect(() => {
        const next = value;

        if (next) highlighted = next;
    });

    const rovingKeys = $derived(columns.map((column) => toOptionKey(column.unit, getRovingIndex(column))));
    const rovingKey = $derived(rovingKeys[units.indexOf(rovingUnit)]);
    const rovingKeyList = $derived(rovingKeys.join());

    $effect(() => {
        rovingKeyList;

        untrack(() =>
            rovingKeys.forEach((key) => {
                const element = optionRefs.get(key);

                if (element && root) PopoverUtils.revealWithin(element, root);
            }),
        );
    });

    $effect(() => {
        const key = rovingKey;

        untrack(() => {
            const element = optionRefs.get(key);

            if (!element || !root?.contains(document.activeElement) || root === document.activeElement) return;

            element.focus();
        });
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        const action = ClockUtils.computeKeyAction(e.key, {
            columns,
            rovingUnit,
            rovingTime,
            isTwelveHour,
            direction: getDirection(),
        });

        if (!action) return;

        e.preventDefault();

        if (action.kind === "pick") pick(action.time, action.unit);
        else if (action.kind === "highlight") highlighted = action.time;
        else highlightedUnit = action.unit;
    };
</script>

{#snippet columnOptions(column: ClockColumn)}
    {#each column.options as option, optionIndex (optionIndex)}
        {@const key = toOptionKey(column.unit, optionIndex)}
        {@const isHighlighted = key === rovingKey}
        <InteractionWrapper
            sizing={"fill"}
            isDisabled={getIsTimeDisabled(option.time)}
            isFocusableWhenDisabled={!(props.isDisabled ?? false)}
            isTabbable={isHighlighted}
            extraFlags={{
                option,
                isSelected: ClockUtils.getIsAt(column, optionIndex, value, isTwelveHour),
                isNow: ClockUtils.getIsAt(column, optionIndex, now, isTwelveHour),
                isHighlighted,
            }}
            bind:ref={
                () => optionRefs.get(key),
                (element) => {
                    if (element) optionRefs.set(key, element);
                    else optionRefs.delete(key);
                }
            }
        >
            {#snippet renderControl(attachElement, flags)}
                {#snippet optionContent(optionFlags: InteractionFlags<ClockRenderProps>)}
                    {@render props.renderOption(option, optionFlags)}
                {/snippet}
                <ClockOptionControl
                    {attachElement}
                    id={`${groupId}-${column.unit}-${optionIndex}`}
                    {flags}
                    ariaLabel={option.label}
                    renderContent={optionContent}
                    onSelect={() => pick(option.time, option.unit)}
                />
            {/snippet}
        </InteractionWrapper>
    {/each}
{/snippet}

<div
    bind:this={root}
    {@attach (element) => on(element, "keydown", handleKeyDown)}
    id={groupId}
    class={styles.clockRoot}
    style:gap
    role="group"
    aria-label={props.ariaLabel}
    aria-disabled={props.isDisabled || undefined}
>
    {#each columns as column (column.unit)}
        {@const name = ClockUtils.getUnitName(column.unit, props.locale)}
        {#snippet renderOptions()}
            {@render columnOptions(column)}
        {/snippet}
        <div class={styles.clockColumn}>
            <div class={styles.clockUnit} aria-hidden="true">
                {@render props.renderUnit?.(name, column.unit)}
            </div>

            <div
                class={styles.clockList}
                style:gap
                role="listbox"
                aria-label={name}
                aria-disabled={props.isDisabled || undefined}
            >
                {#if props.renderColumn}
                    {@render props.renderColumn(renderOptions, column.unit)}
                {:else}
                    {@render columnOptions(column)}
                {/if}
            </div>
        </div>
    {/each}
</div>
