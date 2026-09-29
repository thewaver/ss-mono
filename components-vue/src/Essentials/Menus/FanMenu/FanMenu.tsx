import { type SlotsType, computed, defineComponent, shallowRef } from "vue";

import { FanMenuUtils } from "@thewaver/ss-components";

import { declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import { exposeElement, toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { Menu } from "../Menu/Menu";
import type { MenuProps, MenuSlots } from "../Menu/Menu.types";
import type { FanMenuProps, FanMenuSlots } from "./FanMenu.types";

export const FanMenu = defineComponent(
    <T,>(props: FanMenuProps<T>, { slots, expose }: SlotsContext<FanMenuSlots<T>>) => {
        const isOpen = useTwoWay(props, "visibility", false);
        const checked = useTwoWay(props, "checked", undefined, { keepsOwnValue: false });

        const triggerElement = shallowRef<HTMLElement>();

        exposeElement(expose, () => triggerElement.value);

        const computeLayout = computed(() => FanMenuUtils.createLayout(props.layoutDefs));

        return () => {
            const menuProps: MenuProps<T> = {
                ...forwardProps(props, Menu),
                "visibility": isOpen.value,
                "onUpdate:visibility": (value: boolean) => {
                    isOpen.value = value;
                },
                "checked": checked.value,
                "onUpdate:checked": (value: T[]) => {
                    checked.value = value;
                },
                "submenuMode": "replace",
                "submenuOpensOn": "press",
                "computeLayout": computeLayout.value,
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
                            renderItem: slots.renderItem,
                            renderPopup: slots.renderPopup,
                        } satisfies Partial<MenuSlots<T>>
                    }
                </Menu>
            );
        };
    },
    {
        name: "FanMenu",
        slots: Object as SlotsType<FanMenuSlots<any>>,
        props: declareProps<FanMenuProps<unknown>>({
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
            "opensOnHold": Boolean,
            "triggerRole": null,
            "reservedScreenSize": null,
            "transitionDurationMs": null,
            "visibility": Boolean,
            "onUpdate:visibility": null,
            "anchorRef": null,
            "items": null,
            "checked": null,
            "onUpdate:checked": null,
            "computeEffect": null,
            "computeCustomText": null,
            "onActivate": null,
            "layoutDefs": null,
        }),
    },
);
