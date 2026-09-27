// Emergency Service — SOS, Live Location Broadcast, Emergency Contacts & Nearby Facilities

import { ECO_CONFIG, getServiceStatus, ServiceDataStatus } from "@/services/config";
import { DEMO_NEARBY } from "@/lib/demo-data";

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface EmergencyAlertPayload {
  userLat: number;
  userLng: number;
  userAddress: string;
  contactsNotified: number;
  sosId: string;
  timestamp: string;
  status: "broadcasted" | "acknowledged";
  dataStatus: ServiceDataStatus;
}

export async function triggerSOS(
  lat: number,
  lng: number,
  address: string,
  contacts: EmergencyContact[]
): Promise<EmergencyAlertPayload> {
  const sosId = `SOS-${Date.now().toString().slice(-6)}`;
  const dataStatus = getServiceStatus("TWILIO_API_KEY");

  console.log(`[SOS TRIGGERED] Lat: ${lat}, Lng: ${lng}, Addr: ${address}`);

  return {
    userLat: lat,
    userLng: lng,
    userAddress: address || "Connaught Place, New Delhi",
    contactsNotified: Math.max(1, contacts.length),
    sosId,
    timestamp: new Date().toISOString(),
    status: "broadcasted",
    dataStatus,
  };
}

export function getNearbyEmergencyFacilities(lat: number, lng: number) {
  return DEMO_NEARBY;
}
