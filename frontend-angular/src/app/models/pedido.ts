export interface Pedido {
    id?: number;
    cliente: string;
    productoId: number;
    cantidad: number;
    prioridad: string;
    estado?: string;
}