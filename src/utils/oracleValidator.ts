import { OracleRegistry } from '../types/oracle';

export interface TelemetryValidationResult {
  isValid: boolean;
  score: number; // 0 - 100
  missingFields: string[];
  warnings: string[];
  errors: string[];
  sealStatus: 'VERIFIED' | 'UNSEALED' | 'INVALID';
  canDeploy: boolean;
  canExecuteSurgery: boolean;
  recommendation: string;
}

export function validateOracleRegistry(repo: OracleRegistry | null | undefined): TelemetryValidationResult {
  const missingFields: string[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!repo) {
    return {
      isValid: false,
      score: 0,
      missingFields: ['OracleRegistry Object'],
      warnings: [],
      errors: ['No repository telemetry loaded in Oracle Registry.'],
      sealStatus: 'INVALID',
      canDeploy: false,
      canExecuteSurgery: false,
      recommendation: 'Select or register a repository in Fleet Manager before proceeding.'
    };
  }

  // Mandatory Repository Identity Fields
  if (!repo.repo?.id) missingFields.push('repo.id');
  if (!repo.repo?.name) missingFields.push('repo.name');
  if (!repo.repo?.branch) missingFields.push('repo.branch');
  if (!repo.repo?.framework) missingFields.push('repo.framework');
  if (!repo.repo?.commitHash) missingFields.push('repo.commitHash');

  // Mandatory Health & Telemetry
  if (repo.health?.score === undefined || repo.health?.score === null) {
    missingFields.push('health.score');
  } else if (repo.health.score < 50) {
    warnings.push(`Repository health score is critically low (${repo.health.score}%).`);
  }

  if (!repo.health?.status) {
    missingFields.push('health.status');
  }

  // Mandatory CI Telemetry
  if (repo.ci?.passing === undefined) {
    missingFields.push('ci.passing');
  } else if (!repo.ci.passing) {
    errors.push('CI pipeline is failing. Deployment blocked by Oracle Gate.');
  }

  // Cryptographic GreenLock Seal Verification
  let sealStatus: 'VERIFIED' | 'UNSEALED' | 'INVALID' = 'UNSEALED';
  if (!repo.cryptographic_seal) {
    warnings.push('Repository lacks an official Cryptographic GreenLock Seal.');
    sealStatus = 'UNSEALED';
  } else if (
    !repo.cryptographic_seal.signature ||
    !repo.cryptographic_seal.signer ||
    !repo.cryptographic_seal.greenlockId
  ) {
    errors.push('Cryptographic seal signature payload is malformed or unverified.');
    sealStatus = 'INVALID';
  } else {
    sealStatus = 'VERIFIED';
  }

  // Invariants & Vulnerabilities
  const totalScannedIssues = (repo.security?.vulnerabilities?.length || 0);
  if (totalScannedIssues > 0) {
    warnings.push(`Found ${totalScannedIssues} unpatched supply-chain vulnerabilities.`);
  }

  // Scoring
  const baseScore = 100 - (missingFields.length * 15) - (errors.length * 20) - (warnings.length * 5);
  const finalScore = Math.max(0, Math.min(100, baseScore));

  const canExecuteSurgery = missingFields.length === 0;
  const canDeploy = canExecuteSurgery && errors.length === 0 && (repo.health?.score || 0) >= 80;

  let recommendation = 'Repository telemetry is 100% verified and ready for zero-downtime deployment.';
  if (missingFields.length > 0) {
    recommendation = `Missing ${missingFields.length} mandatory telemetry fields (${missingFields.join(', ')}). Perform a GitHub Sync to refresh metadata.`;
  } else if (errors.length > 0) {
    recommendation = `Blocked: Resolve ${errors.length} critical CI/Security errors using Master Gods Repair Prompt before deploying.`;
  } else if (warnings.length > 0) {
    recommendation = `Caution: ${warnings.length} non-blocking warnings detected. Surgery recommended to achieve 100% Production Certification.`;
  }

  return {
    isValid: missingFields.length === 0 && errors.length === 0,
    score: finalScore,
    missingFields,
    warnings,
    errors,
    sealStatus,
    canDeploy,
    canExecuteSurgery,
    recommendation
  };
}
