import { Modal } from "../Modal/Modal";
import type { DrawerProps } from "./DrawerSolid.types";

export const Drawer = (props: DrawerProps) => {
    return <Modal {...props} alignment={props.edge} />;
};
