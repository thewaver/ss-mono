<script lang="ts">
    import {
        TAG_INPUT_DEFAULTS,
        type TagInputFlags,
        type TagInputKeyAction,
        TagInputUtils,
        TagInputStyles as styles,
    } from "@thewaver/ss-components";

    import { NavigatorSvelteUtils } from "../../../Abstracts/Navigator/NavigatorSvelte.utils.svelte.js";
    import InteractionWrapper from "../../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import { FormFieldSvelteUtils } from "../FormField/FormFieldSvelte.utils.svelte.js";
    import { LabelSvelteUtils } from "../Label/LabelSvelte.utils.svelte.js";
    import type { TagInputProps } from "./TagInput.types.js";

    const EMPTY_TEXT = "";

    let { value = $bindable(), text = $bindable(EMPTY_TEXT), ref = $bindable(), ...props }: TagInputProps = $props();

    const getAriaLabel = LabelSvelteUtils.resolveAriaLabel(() => props.ariaLabel);
    const getAriaDescribedBy = FormFieldSvelteUtils.resolveAriaDescribedBy();

    let tagElements = $state<(HTMLButtonElement | null | undefined)[]>([]);

    let field = $state<HTMLInputElement>();

    FormFieldSvelteUtils.registerControl(() => field ?? undefined);

    const getDirection = NavigatorSvelteUtils.createDirection(() => field ?? undefined);

    const isDisabled = $derived(props.isDisabled ?? false);
    const isEmpty = $derived(text.length < 1);

    const setTags = (next: string[]) => {
        value = next;

        props.onTagsChange?.(next);
    };

    const focusTag = (index: number) => {
        tagElements[index]?.focus();
    };

    const focusField = () => {
        field?.focus();
    };

    const addTag = () => {
        const tag = TagInputUtils.computeTag(text, props.computeTag);

        if (!tag) return;

        setTags([...value, tag]);
        text = EMPTY_TEXT;
    };

    const removeTag = (index: number) => {
        const count = value.length;

        setTags(value.filter((_, position) => position !== index));

        const next = TagInputUtils.computeFocusAfterRemoval(index, count);

        if (next === undefined) focusField();
        else focusTag(next);
    };

    const runKeyAction = (e: KeyboardEvent, action: TagInputKeyAction | undefined) => {
        if (!action) return;

        if (TagInputUtils.getIsKeyTaken(action)) e.preventDefault();

        if (action.kind === "add") addTag();
        else if (action.kind === "remove") removeTag(action.index);
        else if (action.kind === "focusTag") focusTag(action.index);
        else focusField();
    };

    const extraFlags: TagInputFlags = $derived({ isEmpty, hasTags: value.length > 0 });
</script>

<InteractionWrapper {...props} bind:ref {extraFlags}>
    {#snippet renderControl(attachElement, flags)}
        {@render props.renderContent(flags)}

        <div
            class={styles.tagInputRoot}
            style:gap={`${props.gap ?? TAG_INPUT_DEFAULTS.gap}px`}
            style:padding={`${props.padding ?? TAG_INPUT_DEFAULTS.padding}px`}
            role="group"
            aria-label={props.ariaLabel}
            onpointerdown={(e) => {
                if (e.target !== e.currentTarget || isDisabled) return;

                e.preventDefault();
                focusField();
            }}
            onmouseenter={(e) => {
                if (isDisabled) return;

                props.onMouseEnter?.(e);
            }}
            onmouseleave={(e) => {
                if (isDisabled) return;

                props.onMouseLeave?.(e);
            }}
        >
            {#each value as tag, index (index)}
                <InteractionWrapper isDisabled={flags.isDisabled ?? false} isTabbable={false}>
                    {#snippet renderControl(attachTag, tagFlags)}
                        <button
                            bind:this={tagElements[index]}
                            {@attach attachTag}
                            type="button"
                            class={styles.tagInputTag}
                            aria-label={props.computeTagAriaLabel?.(tag) ?? tag}
                            aria-disabled={tagFlags.isDisabled || undefined}
                            onclick={() => {
                                if (tagFlags.isDisabled) return;

                                removeTag(index);
                            }}
                            onkeydown={(e) => {
                                if (isDisabled) return;

                                runKeyAction(
                                    e,
                                    TagInputUtils.computeTagKeyAction(e, index, {
                                        tagCount: value.length,
                                        direction: getDirection(),
                                    }),
                                );
                            }}
                        >
                            {@render props.renderTag(tag, tagFlags)}
                        </button>
                    {/snippet}
                </InteractionWrapper>
            {/each}

            <input
                bind:this={field}
                {@attach attachElement}
                id={props.id}
                type="text"
                name={props.name}
                class={styles.tagInputField}
                style={props.computeTextStyle ? toStyle(props.computeTextStyle(flags)) : undefined}
                value={text}
                readonly={flags.isDisabled ?? false}
                aria-label={getAriaLabel()}
                aria-describedby={getAriaDescribedBy()}
                aria-disabled={flags.isDisabled || undefined}
                oninput={(e) => {
                    const input = e.currentTarget;

                    text = input.value;

                    if (input.value !== text) input.value = text;
                }}
                onkeydown={(e) => {
                    if (isDisabled) return;

                    runKeyAction(
                        e,
                        TagInputUtils.computeFieldKeyAction(e.key, {
                            isEmpty,
                            tagCount: value.length,
                            direction: getDirection(),
                        }),
                    );
                }}
            />

            {#if props.renderPlaceholder && isEmpty && value.length < 1}
                <div class={styles.tagInputPlaceholder}>{@render props.renderPlaceholder(flags)}</div>
            {/if}
        </div>
    {/snippet}
</InteractionWrapper>
