<script lang="ts" generics="T">
    import {
        type AnchorPlacement,
        FormValueUtils,
        type InteractionFlags,
        SELECT_DEFAULTS,
        type SelectFlags,
        SelectUtils,
        SelectStyles as styles,
        TextFieldUtils,
    } from "@thewaver/ss-components";
    import { CSSUtils } from "@thewaver/ss-utils";

    import FormValue from "../../../Primitives/FormValue/FormValue.svelte";
    import InteractionWrapper from "../../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import Popover from "../../../Primitives/Popover/Popover.svelte";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import Button from "../../Buttons/Button/Button.svelte";
    import { FormFieldSvelteUtils } from "../FormField/FormFieldSvelte.utils.svelte.js";
    import { getLabelContext } from "../Label/Label.context.js";
    import ListboxOptions from "../Listbox/ListboxOptions.svelte";
    import { ListboxSvelteUtils } from "../Listbox/ListboxSvelte.utils.svelte.js";
    import type { SelectCompositeProps } from "./Select.types.js";
    import SelectField from "./SelectField.svelte";

    const EMPTY_QUERY = "";
    const EMPTY_FORM_VALUE = "";

    let {
        ref = $bindable(),
        visibility = $bindable(false),
        query = $bindable(),
        ...props
    }: SelectCompositeProps<T> = $props();

    const uid = $props.id();
    const listboxId = `${uid}-listbox`;
    const fallbackFieldId = `${uid}-field`;

    const labelContext = getLabelContext();
    const getCaptionId = FormFieldSvelteUtils.resolveAriaLabelledBy();

    let hasPopoverSettled = $state(true);
    let isEditing = $state(false);

    const fieldId = $derived(props.id ?? fallbackFieldId);
    const isDisabled = $derived(props.isDisabled ?? false);
    const isMultiple = $derived(props.isMultiple ?? false);
    const isFilterable = $derived(query !== undefined);
    const currentQuery = $derived(query ?? EMPTY_QUERY);
    const isFiltering = $derived(currentQuery !== EMPTY_QUERY);

    const spreadPadding = $derived(TextFieldUtils.resolvePadding(props.padding ?? SELECT_DEFAULTS.padding));
    const textInset = $derived(toStyle(CSSUtils.spreadableToStyle(spreadPadding, String)));

    watchChange(
        () => visibility,
        (isOpen) => {
            if (!isOpen) hasPopoverSettled = false;
        },
        { isBeforeRender: true },
    );

    const open = () => {
        if (isDisabled) return;

        visibility = true;
    };

    const close = () => {
        visibility = false;
    };

    $effect(() => {
        if (!visibility || !isDisabled) return;

        visibility = false;
    });

    $effect(() => {
        if (visibility) return;

        isEditing = false;
    });

    const valueText = $derived.by(() => {
        if (isMultiple) return EMPTY_QUERY;

        const picked = props.selectedOptions[0];

        return picked === undefined ? undefined : props.computeCustomText?.(picked);
    });

    const cursor = ListboxSvelteUtils.createCursor<T>({
        focusModel: "active_descendant",
        getListboxId: () => listboxId,
        getOptions: () => props.options,
        getSelectedOptions: () => props.selectedOptions,
        getIsDisabled: () => isDisabled,
        getIsMultiple: () => isMultiple,
        getIsOpen: () => visibility,
        getIsFilterable: () => isFilterable,
        getIsFiltering: () => isFiltering,
        getHasMoreOptions: () => props.hasMoreOptions ?? false,
        get computeCustomText() {
            return props.computeCustomText;
        },
        onOpen: open,
        onClose: close,
        onPick: (value) => props.onPick(value),
    });

    const clearValue = () => {
        if (isDisabled) return;

        close();

        props.onClear();

        ref?.focus();
    };

    FormFieldSvelteUtils.registerControl(() => ref);

    $effect(() => {
        if (!SelectUtils.getIsQueryClearDue(visibility, hasPopoverSettled, currentQuery)) return;

        query = EMPTY_QUERY;
    });

    const computeFormValues = () => {
        const texts = FormValueUtils.computeTexts(
            props.selectedOptions.map((option) => option.value),
            props.computeFormValue,
        );

        return isMultiple || texts.length > 0 ? texts : [EMPTY_FORM_VALUE];
    };

    const extraFlags: SelectFlags = $derived({
        isOpen: visibility,
        isEmpty: props.selectedOptions.length < 1,
        isFiltering,
    });
</script>

{#snippet renderOptions()}
    <ListboxOptions
        {cursor}
        isLive={visibility}
        hasMoreOptions={props.hasMoreOptions}
        computeEstimatedOptionHeight={props.computeEstimatedOptionHeight}
        computeEstimatedGroupHeight={props.computeEstimatedGroupHeight}
        computeIsSelected={props.computeIsSelected}
        renderOption={props.renderOption}
        renderGroupHeader={props.renderGroupHeader}
        renderGroupBox={props.renderGroupBox}
        floaterTransitionDurationMs={props.floaterTransitionDurationMs ?? SELECT_DEFAULTS.floaterTransitionDurationMs}
        renderSelectionFloater={props.renderSelectionFloater}
        renderHighlightFloater={props.renderHighlightFloater}
        onReachEnd={props.onReachEnd}
    />
{/snippet}

<InteractionWrapper {...props} bind:ref {extraFlags}>
    {#snippet renderControl(attachElement, flags)}
        {#snippet fieldContent(fieldFlags: InteractionFlags<SelectFlags>)}
            {@render props.renderContent(props.selectedOptions, fieldFlags)}
        {/snippet}
        {#snippet popupContent(visibilityTarget: 0 | 1, transitionDurationMs: number, placement: AnchorPlacement)}
            {@render props.renderPopup(renderOptions, visibilityTarget, transitionDurationMs, placement, flags)}
        {/snippet}
        <SelectField
            {attachElement}
            id={fieldId}
            ariaLabel={props.ariaLabel}
            isRequired={props.isRequired}
            {listboxId}
            activeOptionId={cursor.getActiveOptionId()}
            {isFilterable}
            query={currentQuery}
            {isEditing}
            {valueText}
            {textInset}
            {flags}
            computeTextStyle={props.computeTextStyle}
            renderContent={fieldContent}
            onToggle={() => (visibility && !isFilterable ? close() : open())}
            onKeyDown={cursor.handleKeyDown}
            onQueryInput={(next) => {
                isEditing = true;
                open();
                cursor.highlight(undefined);

                query = next;
            }}
        />

        {#if props.renderClear && props.selectedOptions.length > 0}
            <div class={styles.selectClear} style:inset-inline-end={`${spreadPadding.paddingInlineEnd}px`}>
                <Button
                    {isDisabled}
                    ariaLabel={props.clearAriaLabel}
                    renderContent={props.renderClear}
                    onClick={clearValue}
                />
            </div>
        {/if}

        <FormValue name={props.name} values={props.name === undefined ? [] : computeFormValues()} />

        <Popover
            id={listboxId}
            role={"listbox"}
            ariaAttributes={SelectUtils.computeListAriaAttributes({
                listAriaLabel: props.listAriaLabel,
                labelId: getCaptionId() ?? labelContext.getLabelId(),
                fieldId,
                isMultiple,
            })}
            placement={props.placement}
            offset={props.offset}
            reservedScreenSize={props.reservedScreenSize}
            transitionDurationMs={props.transitionDurationMs}
            hasAnchorMinWidth={true}
            isOpen={visibility}
            anchorRef={ref}
            onDismiss={close}
            onTransitionStatusChange={(hasTransitionFinished) => {
                hasPopoverSettled = hasTransitionFinished;
            }}
            renderContent={popupContent}
        />
    {/snippet}
</InteractionWrapper>
