import { useEffect, useState } from "react";

import { Button, Progress, Sidebar } from "@thewaver/ss-components-react";
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
    const [progress, setProgress] = useState<BuildProgress>();
    const [dismissedGeneration, setDismissedGeneration] = useState<number>();

    useEffect(() => observeBuildProgress(setProgress), []);

    const isShown = getIsBuilding(progress) && progress?.generation !== dismissedGeneration;

    const expandedState = [isShown, () => undefined] as const;

    return (
        <Sidebar
            edge={"top"}
            collapsedSize={0}
            expandedSize={BUILD_PROGRESS_HEIGHT}
            expanded={expandedState}
            renderContent={(phase) => (
                <PageLayer level={1}>
                    <div className={styles.buildProgressClip}>
                        <div
                            className={[styles.buildProgressStrip, phase === "collapsed" && styles.isHidden]
                                .filter(Boolean)
                                .join(" ")}
                        >
                            <Progress
                                ariaLabel={BUILD_PROGRESS_LABEL}
                                ariaValueText={computeBuildProgressCount(progress)}
                                value={progress?.total === undefined ? undefined : progress.built}
                                max={progress?.total}
                                sizing={"fill"}
                                renderContent={(state) => (
                                    <div className={styles.buildProgressBar}>
                                        <div
                                            className={styles.buildProgressFill}
                                            style={{ width: `${(state.ratio ?? 0) * PERCENT}%` }}
                                        />

                                        <span className={styles.buildProgressText} aria-hidden="true">
                                            {computeBuildProgressText(progress)}
                                        </span>
                                    </div>
                                )}
                            />

                            <div className={styles.buildProgressDismiss}>
                                <Button
                                    ariaLabel={BUILD_PROGRESS_DISMISS_LABEL}
                                    renderContent={(flags) => <PageSelectClear flags={flags} />}
                                    onClick={() => setDismissedGeneration(progress?.generation)}
                                />
                            </div>
                        </div>
                    </div>
                </PageLayer>
            )}
        />
    );
};
