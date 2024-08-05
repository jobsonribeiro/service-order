export class OrderDto {
    readonly clientId: number;
    readonly clientName: string;
    readonly clientEmail: string;
    readonly status: string;
    readonly products: { id: number; quantity: number; price: number; }[];
}