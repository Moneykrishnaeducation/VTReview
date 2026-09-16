export interface RegulatorDomainModel {
  id: string;
  code: string;
  name: string;
  jurisdiction: string;
  flagEmoji: string;
  tier: 1 | 2 | 3;
  establishedYear: number;
  officialRegisterUrl: string;
  compensationLimit: string;
  negativeBalanceProtectionMandatory: boolean;
  maxLeverageRetailForex: string;
  segregatedClientFundsMandatory: boolean;
  description: string;
  authorizedBrokersCount: number;
  verificationInstructions: string[];
}
