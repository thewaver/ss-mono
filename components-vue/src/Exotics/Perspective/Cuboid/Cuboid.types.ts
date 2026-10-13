import type { VNodeChild } from "vue";

import type { BaseCuboidProps, CuboidFace, CuboidFaceState } from "@thewaver/ss-components";

export type CuboidController = {
    /**
     * Which face is towards the viewer. Without `isUpright` it follows from the two counts alone; with it, it
     * follows from the order the presses came in, which the counts no longer record. It reads the box's reactive
     * state, so a template or a `computed` calling it follows the box.
     */
    getFacing: () => CuboidFace;
    /**
     * Turns the box to a face by the fewest quarter turns from where it actually is, turning across before
     * tipping when two routes are equally short. It works by writing the two counts, as a press would, so
     * whoever owns them sees the turn happen.
     *
     * @returns `false` when that face is already the one showing.
     */
    turnTo: (face: CuboidFace) => boolean;
};

export type CuboidProps = BaseCuboidProps & {
    /**
     * How many quarter turns across. Each change of one is a quarter turn that way: up by one brings the face
     * on the right round to the front. It is one of the two things that turn the box, alongside `pitch`.
     */
    "yaw": number;
    /** Receives the box's own turns across, from a drag or `turnTo`, which is what `v-model:yaw` binds. */
    "onUpdate:yaw"?: (yaw: number) => void;
    /**
     * How many quarter turns up. Each change of one is a quarter turn that way: up by one brings the face
     * above round to the front. It is one of the two things that turn the box, alongside `yaw`.
     */
    "pitch": number;
    /** Receives the box's own turns up, from a drag or `turnTo`, which is what `v-model:pitch` binds. */
    "onUpdate:pitch"?: (pitch: number) => void;
    /**
     * Hands the consumer a controller once the box is up, for asking which face shows and for turning to one
     * by name. The box renders no controls, so any button that turns it is the consumer's to draw.
     */
    "onMount"?: (controller: CuboidController) => void;
};

export type CuboidSlots = {
    /** Draws one face, and is told which face it is. */
    renderFace: (props: { face: CuboidFace; state: CuboidFaceState }) => VNodeChild;
};
