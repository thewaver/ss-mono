import { type KeyboardEvent, useEffect, useId, useState } from "react";

import {
    COMMAND_PALETTE_DEFAULTS,
    CommandPaletteUtils,
    ListboxUtils,
    SelectUtils,
    ShortcutUtils,
    type TextSyncElement,
} from "@thewaver/ss-components";
import { SelectConst } from "@thewaver/ss-components/internal";

import { ShortcutReactUtils } from "../../../Abstracts/Shortcut/ShortcutReact.utils";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { TextField } from "../../../Primitives/TextField/TextField";
import { useLatest } from "../../../Utils/refUtils";
import { ListboxOptions } from "../../Input/Listbox/Listbox";
import { ListboxReactUtils } from "../../Input/Listbox/ListboxReact.utils";
import { Modal } from "../../Overlays/Modal/Modal";
import type { CommandPaletteAction, CommandPaletteActionGroup, CommandPaletteProps } from "./CommandPalette.types";

const TAB_KEY = "Tab";

export const CommandPalette = <T,>(props: CommandPaletteProps<T>) => {
    const listboxId = useId();
    const fallbackFieldId = useId();

    const [fieldElement, setFieldElement] = useState<HTMLElement | null>(null);
    const [hasModalSettled, setHasModalSettled] = useState(true);

    const visibility = SignalMirrorReactUtils.useOptionalState(props.visibility, false);
    const [isOpen, setIsOpen] = visibility;
    const [wasOpen, setWasOpen] = useState(isOpen);

    const query = props.query[0];

    if (wasOpen !== isOpen) {
        setWasOpen(isOpen);

        if (!isOpen) setHasModalSettled(false);
    }

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const cursor = ListboxReactUtils.useCursor<T>({
        focusModel: "active_descendant",
        listboxId,
        options: props.actions,
        selectedOptions: SelectConst.EMPTY_SELECTION,
        isDisabled: false,
        isOpen,
        isFilterable: true,
        isFiltering: true,
        hasMoreOptions: props.hasMoreOptions ?? false,
        onOpen: open,
        onClose: close,
        onPick: (value) => props.onActivate(value),
    });

    const actionBindings = CommandPaletteUtils.getBoundActions(props.actions).map((action) => ({
        shortcut: action.shortcut,
        onTrigger: () => props.onActivate(action.value),
    }));

    ShortcutReactUtils.useBindings(
        props.shortcut === undefined
            ? actionBindings
            : [{ shortcut: props.shortcut, onTrigger: open }, ...actionBindings],
    );

    const latestQueryState = useLatest(props.query);

    useEffect(() => {
        if (!SelectUtils.getIsQueryClearDue(isOpen, hasModalSettled, query)) return;

        latestQueryState.current[1](SelectConst.EMPTY_QUERY);
    }, [isOpen, hasModalSettled, query, latestQueryState]);

    const handleKeyDown = (e: KeyboardEvent<TextSyncElement>) => {
        if (e.key === TAB_KEY) return;

        cursor.handleKeyDown(e.nativeEvent);
    };

    const renderField = () => (
        <TextField
            element={"input"}
            id={props.id ?? fallbackFieldId}
            ref={setFieldElement}
            value={props.query}
            ariaLabel={props.fieldAriaLabel}
            padding={props.fieldPadding}
            gap={props.fieldGap}
            autoComplete={"off"}
            ariaAttributes={ListboxUtils.computeComboboxAttributes({
                isOpen: isOpen && cursor.flatOptions.length > 0,
                listboxId,
                activeOptionId: cursor.activeOptionId,
                isEditable: true,
            })}
            computeTextStyle={props.computeFieldTextStyle}
            renderContent={props.renderFieldContent}
            renderPlaceholder={props.renderFieldPlaceholder}
            renderLeading={props.renderFieldLeading}
            renderTrailing={props.renderFieldTrailing}
            onKeyDown={handleKeyDown}
            onInput={() => cursor.highlight(undefined)}
        />
    );

    const renderOptions = () => (
        <div id={listboxId} role="listbox" aria-label={props.listAriaLabel} onMouseDown={(e) => e.preventDefault()}>
            <ListboxOptions
                cursor={cursor}
                isLive={isOpen}
                hasMoreOptions={props.hasMoreOptions}
                computeEstimatedOptionHeight={props.computeEstimatedOptionHeight}
                computeEstimatedGroupHeight={props.computeEstimatedGroupHeight}
                computeIsSelected={() => false}
                renderOption={(option, flags) => {
                    const action = option as CommandPaletteAction<T>;

                    return props.renderOption(action, {
                        ...flags,
                        shortcut: action.shortcut === undefined ? undefined : ShortcutUtils.resolve(action.shortcut),
                    });
                }}
                renderGroupHeader={
                    props.renderGroupHeader === undefined
                        ? undefined
                        : (group) => props.renderGroupHeader?.(group as CommandPaletteActionGroup<T>)
                }
                renderGroupBox={
                    props.renderGroupBox === undefined
                        ? undefined
                        : (renderContent, group) =>
                              props.renderGroupBox?.(renderContent, group as CommandPaletteActionGroup<T>)
                }
                floaterTransitionDurationMs={
                    props.floaterTransitionDurationMs ?? COMMAND_PALETTE_DEFAULTS.floaterTransitionDurationMs
                }
                renderHighlightFloater={props.renderHighlightFloater}
                onReachEnd={props.onReachEnd}
            />
        </div>
    );

    return (
        <Modal
            visibility={visibility}
            ariaLabel={props.ariaLabel}
            alignment={props.alignment}
            margins={props.margins}
            isDismissableOnOverlayClick={props.isDismissableOnOverlayClick}
            transitionDurationMs={props.transitionDurationMs}
            initialFocusRef={fieldElement ?? undefined}
            onTransitionStatusChange={setHasModalSettled}
            renderOverlay={props.renderOverlay}
            renderContent={(visibilityTarget, transitionDurationMs) =>
                props.renderPanel(renderField, renderOptions, visibilityTarget, transitionDurationMs)
            }
        />
    );
};
