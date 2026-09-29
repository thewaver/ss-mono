<script lang="ts">
    import { untrack } from "svelte";

    import {
        FORM_SECTION_DEFAULTS,
        type FormContextType,
        type FormEntry,
        type FormSectionState,
        FormUtils,
        FormSectionStyles as styles,
    } from "@thewaver/ss-components";

    import { getFormContext } from "../../Form/Form.context.js";
    import type { FormSectionProps } from "./FormSection.types.js";
    import FormSectionContent from "./FormSectionContent.svelte";

    let props: FormSectionProps = $props();

    const messageId = $props.id();
    const outerContext = getFormContext();

    let entries = $state.raw<FormEntry[]>([]);

    const orientation = $derived(props.orientation ?? FORM_SECTION_DEFAULTS.orientation);
    const hasError = $derived(props.hasError ?? false);
    const hasMessage = $derived((props.message ?? "").length > 0);
    const isValid = $derived(!hasError && FormUtils.computeIsValid(entries));

    const entry: FormEntry = {
        getHasError: () => !isValid,
        getFocusTarget: () => FormUtils.findSectionFocusTarget(entries),
    };

    $effect(() => {
        if (!outerContext) return;

        untrack(() => outerContext.register(entry));

        return () => outerContext.unregister(entry);
    });

    const innerContext: FormContextType = {
        register: (held) => {
            entries = [...entries, held];
        },
        unregister: (held) => {
            entries = entries.filter((other) => other !== held);
        },
        getIsValid: () => isValid,
        getHasSubmitted: () => outerContext?.getHasSubmitted() ?? false,
    };

    const sectionState: FormSectionState = {
        get isValid() {
            return isValid;
        },
        get hasError() {
            return hasError;
        },
        get hasMessage() {
            return hasMessage;
        },
    };
</script>

<fieldset
    class={styles.formSectionRoot}
    style:flex-direction={orientation === "horizontal" ? "row" : "column"}
    style:gap={`${props.gap ?? FORM_SECTION_DEFAULTS.gap}px`}
    aria-label={props.ariaLabel}
    aria-describedby={hasMessage ? messageId : undefined}
>
    {#if props.renderCaption}
        <legend class={styles.formSectionCaption}>{@render props.renderCaption(sectionState)}</legend>
    {/if}

    <FormSectionContent context={innerContext}>
        {@render props.renderContent(sectionState)}
    </FormSectionContent>

    {#if hasMessage}
        <div id={messageId} role={hasError ? "alert" : undefined}>
            {#if props.renderMessage}
                {@render props.renderMessage(sectionState)}
            {:else}
                {props.message}
            {/if}
        </div>
    {/if}
</fieldset>
