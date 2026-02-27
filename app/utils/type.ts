export type pagePropsChildNode = {
    children: React.ReactNode;
}

export interface BlogPost {
    userId?: number;
    id: number;
    title: string;
    body: string;
}