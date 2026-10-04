export type TurnClockTween = {
    /**
     * Starts a timed turn, abandoning any this tween already had under way.
     *
     * @param durationMs How long the turn takes. `0` or less arrives at once, before `run` returns.
     * @param onFrame Called on each frame before arrival with how far through the turn it is, from `0` towards `1`.
     * @param onArrive Called once when the turn ends, whether a frame or the backstop timer got there first.
     */
    run: (durationMs: number, onFrame: (ratio: number) => void, onArrive: () => void) => void;
    /** Abandons the turn under way, if any, without arriving. */
    cancel: () => void;
};

export type TurnClockTargetRequest = {
    /**
     * Asks for a target and hands it on once it is known.
     *
     * @param compute Chooses the target. It may answer with a promise.
     * @param onTarget Called with the target, unless the request was canceled in the meantime.
     * @param onRefused Called when the promise rejects, unless the request was canceled in the meantime.
     */
    request: <T>(compute: () => T | Promise<T>, onTarget: (target: T) => void, onRefused: () => void) => void;
    /** Forgets every request still waiting, so its answer is ignored when it arrives. */
    cancel: () => void;
};
