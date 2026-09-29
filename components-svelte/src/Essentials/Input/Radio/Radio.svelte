<script lang="ts" generics="T">
    import { untrack } from "svelte";

    import { type InteractionSizing, InteractionTrackerUtils, type RadioGroupEntry } from "@thewaver/ss-components";

    import BinarySwitch from "../../../Primitives/BinarySwitch/BinarySwitch.svelte";
    import PlacementItem from "../../../Primitives/PlacementItem/PlacementItem.svelte";
    import { getRadioGroupContext } from "../RadioGroup/RadioGroup.context.js";
    import type { RadioProps } from "./Radio.types.js";

    const ROW_SIZING: InteractionSizing = "fit-content";
    const PLACED_SIZING: InteractionSizing = "fill";

    let props: RadioProps<T> = $props();

    const context = getRadioGroupContext();

    let element = $state<HTMLElement>();

    const isDisabled = $derived(props.isDisabled ?? false);

    const isReachable = $derived(
        InteractionTrackerUtils.computeIsReachable(
            isDisabled,
            props.isReachableWhenDisabled ?? false,
            props.isFocusableWhenDisabled ?? false,
        ),
    );

    const entry: RadioGroupEntry = {
        getElementRef: () => element,
        getIsDisabled: () => isDisabled,
        getIsReachable: () => isReachable,
        getValue: () => props.value,
    };

    $effect(() => untrack(() => context.register(entry)));

    const placement = $derived(context.computePlacement(entry));
</script>

{#snippet radio()}
    <BinarySwitch
        {...props}
        bind:ref={element}
        type="radio"
        name={context.getName()}
        sizing={placement === undefined ? (props.sizing ?? ROW_SIZING) : PLACED_SIZING}
        isChecked={context.getValue() === props.value}
        isTabbable={context.computeIsTabbable(props.value)}
        onChange={(isChecked) => {
            context.setValue(props.value);

            props.onChange?.(isChecked);
        }}
    />
{/snippet}

{#if placement}
    <PlacementItem {placement}>
        {@render radio()}
    </PlacementItem>
{:else}
    {@render radio()}
{/if}
