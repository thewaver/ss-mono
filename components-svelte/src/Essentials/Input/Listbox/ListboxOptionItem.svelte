<script lang="ts">
    import { untrack } from "svelte";
    import { on } from "svelte/events";

    import { ListboxStyles as styles, ListboxUtils } from "@thewaver/ss-components";

    import type { ListboxOptionItemProps } from "./Listbox.types.js";

    let props: ListboxOptionItemProps = $props();

    let element = $state<HTMLDivElement>();

    const isDisabled = $derived(props.flags.isDisabled ?? false);
    const isHighlighted = $derived(props.flags.isHighlighted ?? false);

    $effect(() => {
        const option = element;

        if (!option || !isHighlighted || !props.isSelfScrolling) return;

        const focusModel = props.focusModel;

        untrack(() => ListboxUtils.revealOption(option, focusModel));
    });
</script>

<div
    bind:this={element}
    {@attach props.attachElement}
    {@attach (element) =>
        on(element, "click", () => {
            if (isDisabled) return;

            props.onSelect();
        })}
    id={props.id}
    class={styles.listboxOption}
    role="option"
    tabindex="-1"
    aria-disabled={isDisabled || undefined}
    aria-selected={props.flags.isSelected}
    onfocus={() => props.onFocus?.()}
>
    {@render props.renderContent(props.flags)}
</div>
