import { type SlotsType, defineComponent } from "vue";

import { declareProps, forwardProps, useTwoWay } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import { Modal } from "../Modal/Modal";
import type { ModalSlots } from "../Modal/Modal.types";
import type { DrawerProps, DrawerSlots } from "./Drawer.types";

export const Drawer = defineComponent(
    (props: DrawerProps, { slots }: SlotsContext<DrawerSlots>) => {
        const visibility = useTwoWay(props, "visibility", false);

        return () => (
            <Modal
                {...{
                    ...forwardProps(props, Modal),
                    "visibility": visibility.value,
                    "onUpdate:visibility": (isVisible: boolean) => {
                        visibility.value = isVisible;
                    },
                }}
                alignment={props.edge}
            >
                {
                    {
                        renderOverlay: slots.renderOverlay,
                        renderContent: slots.renderContent,
                    } satisfies Partial<ModalSlots>
                }
            </Modal>
        );
    },
    {
        name: "Drawer",
        inheritAttrs: false,
        slots: Object as SlotsType<DrawerSlots>,
        props: declareProps<DrawerProps>({
            "ariaLabel": null,
            "ariaLabelledBy": null,
            "ariaDescribedBy": null,
            "isDismissableOnOverlayClick": Boolean,
            "isDismissableOnEscape": Boolean,
            "visibility": Boolean,
            "onUpdate:visibility": null,
            "transitionDurationMs": null,
            "margins": null,
            "initialFocusRef": null,
            "onShow": null,
            "onHide": null,
            "onTransitionStatusChange": null,
            "edge": null,
        }),
    },
);
