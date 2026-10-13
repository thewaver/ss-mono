export type CirclePackingNode<T> = {
    value: T;
    weight?: number;
    children?: CirclePackingNode<T>[];
};

export type CirclePackingCircle = {
    x: number;
    y: number;
    radius: number;
};

export type CirclePackingView = {
    x: number;
    y: number;
    diameter: number;
};

export type CirclePackingCircleState = {
    /** How far the circle's center is to the right of the drawing's center at this moment, in pixels. */
    x: number;
    /** How far the circle's center is below the drawing's center at this moment, in pixels. */
    y: number;
    /** The circle's radius at this moment, in pixels. */
    radius: number;
    /** The circle's own weight for a leaf, or everything inside it for a branch. */
    weight: number;
    /** Whether the circle has circles inside it, and so can be zoomed into. */
    isBranch: boolean;
    /** Whether the circle sits directly inside the branch in view once the current zoom settles. */
    isInView: boolean;
    /** How deep the circle's node is, counting the root's children as one. */
    depth: number;
};

export type BaseCirclePackingValues<T> = {
    /** Names the circle packing for assistive technology. */
    ariaLabel: string;
    /** The space left between neighboring circles and around the inside of their parent, in pixels. */
    padding?: number;
    /** How long a zoom takes. `0` jumps straight to the new view, which is the route for reduced motion. */
    zoomDurationMs?: number;
    /**
     * The whole tree. A leaf's area comes from its `weight` and a branch is packed around its children, so a weight set
     * on a branch is ignored. A child weighing nothing gets no circle.
     */
    root: CirclePackingNode<T>;
};

export type BaseCirclePackingProps<T> = BaseCirclePackingValues<T>;
