export type Meeting = {
    name: string;
    room: string;
    from: number;
    to: number;
    isCanceled?: boolean;
};

export type Clip = {
    name: string;
    track: number;
    from: number;
    to: number;
};
