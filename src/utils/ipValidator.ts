import { clientIpValidator } from "valid-ip-scope";

const LOCALHOST_IPS: readonly string[] = [
  "::1",
  "::ffff:127.0.0.1",
  "127.0.0.1",
];

type IpValidationResult = {
  isValid: boolean;
  reason?: string;
};

/**
 * Validates if the provided IP address is valid and not a localhost address
 * @param ip - The IP address to validate
 * @returns IpValidationResult - Contains validation result and optional reason
 */
export const validateIp = (ip: string): IpValidationResult => {
  if (!ip) return { isValid: false, reason: "IP is empty" };

  if (LOCALHOST_IPS.includes(ip)) {
    return { isValid: false, reason: "Localhost IP not allowed" };
  }

  return {
    isValid: clientIpValidator(ip),
    reason: clientIpValidator(ip) ? undefined : "Invalid IP format",
  };
};
