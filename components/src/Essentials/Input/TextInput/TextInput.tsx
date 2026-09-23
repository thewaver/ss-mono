import { Show, createMemo, createSignal, createUniqueId } from "solid-js";

import { TypeaheadUtils } from "../../../Abstracts/Typeahead/Typeahead.utils";
import { Popover } from "../../../Primitives/Popover/Popover";
import { TextField } from "../../../Primitives/TextField/TextField";
import { access } from "../../../Utils/propUtils";
import { ListboxOptions } from "../Listbox/Listbox";
import { ListboxUtils } from "../Listbox/Listbox.utils";
import type { SelectOption } from "../Select/Select.types";
import type { TextInputProps } from "./TextInput.types";

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
        const text =
            props.computeCustomSuggestionText?.(suggestion) ??
            TypeaheadUtils.getElementText(document.getElementById(cursor.getOptionId(index))).trim();

        props.valueSignal[1](text);

        void props.onInput?.(text);
        void props.onSuggestionPick?.(suggestion);
    };

    const cursor = ListboxUtils.createCursor<T>({
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
                        ? {
                              "role": "combobox",
                              "aria-haspopup": "listbox",
                              "aria-autocomplete": "list",
                              "aria-expanded": getIsOpen(),
                              "aria-controls": getIsOpen() ? listboxId : undefined,
                              "aria-activedescendant": cursor.getActiveOptionId(),
                          }
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
