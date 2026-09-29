<script lang="ts" generics="T">
    import { untrack } from "svelte";

    import {
        CHECKBOX_GROUP_DEFAULTS,
        type CheckboxGroupController,
        type CheckboxGroupEntry,
        CheckboxGroupUtils,
        CheckboxGroupStyles as styles,
    } from "@thewaver/ss-components";

    import { createHeldValue } from "../../../Utils/bindableUtils.svelte.js";
    import { setCheckboxGroupContext } from "./CheckboxGroup.context.js";
    import type { CheckboxGroupProps } from "./CheckboxGroup.types.js";

    let { value = $bindable([]), ...props }: CheckboxGroupProps<T> = $props();

    const [getValue, setValue] = createHeldValue([
        () => value,
        (next) => {
            value = next;
        },
    ]);

    let entries = $state.raw<CheckboxGroupEntry[]>([]);

    const orientation = $derived(props.orientation ?? CHECKBOX_GROUP_DEFAULTS.orientation);

    const computeIsChecked = (candidate: unknown) => getValue().includes(candidate as T);

    setCheckboxGroupContext({
        computeIsChecked,
        setIsChecked: (candidate, isChecked) => {
            if (untrack(() => computeIsChecked(candidate)) === isChecked) return;

            setValue(CheckboxGroupUtils.toggleValue(untrack(getValue), candidate as T, isChecked));
        },
        register: (entry) => {
            entries = [...entries, entry];

            return () => {
                entries = entries.filter((held) => held !== entry);
            };
        },
    });

    const controller: CheckboxGroupController = {
        getCheckedState: () => CheckboxGroupUtils.computeCheckedState(getValue(), entries),
        setIsEveryChecked: (isChecked) => {
            const current = untrack(getValue);
            const changedValues = untrack(() => CheckboxGroupUtils.computeChangedValues(current, entries, isChecked));

            if (changedValues.length < 1) return false;

            setValue(CheckboxGroupUtils.applyChangedValues(current, changedValues, isChecked));

            return true;
        },
    };

    $effect(() => {
        untrack(() => props.onMount?.(controller));
    });
</script>

<div
    class={styles.checkboxGroupRoot}
    style:flex-direction={orientation === "horizontal" ? "row" : "column"}
    style:gap={`${props.gap ?? CHECKBOX_GROUP_DEFAULTS.gap}px`}
    role="group"
    aria-label={props.ariaLabel}
>
    {@render props.children?.()}
</div>
