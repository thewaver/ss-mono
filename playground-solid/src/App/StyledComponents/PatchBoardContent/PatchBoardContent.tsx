import { Show } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import { computePatchCablePath } from "@thewaver/ss-playground/App/StyledComponents/PatchBoardContent/PatchBoardContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/PatchBoardContent/PatchBoardContent.css";

import { PageBeam } from "../Beam/Beam";
import { useLayerClass } from "../Layer/Layer.context";
import type { PagePatchCableProps, PagePatchNodeProps, PagePatchSocketProps } from "./PatchBoardContent.types";

export const PagePatchNode = (props: PagePatchNodeProps) => {
    const getLayerClass = useLayerClass();

    const getFlags = () => access(props.flags);

    return (
        <div
            class={styles.patchNode}
            classList={{
                [getLayerClass()]: true,
                [styles.isCarried]: getFlags().isCarried,
                [styles.isHovered]: getFlags().isHovered,
                [styles.isFocusVisible]: getFlags().isFocusVisible,
                [styles.isDisabled]: getFlags().isDisabled,
            }}
        >
            <span class={styles.patchNodeName}>{access(props.label)}</span>
            <span class={styles.patchNodeKind}>{access(props.kind)}</span>
        </div>
    );
};

export const PagePatchSocket = (props: PagePatchSocketProps) => {
    const getLayerClass = useLayerClass();

    const getFlags = () => access(props.flags);

    const getIsRefused = () => getFlags().isAimed && !getFlags().isAllowed;

    return (
        <div
            class={styles.patchSocket}
            classList={{
                [getLayerClass()]: true,
                [styles.isIn]: getFlags().kind === "in",
                [styles.isTaken]: getFlags().isTaken,
                [styles.isSource]: getFlags().isSource,
                [styles.isAimed]: getFlags().isAimed,
                [styles.isRefused]: getIsRefused(),
                [styles.isHovered]: getFlags().isHovered,
                [styles.isFocusVisible]: getFlags().isFocusVisible,
                [styles.isDisabled]: getFlags().isDisabled,
            }}
        />
    );
};

export const PagePatchCable = (props: PagePatchCableProps) => {
    const getLayerClass = useLayerClass();

    const getDefs = () => access(props.defs);

    const getPath = () => computePatchCablePath(getDefs());

    return (
        <>
            <path
                class={styles.patchCable}
                classList={{
                    [getLayerClass()]: true,
                    [styles.isPending]: getDefs().isPending,
                    [styles.isRefused]: !getDefs().isAllowed,
                }}
                d={getPath()}
            />

            <Show when={!getDefs().isPending}>
                <PageBeam
                    d={getPath}
                    direction={() => (getDefs().fromKind === "out" ? "forward" : "backward")}
                    isPlaying={props.isBeamPlaying}
                />
            </Show>
        </>
    );
};
