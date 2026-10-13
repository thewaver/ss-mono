export type BaseElementMosaicValues<T> = {
    /**
     * The items to pack. Each one keeps its own element for as long as it is in the list, so taking one out
     * moves the others rather than handing each the next one's contents.
     */
    items: T[];
};

export type BaseElementMosaicProps<T> = BaseElementMosaicValues<T>;
