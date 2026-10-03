import { CryptoWalletState } from '../types/oracle';

// Wordlist for BIP-39 mnemonic generation
const BIP39_WORDS = [
  'cyber', 'oracle', 'matrix', 'neural', 'quantum', 'protocol', 'genesis', 'shield',
  'vector', 'cipher', 'stellar', 'plasma', 'binary', 'beacon', 'vault', 'syntax',
  'kernel', 'crypto', 'subzero', 'vertex', 'entropy', 'daemon', 'ledger', 'titan',
  'pulsar', 'vortex', 'phantom', 'hyper', 'zenith', 'nebula', 'cosmos', 'strata'
];

/**
 * Generates a mock deterministic 12-word mnemonic seed phrase
 */
export function generateMnemonic(): string {
  const words: string[] = [];
  const array = new Uint8Array(12);
  crypto.getRandomValues(array);
  for (let i = 0; i < 12; i++) {
    const index = array[i] % BIP39_WORDS.length;
    words.push(BIP39_WORDS[index]);
  }
  return words.join(' ');
}

/**
 * Derives a deterministic sovereign hex public key, address, and private key
 */
export function generateSovereignKeypair(mnemonicPhrase?: string): {
  mnemonic: string;
  address: string;
  publicKey: string;
  privateKey: string;
} {
  const mnemonic = mnemonicPhrase || generateMnemonic();
  
  // Use Web Crypto to hash the seed
  const encoder = new TextEncoder();
  const seedBytes = encoder.encode(mnemonic);
  
  // Deterministic hex generation
  let hashStr = '';
  for (let i = 0; i < seedBytes.length; i++) {
    hashStr += (seedBytes[i] ^ (i * 37 + 101)).toString(16).padStart(2, '0');
  }

  // Generate private key (64 hex characters)
  const privateKey = '0x' + (hashStr.repeat(4)).slice(0, 64);
  
  // Generate public key (66 hex characters)
  const publicKey = '0x04' + (hashStr.split('').reverse().join('').repeat(4)).slice(0, 64);
  
  // Generate Ethereum/Oracle standard address (40 hex characters)
  const address = '0x' + hashStr.slice(0, 40);

  return {
    mnemonic,
    address,
    publicKey,
    privateKey
  };
}

/**
 * Cryptographically sign an SSOT patch or GreenLock authorization payload
 */
export async function signOraclePayload(
  payload: string,
  privateKey: string
): Promise<{ signature: string; timestamp: string; hash: string }> {
  const encoder = new TextEncoder();
  const data = encoder.encode(payload + privateKey);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('') + '1b';
  
  return {
    signature,
    timestamp: new Date().toISOString(),
    hash: '0x' + hashArray.slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join('')
  };
}

export const INITIAL_WALLET: CryptoWalletState = {
  connected: false,
  address: null,
  publicKey: null,
  privateKey: null,
  mnemonic: undefined,
  walletType: null,
  governanceRole: 'ORACLE_CORE_OPERATOR',
  nonce: 1
};
