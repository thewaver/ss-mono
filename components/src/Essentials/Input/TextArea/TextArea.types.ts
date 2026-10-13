export type BaseTextAreaValues = {
    /** Whether the box grows to fit what has been typed rather than keeping a fixed height. */
    isAutoSizing?: boolean;
    /** The fewest rows the box shows. */
    minRows?: number;
    /** The most rows the box grows to before it starts scrolling. */
    maxRows?: number;
};

export type BaseTextAreaProps = BaseTextAreaValues;
