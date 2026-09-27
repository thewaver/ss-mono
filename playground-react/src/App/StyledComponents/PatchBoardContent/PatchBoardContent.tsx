import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/PatchBoardContent/PatchBoardContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PagePatchCableProps, PagePatchNodeProps, PagePatchSocketProps } from "./PatchBoardContent.types";

const MIN_BOW = 0.09;
const BOW_RATIO = 0.55;

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

const computeCablePath = (defs: PagePatchCableProps["defs"]) => {
    const isVertical = defs.orientation === "vertical";
    const span = isVertical ? defs.to.y - defs.from.y : defs.to.x - defs.from.x;
    const bow = Math.max(MIN_BOW, Math.abs(span) * BOW_RATIO);
    const lead = defs.fromKind === "out" ? bow : -bow;
    const first = isVertical ? `${defs.from.x} ${defs.from.y + lead}` : `${defs.from.x + lead} ${defs.from.y}`;
    const second = isVertical ? `${defs.to.x} ${defs.to.y - lead}` : `${defs.to.x - lead} ${defs.to.y}`;

    return `M ${defs.from.x} ${defs.from.y} C ${first}, ${second}, ${defs.to.x} ${defs.to.y}`;
};

export const PagePatchCable = (props: PagePatchCableProps) => {
    const layerClass = useLayerClass();

    return (
        <path
            className={[
                styles.patchCable,
                layerClass,
                props.defs.isPending && styles.isPending,
                !props.defs.isAllowed && styles.isRefused,
            ]
                .filter(Boolean)
                .join(" ")}
            d={computeCablePath(props.defs)}
        />
    );
};
