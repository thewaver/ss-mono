import {
    BUILD_PROGRESS_EVENT,
    BUILD_PROGRESS_LABEL,
    BUILD_PROGRESS_READING,
    BUILD_START_EVENT,
} from "./BuildProgress.const";
import type { BuildProgress } from "./BuildProgress.types";

export const IS_BUILD_PROGRESS_SHOWN = import.meta.hot !== undefined;

export const getIsBuilding = (progress: BuildProgress | undefined) =>
    progress !== undefined && (progress.total === undefined || progress.built < progress.total);

export const computeBuildProgressCount = (progress: BuildProgress | undefined) =>
    progress?.total === undefined ? BUILD_PROGRESS_READING : `${progress.built} of ${progress.total}`;

export const computeBuildProgressText = (progress: BuildProgress | undefined) =>
    `${BUILD_PROGRESS_LABEL}: ${computeBuildProgressCount(progress)}`;

export const observeBuildProgress = (onProgress: (progress: BuildProgress) => void) => {
    const hot = import.meta.hot;

    if (!hot) return () => undefined;

    const announceLoaded = () => hot.send(BUILD_START_EVENT);

    hot.on(BUILD_PROGRESS_EVENT, onProgress);

    if (document.readyState === "complete") announceLoaded();
    else window.addEventListener("load", announceLoaded, { once: true });

    return () => {
        hot.off(BUILD_PROGRESS_EVENT, onProgress);
        window.removeEventListener("load", announceLoaded);
    };
};
