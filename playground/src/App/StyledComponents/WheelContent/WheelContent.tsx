import { type ParentProps, Show, createUniqueId } from "solid-js";

import { PlacementUtils, access } from "@thewaver/ss-components";

import type {
    PageWheelCardProps,
    PageWheelPipProps,
    PageWheelPipSide,
    PageWheelSpinProps,
    PageWheelWedgeProps,
} from "./WheelContent.types";

import * as styles from "./WheelContent.css";

const LABEL_TYPE_RATIO = 0.14;
const PIP_PATH = "M 2 2 H 18 L 10 18 Z";

const PIP_SIDE_STYLES: Record<PageWheelPipSide, string> = {
    top: styles.wheelPipTop,
    left: styles.wheelPipLeft,
};

const toContainerWidth = (ratio: number) => `${ratio * 100}cqw`;

export const PageWheelWedge = (props: ParentProps<PageWheelWedgeProps>) => {
    const gradientId = createUniqueId();

    return (
        <Show when={access(props.state).placement}>
            {(getRect) => (
                <div class={styles.wheelWedge} classList={{ [styles.isSelected]: access(props.state).isSelected }}>
                    <svg class={styles.wheelWedgeSVG} viewBox={"0 0 1 1"}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                                <stop class={styles.wheelWedgeGradientFrom} offset="0%" />
                                <stop class={styles.wheelWedgeGradientTo} offset="100%" />
                            </linearGradient>
                        </defs>

                        <path
                            class={styles.wheelWedgeShape}
                            style={{ fill: access(props.state).isSelected ? `url(#${gradientId})` : undefined }}
                            d={PlacementUtils.getSectorPath(getRect().sector!)}
                        />
                    </svg>

                    <div
                        class={styles.wheelWedgeLabel}
                        style={{
                            "left": toContainerWidth(getRect().left),
                            "top": toContainerWidth(getRect().top),
                            "width": toContainerWidth(getRect().width),
                            "height": toContainerWidth(getRect().height),
                            "font-size": toContainerWidth(getRect().width * LABEL_TYPE_RATIO),
                        }}
                    >
                        {props.children}
                    </div>
                </div>
            )}
        </Show>
    );
};

export const PageWheelCard = (props: ParentProps<PageWheelCardProps>) => {
    return (
        <div
            class={styles.wheelCard}
            classList={{
                [styles.wheelCardBack]: access(props.state).face === "back",
                [styles.isSelected]: access(props.state).isSelected,
            }}
        >
            {access(props.state).face === "front" && (
                <>
                    <div class={styles.wheelCardRank}>{access(props.rank) ?? access(props.state).index + 1}</div>

                    {props.children}
                </>
            )}
        </div>
    );
};

export const PageWheelStack = (props: ParentProps) => <div class={styles.wheelStack}>{props.children}</div>;

export const PageWheelMount = (props: ParentProps) => <div class={styles.wheelMount}>{props.children}</div>;

export const PageWheelPip = (props: PageWheelPipProps) => {
    return (
        <div class={PIP_SIDE_STYLES[access(props.side)]} aria-hidden="true">
            <svg class={styles.wheelPipShape} viewBox="0 0 20 20">
                <path d={PIP_PATH} />
            </svg>
        </div>
    );
};

export const PageWheelCentre = (props: ParentProps) => <div class={styles.wheelCentre}>{props.children}</div>;

export const PageWheelBar = (props: ParentProps) => <div class={styles.wheelBar}>{props.children}</div>;

export const PageWheelSpin = (props: PageWheelSpinProps) => {
    return (
        <div
            class={styles.wheelSpin}
            classList={{
                [styles.isHovered]: access(props.flags).isHovered,
                [styles.isActive]: access(props.flags).isActive,
                [styles.isDisabled]: access(props.flags).isDisabled,
            }}
            aria-hidden="true"
        >
            {access(props.phase) === "spinning" || access(props.phase) === "settling" ? "…" : "Spin"}
        </div>
    );
};
