// Ticket Service — Generates digital QR tickets for Metro/Bus and tracks status

export interface TicketData {
  id: string;
  ticketNumber: string;
  ticketType: "Metro" | "Bus" | "Train" | "Demo";
  operator: "DMRC" | "DTC" | "IRCTC" | "EcoRoute Demo";
  fromStation: string;
  toStation: string;
  passengerCount: number;
  fare: number;
  qrCodeData: string;
  status: "active" | "used" | "cancelled" | "expired";
  validFrom: string;
  validUntil: string;
  isDemo: boolean;
}

export async function generateTicket(
  ticketType: "Metro" | "Bus" | "Train",
  fromStation: string,
  toStation: string,
  fare: number,
  passengerCount = 1
): Promise<TicketData> {
  const ticketNo = `TKT-${ticketType.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-6)}`;
  const now = new Date();
  const validUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h validity

  const operatorMap = {
    Metro: "DMRC" as const,
    Bus: "DTC" as const,
    Train: "IRCTC" as const,
  };

  const qrData = JSON.stringify({
    tktNo: ticketNo,
    type: ticketType,
    from: fromStation,
    to: toStation,
    passengers: passengerCount,
    fare,
    issuedAt: now.toISOString(),
    validUntil: validUntil.toISOString(),
  });

  return {
    id: `tkt_${Date.now()}`,
    ticketNumber: ticketNo,
    ticketType,
    operator: operatorMap[ticketType] || "DMRC",
    fromStation,
    toStation,
    passengerCount,
    fare,
    qrCodeData: qrData,
    status: "active",
    validFrom: now.toISOString(),
    validUntil: validUntil.toISOString(),
    isDemo: true,
  };
}

export function formatTicketQR(qrData: string): string {
  // Returns SVG string or data URL for rendering QR
  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;
}
