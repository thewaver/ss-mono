import { useCallback, useId, useMemo, useState } from "react";

import { ListboxUtils } from "@thewaver/ss-components";

import { Popover } from "../../../Primitives/Popover/Popover";
import { TextField } from "../../../Primitives/TextField/TextField";
import { useLatest } from "../../../Utils/refUtils";
import { ListboxOptions } from "../Listbox/Listbox";
import { ListboxReactUtils } from "../Listbox/ListboxReact.utils";
import type { SelectOption } from "../Select/Select.types";
import type { TextInputProps } from "./TextInput.types";

const EMPTY_SELECTION: never[] = [];
const NO_AUTOCOMPLETE = "off";

export const TextInput = <T = string,>(props: TextInputProps<T>) => {
    const listboxId = useId();

    const latestRef = useLatest(props.ref);
    const [fieldElement, setFieldElement] = useState<HTMLElement>();
    const [isWanted, setIsWanted] = useState(false);

    const hasSuggestions = props.suggestions !== undefined;
    const isRefused = !hasSuggestions || (props.isDisabled ?? false) || (props.isReadOnly ?? false);

    const options = useMemo(
        (): SelectOption<T>[] =>
            props.suggestions === undefined ? EMPTY_SELECTION : props.suggestions.map((value) => ({ value })),
        [props.suggestions],
    );

    const isOpen = isWanted && !isRefused && options.length > 0;

    const open = () => {
        if (isRefused) return;

        setIsWanted(true);
    };

    const close = () => {
        setIsWanted(false);
    };

    const cursor = ListboxReactUtils.useCursor<T>({
        focusModel: "activeDescendant",
        isHighlightExplicit: true,
        listboxId,
        options,
        selectedOptions: EMPTY_SELECTION,
        isDisabled: isRefused,
        isOpen,
        isFilterable: true,
        isFiltering: true,
        onOpen: open,
        onClose: close,
        onPick: (suggestion) => writeSuggestion(suggestion),
    });

    const writeSuggestion = (suggestion: T) => {
        const index = cursor.flatOptions.findIndex((option) => option.value === suggestion);
        const text = ListboxUtils.computePickedText(listboxId, index, props.computeCustomSuggestionText?.(suggestion));

        props.value[1](text);

        props.onInput?.(text);
        props.onSuggestionPick?.(suggestion);
    };

    const setFieldRef = useCallback(
        (element: HTMLElement | null) => {
            setFieldElement(element ?? undefined);
            latestRef.current?.(element);
        },
        [latestRef],
    );

    const renderSuggestions = () => (
        <ListboxOptions
            cursor={cursor}
            isLive={isOpen}
            computeIsSelected={() => false}
            renderOption={(option, flags) => props.renderSuggestion?.(option.value, flags)}
        />
    );

    return (
        <>
            <TextField
                {...props}
                element={"input"}
                ref={setFieldRef}
                autoComplete={props.autoComplete ?? (hasSuggestions ? NO_AUTOCOMPLETE : undefined)}
                ariaAttributes={
                    hasSuggestions
                        ? ListboxUtils.computeComboboxAttributes({
                              isOpen,
                              listboxId,
                              activeOptionId: cursor.activeOptionId,
                              isEditable: true,
                          })
                        : undefined
                }
                onKeyDown={(e) => cursor.handleKeyDown(e.nativeEvent)}
                onInput={(value) => {
                    if (hasSuggestions) {
                        open();
                        cursor.highlight(undefined);
                    }

                    props.onInput?.(value);
                }}
            />

            {hasSuggestions && (
                <Popover
                    id={listboxId}
                    role={"listbox"}
                    ariaAttributes={{ "aria-label": props.suggestionsAriaLabel }}
                    hasAnchorMinWidth={true}
                    isOpen={isOpen}
                    anchorRef={fieldElement}
                    onDismiss={close}
                    renderContent={(visibilityTarget, transitionDurationMs, placement) =>
                        props.renderSuggestionPopup?.(
                            renderSuggestions,
                            visibilityTarget,
                            transitionDurationMs,
                            placement,
                        )
                    }
                />
            )}
        </>
    );
};
