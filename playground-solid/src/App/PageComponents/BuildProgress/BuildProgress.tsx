import { createSignal, onCleanup } from "solid-js";

import { Button, Progress, Sidebar } from "@thewaver/ss-components-solid";
import type { SignalPair } from "@thewaver/ss-components-solid";
import {
    BUILD_PROGRESS_DISMISS_LABEL,
    BUILD_PROGRESS_HEIGHT,
    BUILD_PROGRESS_LABEL,
} from "@thewaver/ss-playground/App/PageComponents/BuildProgress/BuildProgress.const";
import * as styles from "@thewaver/ss-playground/App/PageComponents/BuildProgress/BuildProgress.css";
import type { BuildProgress } from "@thewaver/ss-playground/App/PageComponents/BuildProgress/BuildProgress.types";
import {
    computeBuildProgressCount,
    computeBuildProgressText,
    getIsBuilding,
    observeBuildProgress,
} from "@thewaver/ss-playground/App/PageComponents/BuildProgress/BuildProgress.utils";

import { PageSelectClear } from "../../StyledComponents/SelectClear/SelectClear";
import { PageLayer } from "../Layer/Layer";

const PERCENT = 100;

export const PageBuildProgress = () => {
    const [getProgress, setProgress] = createSignal<BuildProgress>();
    const [getDismissedGeneration, setDismissedGeneration] = createSignal<number>();

    onCleanup(observeBuildProgress(setProgress));

    const getIsShown = () => getIsBuilding(getProgress()) && getProgress()?.generation !== getDismissedGeneration();

    const expandedSignal: SignalPair<boolean> = [getIsShown, () => undefined];

    return (
        <Sidebar
            edge={"top"}
            collapsedSize={0}
            expandedSize={BUILD_PROGRESS_HEIGHT}
            expanded={expandedSignal}
            renderContent={(getPhase) => (
                <PageLayer level={1}>
                    <div class={styles.buildProgressClip}>
                        <div
                            class={styles.buildProgressStrip}
                            classList={{ [styles.isHidden]: getPhase() === "collapsed" }}
                        >
                            <Progress
                                ariaLabel={BUILD_PROGRESS_LABEL}
                                ariaValueText={computeBuildProgressCount(getProgress())}
                                value={getProgress()?.total === undefined ? undefined : getProgress()?.built}
                                max={getProgress()?.total}
                                sizing={"fill"}
                                renderContent={(getState) => (
                                    <div class={styles.buildProgressBar}>
                                        <div
                                            class={styles.buildProgressFill}
                                            style={{ width: `${(getState().ratio ?? 0) * PERCENT}%` }}
                                        />

                                        <span class={styles.buildProgressText} aria-hidden="true">
                                            {computeBuildProgressText(getProgress())}
                                        </span>
                                    </div>
                                )}
                            />

                            <div class={styles.buildProgressDismiss}>
                                <Button
                                    ariaLabel={BUILD_PROGRESS_DISMISS_LABEL}
                                    renderContent={(getFlags) => <PageSelectClear flags={getFlags} />}
                                    onClick={() => {
                                        setDismissedGeneration(getProgress()?.generation);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </PageLayer>
            )}
        />
    );
};
