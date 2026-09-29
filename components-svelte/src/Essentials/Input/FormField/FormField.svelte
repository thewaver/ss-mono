<script lang="ts">
    import { untrack } from "svelte";

    import {
        FORM_FIELD_DEFAULTS,
        type FormEntry,
        type FormFieldContextType,
        type FormFieldState,
        FormFieldStyles as styles,
    } from "@thewaver/ss-components";

    import { getFormContext } from "../../Form/Form.context.js";
    import type { FormFieldProps } from "./FormField.types.js";
    import FormFieldControl from "./FormFieldControl.svelte";

    let props: FormFieldProps = $props();

    const messageId = $props.id();
    const formContext = getFormContext();

    let control = $state<HTMLElement>();

    const orientation = $derived(props.orientation ?? FORM_FIELD_DEFAULTS.orientation);
    const hasError = $derived(props.hasError ?? false);
    const hasMessage = $derived((props.message ?? "").length > 0);
    const isRequired = $derived(props.isRequired ?? false);

    const entry: FormEntry = {
        getHasError: () => hasError,
        getFocusTarget: () => control,
    };

    $effect(() => {
        if (!formContext) return;

        untrack(() => formContext.register(entry));

        return () => formContext.unregister(entry);
    });

    const fieldContext: FormFieldContextType = {
        getDescriptionId: () => (hasMessage ? messageId : undefined),
        registerControl: (element) => {
            control = element;
        },
        unregisterControl: (element) => {
            if (control === element) control = undefined;
        },
    };

    const fieldState: FormFieldState = $derived({ hasError, hasMessage, isRequired });
</script>

<div
    class={styles.formFieldRoot}
    style:flex-direction={orientation === "horizontal" ? "row" : "column"}
    style:gap={`${props.gap ?? FORM_FIELD_DEFAULTS.gap}px`}
>
    {@render props.renderCaption?.(fieldState)}

    <FormFieldControl context={fieldContext}>
        {@render props.renderControl(fieldState)}
    </FormFieldControl>

    {#if hasMessage}
        <div id={messageId} role={hasError ? "alert" : undefined}>
            {#if props.renderMessage}
                {@render props.renderMessage(fieldState)}
            {:else}
                {props.message}
            {/if}
        </div>
    {/if}
</div>
