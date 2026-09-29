import { AudioUtils, MathUtils } from "@thewaver/ss-utils";

import type { AudioSwitcherController, AudioSwitcherDefs } from "./AudioSwitcher.types";

/** How many volume steps a crossfade is cut into. */
const CROSSFADE_STEPS = 25;

type FadeDirection = "in" | "out";

type Fade = {
    handle: ReturnType<typeof setInterval>;
    direction: FadeDirection;
};

/** The part of an audio switcher that is not about any framework: two elements, and the crossfade between them. */
export namespace AudioSwitcherUtils {
    /**
     * Makes the pair of audio elements a switcher crossfades between, and the commands that drive them.
     *
     * Each new source goes to whichever element is idle and fades in while the other fades out, so a switch is never
     * a cut. Being handed a source means "play this", except for the first one, which plays only when asked to
     * autoplay or when playback is already wanted. Playback is reported back through `defs.setIsPlaying` only once
     * the browser has actually started it, and a stop that arrives while the browser is still starting a track wins:
     * the track is paused the moment it comes through.
     *
     * The binding calls `followPlayback` whenever the consumer's playback value changes, `applyVolume` whenever the
     * volume does, and `setSource` whenever the source does. `mount` returns a stop that silences and empties both
     * elements and forgets the source, so a later `mount` and `setSource` start cleanly — the switcher survives being
     * stopped and started again.
     *
     * @param defs How the switcher reads its settings — `getVolume` from 0 to 1, `getCrossfadeMs` — and the consumer's
     * playback, which it reads through `getIsPlaying` and writes through `setIsPlaying` once the browser has
     * started or refused a track. It keeps no copy of playback of its own.
     * @returns The commands, and the controller handed to a consumer.
     */
    export const createSwitcher = (defs: AudioSwitcherDefs) => {
        const fades = new Map<HTMLAudioElement, Fade>();
        const startingElements = new Set<HTMLAudioElement>();
        const stoppedWhileStarting = new Set<HTMLAudioElement>();

        const audioA = new Audio();
        const audioB = new Audio();

        let isMounted = false;
        let currentSrc: string | undefined;
        let version = 0;
        let lastIsPlaying: boolean | undefined;

        const getStep = () => defs.getVolume() / CROSSFADE_STEPS;

        const getIntervalMs = () => defs.getCrossfadeMs() / CROSSFADE_STEPS;

        const getActiveElement = () => (MathUtils.isEven(version) ? audioA : audioB);

        const getInactiveElement = () => (MathUtils.isEven(version) ? audioB : audioA);

        const getFadeDirection = (element: HTMLAudioElement) => fades.get(element)?.direction;

        const clearFade = (element: HTMLAudioElement) => {
            const fade = fades.get(element);

            if (!fade) return;

            clearInterval(fade.handle);
            fades.delete(element);
        };

        const startFade = (element: HTMLAudioElement, direction: FadeDirection, tick: () => void) => {
            clearFade(element);

            fades.set(element, { handle: setInterval(tick, getIntervalMs()), direction });
        };

        const fadeIn = (element: HTMLAudioElement) => {
            const fadeInTick = () => {
                const volume = defs.getVolume();

                element.volume = Math.min(element.volume + getStep(), volume);

                if (element.volume === volume) clearFade(element);
            };

            clearFade(element);

            element.volume = 0;
            startingElements.add(element);
            stoppedWhileStarting.delete(element);
            element
                .play()
                .then(() => {
                    startingElements.delete(element);

                    if (stoppedWhileStarting.delete(element)) {
                        element.pause();

                        return;
                    }

                    if (!isMounted || element !== getActiveElement()) return;
                    if (getFadeDirection(element) === "out") return;

                    defs.setIsPlaying(true);
                    startFade(element, "in", fadeInTick);
                })
                .catch((err) => {
                    startingElements.delete(element);
                    stoppedWhileStarting.delete(element);
                    console.warn("Playback prevented by browser autoplay restrictions:", err);
                    defs.setIsPlaying(false);
                    clearFade(element);
                });
        };

        const fadeOut = (element: HTMLAudioElement) => {
            const fadeOutTick = () => {
                element.volume = Math.max(element.volume - getStep(), 0);

                if (element.volume === 0) {
                    element.pause();
                    clearFade(element);
                }
            };

            startFade(element, "out", fadeOutTick);
        };

        const syncPlayback = () => {
            const active = getActiveElement();

            if (defs.getIsPlaying()) {
                if (!AudioUtils.isPlaying(active) || getFadeDirection(active) === "out") fadeIn(active);

                return;
            }

            if (AudioUtils.isPlaying(active) && getFadeDirection(active) !== "out") fadeOut(active);
        };

        const followPlayback = () => {
            const isPlaying = defs.getIsPlaying();
            const hasChanged = lastIsPlaying !== undefined && lastIsPlaying !== isPlaying;

            lastIsPlaying = isPlaying;

            syncPlayback();

            if (hasChanged && !isPlaying && startingElements.has(getActiveElement())) {
                stoppedWhileStarting.add(getActiveElement());
            }
        };

        const applyVolume = () => {
            const active = getActiveElement();

            if (!fades.has(active)) active.volume = defs.getVolume();
        };

        const setSource = (src: string | undefined, shouldAutoPlayOnMount: boolean) => {
            if (src === currentSrc) return;

            const isFirstSrc = currentSrc === undefined;

            currentSrc = src;
            version += 1;

            const active = getActiveElement();
            const inactive = getInactiveElement();

            if (AudioUtils.isPlaying(inactive)) fadeOut(inactive);

            if (src) {
                active.src = src;
                active.loop = true;
                active.currentTime = 0;

                if (!isFirstSrc || shouldAutoPlayOnMount || defs.getIsPlaying()) fadeIn(active);
            }

            syncPlayback();
        };

        const mount = () => {
            isMounted = true;

            return () => {
                isMounted = false;
                currentSrc = undefined;
                lastIsPlaying = undefined;

                for (const element of [audioA, audioB]) {
                    clearFade(element);
                    if (!element.paused) element.pause();
                    element.src = "";
                    element.load();
                }
            };
        };

        const controller: AudioSwitcherController = {
            reset: () => {
                getActiveElement().currentTime = 0;

                return true;
            },
        };

        return { followPlayback, applyVolume, setSource, mount, controller };
    };
}
