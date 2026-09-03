import { access } from "@thewaver/ss-components";

import type { PagePatchCableProps, PagePatchNodeProps, PagePatchSocketProps } from "./PatchBoardContent.types";

import * as styles from "./PatchBoardContent.css";

const MIN_BOW = 40;
const BOW_RATIO = 0.55;

export const PagePatchNode = (props: PagePatchNodeProps) => {
    const getFlags = () => access(props.flags);

    return (
        <div
            class={styles.patchNode}
            classList={{
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
    const getFlags = () => access(props.flags);

    const getIsRefused = () => getFlags().isAimed && !getFlags().isAllowed;

    return (
        <div
            class={styles.patchSocket}
            classList={{
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
    const getDefs = () => access(props.defs);

    const getPath = () => {
        const defs = getDefs();
        const isVertical = defs.orientation === "vertical";
        const span = isVertical ? defs.to.y - defs.from.y : defs.to.x - defs.from.x;
        const bow = Math.max(MIN_BOW, Math.abs(span) * BOW_RATIO);
        const lead = defs.fromKind === "out" ? bow : -bow;
        const first = isVertical ? `${defs.from.x} ${defs.from.y + lead}` : `${defs.from.x + lead} ${defs.from.y}`;
        const second = isVertical ? `${defs.to.x} ${defs.to.y - lead}` : `${defs.to.x - lead} ${defs.to.y}`;

        return `M ${defs.from.x} ${defs.from.y} C ${first}, ${second}, ${defs.to.x} ${defs.to.y}`;
    };

    return (
        <path
            class={styles.patchCable}
            classList={{
                [styles.isPending]: getDefs().isPending,
                [styles.isRefused]: !getDefs().isAllowed,
            }}
            d={getPath()}
        />
    );
};
