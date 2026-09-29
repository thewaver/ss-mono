<script lang="ts">
    import { untrack } from "svelte";
    import type { Attachment } from "svelte/attachments";

    import { TEXT_FIELD_DEFAULTS, type TextFieldFlags, TextFieldUtils } from "@thewaver/ss-components";
    import { CSSUtils } from "@thewaver/ss-utils";

    import { ElementObserverSvelteUtils } from "../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { toStyle } from "../../Utils/styleUtils.js";
    import InteractionWrapper from "../InteractionWrapper/InteractionWrapper.svelte";
    import type { TextFieldProps } from "./TextField.types.js";
    import TextFieldElement from "./TextFieldElement.svelte";

    let { value = $bindable(), ref = $bindable(), ...props }: TextFieldProps = $props();

    let control = $state<HTMLElement>();
    let leading = $state<HTMLDivElement>();
    let trailing = $state<HTMLDivElement>();

    const getLeadingSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(
        () => leading,
        () => !props.renderLeading,
    );
    const getTrailingSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(
        () => trailing,
        () => !props.renderTrailing,
    );

    const isAutoSizing = $derived(TextFieldUtils.computeIsAutoSizing(props.element, props.isAutoSizing));
    const minRows = $derived(props.minRows ?? TEXT_FIELD_DEFAULTS.minRows);

    let minHeight = $state(0);

    $effect(() => {
        const element = control;
        const rows = minRows;
        const maxRows = props.maxRows;

        value;

        if (!element || !isAutoSizing) {
            minHeight = 0;

            return;
        }

        minHeight = untrack(() => TextFieldUtils.measureContentHeight(element, rows, maxRows));
    });

    $effect(() => {
        const element = control;

        if (!element || !isAutoSizing) return;

        return untrack(() =>
            TextFieldUtils.observeWidthChange(element, () => {
                minHeight = TextFieldUtils.measureContentHeight(element, minRows, props.maxRows);
            }),
        );
    });

    const spreadPadding = $derived(TextFieldUtils.resolvePadding(props.padding ?? TEXT_FIELD_DEFAULTS.padding));
    const gap = $derived(props.gap ?? TEXT_FIELD_DEFAULTS.gap);

    const leadingInset = $derived(
        TextFieldUtils.computeInset(spreadPadding.paddingLeft, props.renderLeading ? getLeadingSize().width : 0, gap),
    );
    const trailingInset = $derived(
        TextFieldUtils.computeInset(
            spreadPadding.paddingRight,
            props.renderTrailing ? getTrailingSize().width : 0,
            gap,
        ),
    );

    const textInset = $derived(
        toStyle(
            CSSUtils.spreadableToStyle(
                { ...spreadPadding, paddingLeft: leadingInset, paddingRight: trailingInset },
                String,
            ),
        ),
    );

    const extraFlags: TextFieldFlags = $derived({ isEmpty: value === "", isReadOnly: props.isReadOnly ?? false });

    const attachLeading: Attachment<HTMLDivElement> = (element) => {
        leading = element;

        return () => {
            if (leading === element) leading = undefined;
        };
    };

    const attachTrailing: Attachment<HTMLDivElement> = (element) => {
        trailing = element;

        return () => {
            if (trailing === element) trailing = undefined;
        };
    };

    const attachControl: Attachment<HTMLElement> = (element) => {
        control = element;

        return () => {
            if (control === element) control = undefined;
        };
    };
</script>

<InteractionWrapper {...props} bind:ref {extraFlags} minWidth={leadingInset + trailingInset} {minHeight}>
    {#snippet renderControl(attachElement, flags)}
        <TextFieldElement
            {attachElement}
            {attachControl}
            {attachLeading}
            {attachTrailing}
            id={props.id}
            element={props.element}
            type={props.type}
            name={props.name}
            ariaLabel={props.ariaLabel}
            isSpinButton={props.isSpinButton}
            isRequired={props.isRequired}
            autoComplete={props.autoComplete}
            inputMode={props.inputMode}
            computeMaskedText={props.computeMaskedText}
            computeSpinValue={props.computeSpinValue}
            placeholderHint={props.placeholderHint}
            min={props.min}
            max={props.max}
            step={props.step}
            {isAutoSizing}
            {minRows}
            maxRows={props.maxRows}
            isConcealed={props.isConcealed}
            {flags}
            {value}
            {textInset}
            {spreadPadding}
            computeTextStyle={props.computeTextStyle}
            renderContent={props.renderContent}
            renderPlaceholder={props.renderPlaceholder}
            renderLeading={props.renderLeading}
            renderTrailing={props.renderTrailing}
            ariaAttributes={props.ariaAttributes}
            onInput={(next) => {
                value = next;

                props.onInput?.(next);
            }}
            onKeyDown={props.onKeyDown}
            onBlur={props.onBlur}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
        />
    {/snippet}
</InteractionWrapper>
