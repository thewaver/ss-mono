import type { Store } from "@thewaver/ss-utils";

export type SmootherFollower = Store<number[]> & {
    follow: (targets: number[], smoothingMs: number) => void;
    stop: () => void;
};
