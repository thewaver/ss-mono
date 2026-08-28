import type { CheckedState } from "./CheckedState.types";

export namespace CheckedStateUtils {
    export const fromMembers = (members: boolean[]): CheckedState => {
        if (members.length < 1) return false;

        const first = members[0];

        return members.every((member) => member === first) ? first : "mixed";
    };
}
