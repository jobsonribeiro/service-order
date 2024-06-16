export class OrderDto {
    readonly clientId: number;
    readonly status: string;
    readonly products: { id: number; quantity: number }[];
}