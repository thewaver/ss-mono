import type { CheckedState } from "./CheckedState.types";

/** Derives a parent checkbox's own state from the states of the boxes it governs. */
export namespace CheckedStateUtils {
    /**
     * Folds a group of child checkbox states into the single state their parent should show.
     *
     * A parent box has three things to say rather than two: all of my children are ticked, none of
     * them are, or they disagree. This picks between them so a caller never has to count.
     *
     * @param members One entry per child, `true` where that child is ticked.
     * @returns `true` when every child is ticked, `false` when none is, and `"mixed"` when they
     * disagree. An empty group reports `false`, since there is nothing ticked in it.
     */
    export const fromMembers = (members: boolean[]): CheckedState => {
        if (members.length < 1) return false;

        const first = members[0];

        return members.every((member) => member === first) ? first : "mixed";
    };
}
