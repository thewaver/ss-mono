import { type SlotsType, defineComponent, shallowRef, useId, watch } from "vue";

import {
    COMMAND_PALETTE_DEFAULTS,
    CommandPaletteUtils,
    ListboxUtils,
    SelectUtils,
    type ShortcutBinding,
    ShortcutUtils,
} from "@thewaver/ss-components";
import { SelectConst } from "@thewaver/ss-components/internal";

import { ShortcutVueUtils } from "../../../Abstracts/Shortcut/ShortcutVue.utils";
import { TextField } from "../../../Primitives/TextField/TextField";
import type { TextFieldSlots } from "../../../Primitives/TextField/TextField.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../../Utils/propUtils";
import { toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { ListboxOptions } from "../../Input/Listbox/Listbox";
import type { ListboxOptionsSlots } from "../../Input/Listbox/Listbox.types";
import { ListboxVueUtils } from "../../Input/Listbox/ListboxVue.utils";
import { Modal } from "../../Overlays/Modal/Modal";
import type { ModalSlots } from "../../Overlays/Modal/Modal.types";
import type {
    CommandPaletteAction,
    CommandPaletteActionGroup,
    CommandPaletteProps,
    CommandPaletteSlots,
} from "./CommandPalette.types";

const TAB_KEY = "Tab";

export const CommandPalette = defineComponent(
    <T,>(props: CommandPaletteProps<T>, { slots }: SlotsContext<CommandPaletteSlots<T>>) => {
        const listboxId = useId();
        const fallbackFieldId = useId();

        const fieldRef = shallowRef<HTMLElement>();
        const hasModalSettled = shallowRef(true);

        const isOpen = useTwoWay(props, "visibility", false);
        const query = useTwoWay(props, "query", SelectConst.EMPTY_QUERY, { keepsOwnValue: false });

        const open = () => {
            isOpen.value = true;
        };

        const close = () => {
            isOpen.value = false;
        };

        watch(isOpen, (isShown) => {
            if (!isShown) hasModalSettled.value = false;
        });

        const cursor = ListboxVueUtils.useCursor<T>({
            focusModel: "active_descendant",
            listboxId,
            options: () => props.actions,
            selectedOptions: SelectConst.EMPTY_SELECTION,
            isDisabled: false,
            isOpen,
            isFilterable: true,
            isFiltering: true,
            hasMoreOptions: () => props.hasMoreOptions ?? false,
            onOpen: open,
            onClose: close,
            onPick: (value) => props.onActivate(value),
        });

        ShortcutVueUtils.useBindings((): ShortcutBinding[] => {
            const shortcut = props.shortcut;
            const actionBindings = CommandPaletteUtils.getBoundActions(props.actions).map((action) => ({
                shortcut: action.shortcut,
                onTrigger: () => props.onActivate(action.value),
            }));

            return shortcut === undefined ? actionBindings : [{ shortcut, onTrigger: open }, ...actionBindings];
        });

        watchAfterRender([isOpen, hasModalSettled, query], ([isShown, hasSettled, current]) => {
            if (!SelectUtils.getIsQueryClearDue(isShown, hasSettled, current)) return;

            query.value = SelectConst.EMPTY_QUERY;
        });

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === TAB_KEY) return;

            cursor.handleKeyDown(e);
        };

        const renderField = () => (
            <TextField
                {...{
                    "value": query.value,
                    "onUpdate:value": (next: string) => {
                        query.value = next;
                    },
                }}
                ref={(target) => {
                    fieldRef.value = toElement(target);
                }}
                element={"input"}
                id={props.id ?? fallbackFieldId}
                ariaLabel={props.fieldAriaLabel}
                padding={props.fieldPadding}
                gap={props.fieldGap}
                autoComplete={"off"}
                ariaAttributes={ListboxUtils.computeComboboxAttributes({
                    isOpen: isOpen.value && cursor.flatOptions.value.length > 0,
                    listboxId,
                    activeOptionId: cursor.activeOptionId.value,
                    isEditable: true,
                })}
                computeTextStyle={props.computeFieldTextStyle}
                onKeyDown={handleKeyDown}
                onInput={() => cursor.highlight(undefined)}
            >
                {
                    {
                        renderContent: slots.renderFieldContent,
                        renderPlaceholder: slots.renderFieldPlaceholder,
                        renderLeading: slots.renderFieldLeading,
                        renderTrailing: slots.renderFieldTrailing,
                    } satisfies Partial<TextFieldSlots>
                }
            </TextField>
        );

        const renderOptions = () => (
            <div id={listboxId} role="listbox" aria-label={props.listAriaLabel} onMousedown={(e) => e.preventDefault()}>
                <ListboxOptions
                    cursor={cursor}
                    isLive={isOpen.value}
                    hasMoreOptions={props.hasMoreOptions}
                    computeEstimatedOptionHeight={props.computeEstimatedOptionHeight}
                    computeEstimatedGroupHeight={props.computeEstimatedGroupHeight}
                    computeIsSelected={() => false}
                    floaterTransitionDurationMs={
                        props.floaterTransitionDurationMs ?? COMMAND_PALETTE_DEFAULTS.floaterTransitionDurationMs
                    }
                    onReachEnd={props.onReachEnd}
                >
                    {
                        {
                            renderOption: ({ option, flags }) => {
                                const action = option as CommandPaletteAction<T>;

                                return callSlot(slots.renderOption, {
                                    action,
                                    renderProps: {
                                        ...flags,
                                        shortcut:
                                            action.shortcut === undefined
                                                ? undefined
                                                : ShortcutUtils.resolve(action.shortcut),
                                    },
                                });
                            },
                            renderGroupHeader:
                                slots.renderGroupHeader === undefined
                                    ? undefined
                                    : ({ group }) =>
                                          callSlot(slots.renderGroupHeader, {
                                              group: group as CommandPaletteActionGroup<T>,
                                          }),
                            renderGroupBox:
                                slots.renderGroupBox === undefined
                                    ? undefined
                                    : ({ renderContent, group }) =>
                                          callSlot(slots.renderGroupBox, {
                                              renderContent,
                                              group: group as CommandPaletteActionGroup<T>,
                                          }),
                            renderHighlightFloater: slots.renderHighlightFloater,
                        } satisfies Partial<ListboxOptionsSlots<T>>
                    }
                </ListboxOptions>
            </div>
        );

        return () => (
            <Modal
                {...{
                    "visibility": isOpen.value,
                    "onUpdate:visibility": (isVisible: boolean) => {
                        isOpen.value = isVisible;
                    },
                }}
                ariaLabel={props.ariaLabel}
                alignment={props.alignment}
                margins={props.margins}
                isDismissableOnOverlayClick={props.isDismissableOnOverlayClick}
                transitionDurationMs={props.transitionDurationMs}
                initialFocusRef={fieldRef.value}
                onTransitionStatusChange={(hasTransitionFinished) => {
                    hasModalSettled.value = hasTransitionFinished;
                }}
            >
                {
                    {
                        renderOverlay: slots.renderOverlay,
                        renderContent: ({ visibilityTarget, transitionDurationMs }) =>
                            callSlot(slots.renderPanel, {
                                renderField,
                                renderOptions,
                                visibilityTarget,
                                transitionDurationMs,
                            }),
                    } satisfies Partial<ModalSlots>
                }
            </Modal>
        );
    },
    {
        name: "CommandPalette",
        slots: Object as SlotsType<CommandPaletteSlots<any>>,
        props: declareProps<CommandPaletteProps<unknown>>({
            "id": null,
            "ariaLabel": null,
            "fieldAriaLabel": null,
            "listAriaLabel": null,
            "shortcut": null,
            "alignment": null,
            "margins": null,
            "isDismissableOnOverlayClick": Boolean,
            "transitionDurationMs": null,
            "fieldPadding": null,
            "fieldGap": null,
            "hasMoreOptions": Boolean,
            "floaterTransitionDurationMs": null,
            "onActivate": null,
            "onReachEnd": null,
            "computeEstimatedOptionHeight": null,
            "computeEstimatedGroupHeight": null,
            "visibility": Boolean,
            "onUpdate:visibility": null,
            "query": null,
            "onUpdate:query": null,
            "computeFieldTextStyle": null,
            "actions": null,
        }),
    },
);
