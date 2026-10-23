import { createEffect, createMemo, createSignal, createUniqueId } from "solid-js";

import {
    COMMAND_PALETTE_DEFAULTS,
    CommandPaletteUtils,
    ListboxUtils,
    SelectUtils,
    ShortcutUtils,
} from "@thewaver/ss-components";
import { SelectConst } from "@thewaver/ss-components/internal";

import { ShortcutSolidUtils } from "../../../Abstracts/Shortcut/ShortcutSolid.utils";
import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { TextField } from "../../../Primitives/TextField/TextField";
import { access, accessSignal } from "../../../Utils/propUtils";
import { ListboxOptions } from "../../Input/Listbox/Listbox";
import { ListboxSolidUtils } from "../../Input/Listbox/ListboxSolid.utils";
import { Modal } from "../../Overlays/Modal/Modal";
import type { CommandPaletteAction, CommandPaletteActionGroup, CommandPaletteProps } from "./CommandPaletteSolid.types";

const TAB_KEY = "Tab";

export const CommandPalette = <T,>(props: CommandPaletteProps<T>) => {
    const listboxId = createUniqueId();
    const fallbackFieldId = createUniqueId();

    const [getFieldRef, setFieldRef] = createSignal<HTMLElement>();
    const [getHasModalSettled, setHasModalSettled] = createSignal(true);

    const visibilitySignal = SignalMirrorSolidUtils.createOptional(() => props.visibility, false);
    const [getIsOpen, setIsOpen] = visibilitySignal;

    const querySignal = accessSignal(() => props.query);

    const getActions = createMemo(() => access(props.actions));

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const cursor = ListboxSolidUtils.createCursor<T>({
        focusModel: "active_descendant",
        getListboxId: () => listboxId,
        getOptions: getActions,
        getSelectedOptions: () => SelectConst.EMPTY_SELECTION,
        getIsDisabled: () => false,
        getIsOpen,
        getIsFilterable: () => true,
        getIsFiltering: () => true,
        getHasMoreOptions: () => access(props.hasMoreOptions) ?? false,
        onOpen: open,
        onClose: close,
        onPick: (value) => props.onActivate(value),
    });

    ShortcutSolidUtils.createBindings(() => {
        const shortcut = access(props.shortcut);
        const actionBindings = CommandPaletteUtils.getBoundActions(getActions()).map((action) => ({
            shortcut: action.shortcut,
            onTrigger: () => props.onActivate(action.value),
        }));

        return shortcut === undefined ? actionBindings : [{ shortcut, onTrigger: open }, ...actionBindings];
    });

    createEffect(() => {
        if (!SelectUtils.getIsQueryClearDue(getIsOpen(), getHasModalSettled(), querySignal[0]())) return;

        querySignal[1](SelectConst.EMPTY_QUERY);
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === TAB_KEY) return;

        cursor.handleKeyDown(e);
    };

    const renderField = () => (
        <TextField
            element={"input"}
            id={() => access(props.id) ?? fallbackFieldId}
            ref={setFieldRef}
            value={props.query}
            ariaLabel={props.fieldAriaLabel}
            padding={props.fieldPadding}
            gap={props.fieldGap}
            autoComplete={"off"}
            ariaAttributes={() =>
                ListboxUtils.computeComboboxAttributes({
                    isOpen: getIsOpen() && cursor.getFlatOptions().length > 0,
                    listboxId,
                    activeOptionId: cursor.getActiveOptionId(),
                    isEditable: true,
                })
            }
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
        <div
            id={listboxId}
            role="listbox"
            aria-label={access(props.listAriaLabel)}
            onMouseDown={(e) => e.preventDefault()}
        >
            <ListboxOptions
                cursor={cursor}
                isLive={getIsOpen}
                hasMoreOptions={props.hasMoreOptions}
                computeEstimatedOptionHeight={props.computeEstimatedOptionHeight}
                computeEstimatedGroupHeight={props.computeEstimatedGroupHeight}
                computeIsSelected={() => false}
                renderOption={(getOption, getFlags) => {
                    const getAction = () => getOption() as CommandPaletteAction<T>;

                    return props.renderOption(getAction, () => {
                        const shortcut = getAction().shortcut;

                        return {
                            ...getFlags(),
                            shortcut: shortcut === undefined ? undefined : ShortcutUtils.resolve(shortcut),
                        };
                    });
                }}
                renderGroupHeader={
                    props.renderGroupHeader === undefined
                        ? undefined
                        : (getGroup) => props.renderGroupHeader?.(() => getGroup() as CommandPaletteActionGroup<T>)
                }
                renderGroupBox={
                    props.renderGroupBox === undefined
                        ? undefined
                        : (renderContent, getGroup) =>
                              props.renderGroupBox?.(renderContent, () => getGroup() as CommandPaletteActionGroup<T>)
                }
                floaterTransitionDurationMs={() =>
                    access(props.floaterTransitionDurationMs) ?? COMMAND_PALETTE_DEFAULTS.floaterTransitionDurationMs
                }
                renderHighlightFloater={props.renderHighlightFloater}
                onReachEnd={props.onReachEnd}
            />
        </div>
    );

    return (
        <Modal
            visibility={visibilitySignal}
            ariaLabel={props.ariaLabel}
            alignment={props.alignment}
            margins={props.margins}
            isDismissableOnOverlayClick={props.isDismissableOnOverlayClick}
            transitionDurationMs={props.transitionDurationMs}
            initialFocusRef={getFieldRef}
            onTransitionStatusChange={setHasModalSettled}
            renderOverlay={props.renderOverlay}
            renderContent={(getVisibilityTarget, getTransitionDurationMs) =>
                props.renderPanel(renderField, renderOptions, getVisibilityTarget, getTransitionDurationMs)
            }
        />
    );
};
