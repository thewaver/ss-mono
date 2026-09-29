<script lang="ts">
    import { untrack } from "svelte";

    import { type FormEntry, type FormState, FormUtils } from "@thewaver/ss-components";

    import { setFormContext } from "./Form.context.js";
    import type { FormProps } from "./Form.types.js";

    let props: FormProps = $props();

    let entries = $state.raw<FormEntry[]>([]);
    let hasSubmitted = $state(false);
    let focusRequest = $state(0);

    const isValid = $derived(FormUtils.computeIsValid(entries));

    setFormContext({
        register: (entry) => {
            entries = [...entries, entry];
        },
        unregister: (entry) => {
            entries = entries.filter((held) => held !== entry);
        },
        getIsValid: () => isValid,
        getHasSubmitted: () => hasSubmitted,
    });

    $effect(() => {
        if (focusRequest < 1) return;

        untrack(() => FormUtils.findErrorFocusTarget(entries)?.focus());
    });

    const formState: FormState = {
        get isValid() {
            return isValid;
        },
        get hasSubmitted() {
            return hasSubmitted;
        },
    };
</script>

<form
    id={props.id}
    name={props.name}
    aria-label={props.ariaLabel}
    aria-labelledby={props.ariaLabelledBy}
    novalidate
    onsubmit={(e) => {
        e.preventDefault();

        hasSubmitted = true;
        focusRequest += 1;

        props.onSubmit?.();
    }}
    onreset={(e) => {
        e.preventDefault();

        hasSubmitted = false;

        props.onReset?.();
    }}
>
    {@render props.renderContent(formState)}
</form>
