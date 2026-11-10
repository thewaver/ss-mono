import { Show } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import { skinVars } from "@thewaver/ss-playground/App/Skins/Skin.css";
import {
    DEFAULT_PROGRESS_CONTENT_ORIENTATION,
    PERCENT,
} from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ProgressContent/ProgressContent.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { useLayerClass } from "../Layer/Layer.context";
import type { ProgressContentProps } from "./ProgressContentSolid.types";

export const PageProgressContent = (props: ProgressContentProps) => {
    const getLayerClass = useLayerClass();

    const getIsVertical = () => (access(props.orientation) ?? DEFAULT_PROGRESS_CONTENT_ORIENTATION) === "vertical";

    const getIsIndeterminate = () => access(props.state).ratio === undefined;

    const getFillLength = () => (getIsIndeterminate() ? undefined : `${access(props.state).ratio! * PERCENT}%`);

    const getValueVars = () =>
        getIsIndeterminate()
            ? {}
            : assignInlineVars({
                  [skinVars.startValue]: "0",
                  [skinVars.endValue]: `${access(props.state).ratio}`,
              });

    const renderFill = () => (
        <div
            class={styles.progressFill}
            classList={{ [styles.isVertical]: getIsVertical() }}
            style={getIsVertical() ? { height: getFillLength() } : { width: getFillLength() }}
        />
    );

    return (
        <div
            class={styles.progressRow}
            classList={{ [getLayerClass()]: true, [styles.isVertical]: getIsVertical() }}
            style={getValueVars()}
        >
            <div class={styles.progressBar} classList={{ [styles.hasError]: access(props.state).hasError }}>
                <div
                    class={styles.progressTrack}
                    classList={{
                        [styles.isIndeterminate]: getIsIndeterminate(),
                        [styles.hasError]: access(props.state).hasError,
                        [styles.isVertical]: getIsVertical(),
                    }}
                >
                    <Show when={getIsIndeterminate()}>{renderFill()}</Show>
                </div>

                <Show when={!getIsIndeterminate()}>
                    {renderFill()}

                    <div
                        class={styles.progressTipAnchor}
                        classList={{ [styles.isVertical]: getIsVertical() }}
                        style={
                            getIsVertical() ? { bottom: getFillLength() } : { "inset-inline-start": getFillLength() }
                        }
                        aria-hidden="true"
                    >
                        <div
                            class={styles.progressTip}
                            classList={{
                                [styles.hasError]: access(props.state).hasError,
                                [styles.isVertical]: getIsVertical(),
                            }}
                        />
                    </div>
                </Show>
            </div>

            <div class={styles.progressReadout} aria-hidden="true">
                <bdi>
                    {access(props.state).ratio === undefined
                        ? "working…"
                        : `${Math.round(access(props.state).ratio! * PERCENT)}% of ${access(props.state).max}`}
                </bdi>
            </div>
        </div>
    );
};
