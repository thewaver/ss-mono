import { type SlotsType, defineComponent } from "vue";

import { declareProps, useTwoWay } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import { ToolbarComposite } from "../Toolbar/Toolbar";
import type { MenubarProps, MenubarSlots } from "./Menubar.types";

export const Menubar = defineComponent(
    <T,>(props: MenubarProps<T>, { slots }: SlotsContext<MenubarSlots<T>>) => {
        const checked = useTwoWay(props, "checked", undefined, { keepsOwnValue: false });

        return () => (
            <ToolbarComposite
                gap={props.gap}
                ariaLabel={props.ariaLabel}
                overflowAriaLabel={props.overflowAriaLabel}
                computeLayout={props.computeLayout}
                computeEffect={props.computeEffect}
                onActivate={props.onActivate}
                role={"menubar"}
                actions={props.actions}
                checked={checked.value}
                onUpdate:checked={(values: T[]) => {
                    checked.value = values;
                }}
                submenuOffset={props.submenuOffset}
            >
                {
                    {
                        renderOverflowTrigger: slots.renderOverflowTrigger,
                        renderAction: slots.renderAction,
                        renderItem: slots.renderItem,
                        renderPopup: slots.renderPopup,
                    } satisfies Partial<MenubarSlots<T>>
                }
            </ToolbarComposite>
        );
    },
    {
        name: "Menubar",
        slots: Object as SlotsType<MenubarSlots<any>>,
        props: declareProps<MenubarProps<unknown>>({
            "gap": null,
            "ariaLabel": null,
            "overflowAriaLabel": null,
            "computeLayout": null,
            "computeEffect": null,
            "onActivate": null,
            "actions": null,
            "checked": null,
            "onUpdate:checked": null,
            "submenuOffset": null,
        }),
    },
);
