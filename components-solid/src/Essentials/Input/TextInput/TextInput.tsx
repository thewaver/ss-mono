import { Show, createMemo, createSignal, createUniqueId } from "solid-js";

import { ListboxUtils } from "@thewaver/ss-components";

import { Popover } from "../../../Primitives/Popover/Popover";
import { TextField } from "../../../Primitives/TextField/TextField";
import { access } from "../../../Utils/propUtils";
import { ListboxOptions } from "../Listbox/Listbox";
import { ListboxSolidUtils } from "../Listbox/ListboxSolid.utils";
import type { SelectOption } from "../Select/SelectSolid.types";
import type { TextInputProps } from "./TextInputSolid.types";

const EMPTY_SELECTION: never[] = [];
const NO_AUTOCOMPLETE = "off";

export const TextInput = <T = string,>(props: TextInputProps<T>) => {
    const listboxId = createUniqueId();

    const [getFieldRef, setFieldRef] = createSignal<HTMLElement>();
    const [getIsWanted, setIsWanted] = createSignal(false);

    const getHasSuggestions = () => props.suggestions !== undefined;

    const getIsRefused = createMemo(
        () => !getHasSuggestions() || (access(props.isDisabled) ?? false) || (access(props.isReadOnly) ?? false),
    );

    const getOptions = createMemo((): SelectOption<T>[] =>
        props.suggestions === undefined ? EMPTY_SELECTION : access(props.suggestions).map((value) => ({ value })),
    );

    const getIsOpen = createMemo(() => getIsWanted() && !getIsRefused() && getOptions().length > 0);

    const open = () => {
        if (getIsRefused()) return;

        setIsWanted(true);
    };

    const close = () => {
        setIsWanted(false);
    };

    const writeSuggestion = (suggestion: T) => {
        const index = cursor.getFlatOptions().findIndex((option) => option.value === suggestion);
        const text = ListboxUtils.computePickedText(listboxId, index, props.computeCustomSuggestionText?.(suggestion));

        props.value[1](text);

        void props.onInput?.(text);
        void props.onSuggestionPick?.(suggestion);
    };

    const cursor = ListboxSolidUtils.createCursor<T>({
        focusModel: "activeDescendant",
        isHighlightExplicit: true,
        getListboxId: () => listboxId,
        getOptions,
        getSelectedOptions: () => EMPTY_SELECTION,
        getIsDisabled: getIsRefused,
        getIsOpen,
        getIsFilterable: () => true,
        getIsFiltering: () => true,
        onOpen: open,
        onClose: close,
        onPick: writeSuggestion,
    });

    const renderSuggestions = () => (
        <ListboxOptions
            cursor={cursor}
            isLive={getIsOpen}
            computeIsSelected={() => false}
            renderOption={(getOption, getFlags) => props.renderSuggestion?.(() => getOption().value, getFlags)}
        />
    );

    return (
        <>
            <TextField
                {...props}
                element={"input"}
                ref={(element) => {
                    setFieldRef(element);
                    props.ref?.(element);
                }}
                autoComplete={props.autoComplete ?? (getHasSuggestions() ? NO_AUTOCOMPLETE : undefined)}
                ariaAttributes={() =>
                    getHasSuggestions()
                        ? ListboxUtils.computeComboboxAttributes({
                              isOpen: getIsOpen(),
                              listboxId,
                              activeOptionId: cursor.getActiveOptionId(),
                              isEditable: true,
                          })
                        : {}
                }
                onKeyDown={(e) => cursor.handleKeyDown(e)}
                onInput={(value) => {
                    if (getHasSuggestions()) {
                        open();
                        cursor.highlight(undefined);
                    }

                    void props.onInput?.(value);
                }}
            />

            <Show when={getHasSuggestions()}>
                <Popover
                    id={() => listboxId}
                    role={"listbox"}
                    ariaAttributes={() => ({ "aria-label": access(props.suggestionsAriaLabel) })}
                    hasAnchorMinWidth={true}
                    isOpen={getIsOpen}
                    anchorRef={getFieldRef}
                    onDismiss={close}
                    renderContent={(getVisibilityTarget, getTransitionDurationMs, getPlacement) =>
                        props.renderSuggestionPopup?.(
                            renderSuggestions,
                            getVisibilityTarget,
                            getTransitionDurationMs,
                            getPlacement,
                        )
                    }
                />
            </Show>
        </>
    );
};
