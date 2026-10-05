import { computePatchCablePath } from "@thewaver/ss-playground/App/StyledComponents/PatchBoardContent/PatchBoardContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/PatchBoardContent/PatchBoardContent.css";

import { PageBeam } from "../Beam/Beam";
import { useLayerClass } from "../Layer/Layer.context";
import type { PagePatchCableProps, PagePatchNodeProps, PagePatchSocketProps } from "./PatchBoardContent.types";

export const PagePatchNode = (props: PagePatchNodeProps) => {
    const layerClass = useLayerClass();

    const flags = props.flags;

    return (
        <div
            className={[
                styles.patchNode,
                layerClass,
                flags.isCarried && styles.isCarried,
                flags.isHovered && styles.isHovered,
                flags.isFocusVisible && styles.isFocusVisible,
                flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <span className={styles.patchNodeName}>{props.label}</span>
            <span className={styles.patchNodeKind}>{props.kind}</span>
        </div>
    );
};

export const PagePatchSocket = (props: PagePatchSocketProps) => {
    const layerClass = useLayerClass();

    const flags = props.flags;

    const isRefused = flags.isAimed && !flags.isAllowed;

    return (
        <div
            className={[
                styles.patchSocket,
                layerClass,
                flags.kind === "in" && styles.isIn,
                flags.isTaken && styles.isTaken,
                flags.isSource && styles.isSource,
                flags.isAimed && styles.isAimed,
                isRefused && styles.isRefused,
                flags.isHovered && styles.isHovered,
                flags.isFocusVisible && styles.isFocusVisible,
                flags.isDisabled && styles.isDisabled,
            ]
                .filter(Boolean)
                .join(" ")}
        />
    );
};

export const PagePatchCable = (props: PagePatchCableProps) => {
    const layerClass = useLayerClass();

    const path = computePatchCablePath(props.defs);

    return (
        <>
            <path
                className={[
                    styles.patchCable,
                    layerClass,
                    props.defs.isPending && styles.isPending,
                    !props.defs.isAllowed && styles.isRefused,
                ]
                    .filter(Boolean)
                    .join(" ")}
                d={path}
            />

            {!props.defs.isPending && (
                <PageBeam
                    d={path}
                    direction={props.defs.fromKind === "out" ? "forward" : "backward"}
                    isPlaying={props.isBeamPlaying}
                />
            )}
        </>
    );
};
