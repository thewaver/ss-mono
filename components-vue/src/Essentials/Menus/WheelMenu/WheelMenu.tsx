import { type SlotsType, computed, defineComponent, shallowRef } from "vue";

import { type PlacementLayoutDefs, WheelMenuUtils } from "@thewaver/ss-components";

import { callSlot, declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import { exposeElement, toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { Menu } from "../Menu/Menu";
import type { MenuItem, MenuProps, MenuRenderItem, MenuSlots } from "../Menu/Menu.types";
import type { WheelMenuProps, WheelMenuSlots } from "./WheelMenu.types";

type WheelValue<T> = T | typeof WheelMenuUtils.CLOSER_VALUE;

export const WheelMenu = defineComponent(
    <T,>(props: WheelMenuProps<T>, { slots, expose }: SlotsContext<WheelMenuSlots<T>>) => {
        const isOpen = useTwoWay(props, "visibility", false);
        const checked = useTwoWay(props, "checked", undefined, { keepsOwnValue: false });

        const triggerElement = shallowRef<HTMLElement>();

        exposeElement(expose, () => triggerElement.value);

        const computeLayout = computed(() => {
            const defs = {
                items: props.items,
                spreadDegrees: props.spreadDegrees,
                holeRadius: props.holeRadius,
                bandWidth: props.bandWidth,
                levelGap: props.levelGap,
                layoutDefs: props.layoutDefs,
                hasCloser: props.closerDefs !== undefined,
            };

            return (layoutDefs: PlacementLayoutDefs) => WheelMenuUtils.computeLayout(layoutDefs, defs);
        });

        const menuItems = computed(
            () => WheelMenuUtils.withCloser(props.items, props.closerDefs?.ariaLabel) as MenuItem<WheelValue<T>>[],
        );

        const renderItem: MenuRenderItem<WheelValue<T>> = ({ item, flags, placement }) =>
            WheelMenuUtils.getIsCloser(item.value)
                ? props.closerDefs!.renderContent(flags)
                : callSlot(slots.renderItem, { item: item as MenuItem<T>, flags, placement });

        const computeCustomText = (item: MenuItem<WheelValue<T>>) =>
            WheelMenuUtils.getIsCloser(item.value) ? "" : (props.computeCustomText?.(item as MenuItem<T>) ?? "");

        return () => {
            const menuProps: MenuProps<WheelValue<T>> = {
                ...forwardProps(props, Menu),
                "visibility": isOpen.value,
                "onUpdate:visibility": (value: boolean) => {
                    isOpen.value = value;
                },
                "items": menuItems.value,
                "checked": checked.value,
                "onUpdate:checked": (value: WheelValue<T>[]) => {
                    checked.value = value as T[];
                },
                "computeLayout": computeLayout.value,
                "computeCustomText":
                    props.computeCustomText || props.closerDefs !== undefined ? computeCustomText : undefined,
                "onActivate": (value: WheelValue<T>) => {
                    if (WheelMenuUtils.getIsCloser(value)) return;

                    props.onActivate(value);
                },
            };

            return (
                <Menu
                    {...menuProps}
                    ref={(target) => {
                        triggerElement.value = toElement(target);
                    }}
                >
                    {
                        {
                            renderContent: slots.renderContent,
                            renderDecoration: slots.renderDecoration,
                            renderItem,
                            renderPopup: slots.renderPopup,
                        } satisfies Partial<MenuSlots<WheelValue<T>>>
                    }
                </Menu>
            );
        };
    },
    {
        name: "WheelMenu",
        slots: Object as SlotsType<WheelMenuSlots<any>>,
        props: declareProps<WheelMenuProps<unknown>>({
            "isDisabled": Boolean,
            "isPressed": Boolean,
            "hasError": Boolean,
            "role": null,
            "sizing": null,
            "minWidth": null,
            "minHeight": null,
            "isReachableWhenDisabled": Boolean,
            "isFocusableWhenDisabled": Boolean,
            "isTabbable": Boolean,
            "onActivation": null,
            "tooltipDefs": null,
            "layoutSize": null,
            "id": null,
            "ariaLabel": null,
            "placement": null,
            "offset": null,
            "submenuPlacement": null,
            "submenuOffset": null,
            "submenuMode": null,
            "submenuOpensOn": null,
            "opensOnHold": Boolean,
            "triggerRole": null,
            "reservedScreenSize": null,
            "transitionDurationMs": null,
            "visibility": Boolean,
            "onUpdate:visibility": null,
            "anchorRef": null,
            "computeEffect": null,
            "computeCustomText": null,
            "onActivate": null,
            "spreadDegrees": null,
            "holeRadius": null,
            "bandWidth": null,
            "levelGap": null,
            "items": null,
            "checked": null,
            "onUpdate:checked": null,
            "layoutDefs": null,
            "closerDefs": null,
        }),
    },
);
