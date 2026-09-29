<script lang="ts">
    import { TextFieldUtils, type TextSyncElement, TextFieldStyles as styles } from "@thewaver/ss-components";

    import { TextSyncSvelteUtils } from "../../Abstracts/TextSync/TextSyncSvelte.utils.svelte.js";
    import { FormFieldSvelteUtils } from "../../Essentials/Input/FormField/FormFieldSvelte.utils.svelte.js";
    import { LabelSvelteUtils } from "../../Essentials/Input/Label/LabelSvelte.utils.svelte.js";
    import { toStyle } from "../../Utils/styleUtils.js";
    import type { TextFieldElementProps } from "./TextField.types.js";

    let props: TextFieldElementProps = $props();

    const getAriaLabel = LabelSvelteUtils.resolveAriaLabel(() => props.ariaLabel);
    const getAriaDescribedBy = FormFieldSvelteUtils.resolveAriaDescribedBy();

    let element = $state<TextSyncElement>();

    FormFieldSvelteUtils.registerControl(() => element ?? undefined);

    const isDisabled = $derived(props.flags.isDisabled ?? false);
    const isReadOnly = $derived(props.flags.isReadOnly);
    const isTextArea = $derived(props.element === "textarea");
    const isAutoSizing = $derived(TextFieldUtils.computeIsAutoSizing(props.element, props.isAutoSizing));
    const type = $derived(TextFieldUtils.computeType(props.element, props.type));
    const isNumber = $derived(type === "number");
    const isSpinButton = $derived(props.isSpinButton ?? false);
    const valueNow = $derived(
        isSpinButton ? TextFieldUtils.computeSpinValue(props.value, props.computeSpinValue) : undefined,
    );

    const { handleInput, handleCompositionStart, handleCompositionEnd } = TextSyncSvelteUtils.createValueSync(
        () => element ?? undefined,
        () => props.value,
        {
            onInput: (value) => props.onInput?.(value),
            get computeMaskedText() {
                return props.computeMaskedText;
            },
        },
    );

    const style = $derived(
        [
            props.textInset,
            toStyle(props.computeTextStyle?.(props.flags), {
                overflowY: TextFieldUtils.computeOverflowY(props.element, isAutoSizing, props.maxRows),
            }),
        ].join("; "),
    );
</script>

{@render props.renderContent(props.flags)}

{#if props.renderPlaceholder}
    <div class={styles.textFieldPlaceholder} style={props.textInset}>
        {@render props.renderPlaceholder(props.flags, props.placeholderHint)}
    </div>
{/if}

<svelte:element
    this={props.element}
    bind:this={element}
    {@attach props.attachElement}
    {@attach props.attachControl}
    id={props.id}
    {type}
    rows={isAutoSizing ? 1 : undefined}
    name={props.name}
    class={[
        styles.textFieldElement,
        isTextArea && styles.textFieldTextArea,
        props.isConcealed && styles.textFieldConcealed,
    ]}
    {style}
    autocomplete={props.autoComplete}
    inputmode={props.inputMode}
    min={isNumber ? props.min : undefined}
    max={isNumber ? props.max : undefined}
    step={isNumber ? props.step : undefined}
    readonly={isDisabled || isReadOnly}
    role={isSpinButton ? "spinbutton" : undefined}
    aria-label={getAriaLabel()}
    aria-describedby={getAriaDescribedBy()}
    aria-valuenow={valueNow}
    aria-valuemin={isSpinButton ? props.min : undefined}
    aria-valuemax={isSpinButton ? props.max : undefined}
    aria-disabled={isDisabled || undefined}
    aria-readonly={isReadOnly || undefined}
    aria-required={props.isRequired || undefined}
    aria-invalid={props.flags.hasError || undefined}
    {...props.ariaAttributes}
    oninput={(e: Event) => handleInput(e.currentTarget as TextSyncElement)}
    oncompositionstart={handleCompositionStart}
    oncompositionend={(e: CompositionEvent) => handleCompositionEnd(e.currentTarget as TextSyncElement)}
    onkeydown={(e: KeyboardEvent) => {
        if (isDisabled) return;

        props.onKeyDown?.(e);
    }}
    onblur={() => {
        if (isDisabled) return;

        props.onBlur?.();
    }}
    onmouseenter={(e: MouseEvent) => {
        if (isDisabled) return;

        props.onMouseEnter?.(e);
    }}
    onmouseleave={(e: MouseEvent) => {
        if (isDisabled) return;

        props.onMouseLeave?.(e);
    }}
></svelte:element>

{#if props.renderLeading}
    <div
        {@attach props.attachLeading}
        class={styles.textFieldAdornment}
        style:left={`${props.spreadPadding.paddingLeft}px`}
    >
        {@render props.renderLeading(props.flags)}
    </div>
{/if}

{#if props.renderTrailing}
    <div
        {@attach props.attachTrailing}
        class={styles.textFieldAdornment}
        style:right={`${props.spreadPadding.paddingRight}px`}
    >
        {@render props.renderTrailing(props.flags)}
    </div>
{/if}
