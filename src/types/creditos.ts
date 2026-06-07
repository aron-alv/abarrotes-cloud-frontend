export interface ClienteCredito {
  id: string;
  tiendaId: string;
  nombreCompleto: string;
  telefono: string;
  limiteCredito: number;
  saldoActual: number;
}

export interface ClienteCreditoCreateDTO {
  tiendaId: string;
  nombreCompleto: string;
  telefono: string;
  limiteCredito: number;
  saldoActual: number;
}


export interface AbonoCredito {
  id: string;
  tiendaId: string;
  clienteId: string;
  usuarioId: string;
  montoAbonado: number;
  clienteNombre: string;
  usuarioNombre: string;
    fechaabono: string;
}


export interface AbonoCreditoCreateDTO {
  tiendaId: string;
  clienteId: string;
  usuarioId: string;
  montoAbonado: number;
  clienteNombre: string;


}