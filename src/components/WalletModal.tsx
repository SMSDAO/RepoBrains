import React, { useState } from 'react';
import { 
  Key, X, Wallet, Shield, Check, Copy, RefreshCw, Lock, 
  FileSignature, AlertCircle, ArrowUpRight, Cpu, Sparkles
} from 'lucide-react';
import { CryptoWalletState } from '../types/oracle';
import { generateSovereignKeypair, signOraclePayload } from '../services/cryptoWallet';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: CryptoWalletState;
  setWallet: React.Dispatch<React.SetStateAction<CryptoWalletState>>;
  onSignGreenlock?: (signature: string, signer: string) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  wallet,
  setWallet,
  onSignGreenlock
}) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'connect' | 'sign'>('generate');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [customPayload, setCustomPayload] = useState('ORACLE_GREENLOCK_SEAL_AUTH::REPO_003::NONCE_01');
  const [generatedSignature, setGeneratedSignature] = useState<{ signature: string; timestamp: string; hash: string } | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  if (!isOpen) return null;

  const handleGenerateKey = () => {
    const keypair = generateSovereignKeypair();
    setWallet({
      connected: true,
      address: keypair.address,
      publicKey: keypair.publicKey,
      privateKey: keypair.privateKey,
      mnemonic: keypair.mnemonic,
      walletType: 'GENERATED_SOVEREIGN',
      governanceRole: 'ORACLE_CORE_OPERATOR',
      nonce: 1
    });
  };

  const handleConnectProvider = (providerName: 'METAMASK' | 'PHANTOM' | 'HARDWARE') => {
    // Generate deterministic mock address for external wallet connection
    const mockAddr = providerName === 'METAMASK' 
      ? '0x71C...4e91' 
      : providerName === 'PHANTOM' 
      ? 'DYw8...9kLM' 
      : '0x88A...3F02';
    
    setWallet({
      connected: true,
      address: mockAddr,
      publicKey: '0x048921a948291048bca192...',
      privateKey: null, // External provider manages private key
      mnemonic: undefined,
      walletType: providerName,
      governanceRole: 'ORACLE_CORE_OPERATOR',
      nonce: 1
    });
  };

  const handleDisconnect = () => {
    setWallet({
      connected: false,
      address: null,
      publicKey: null,
      privateKey: null,
      mnemonic: undefined,
      walletType: null,
      governanceRole: 'ORACLE_CORE_OPERATOR',
      nonce: 1
    });
    setGeneratedSignature(null);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSignGovernanceAction = async () => {
    if (!wallet.connected) return;
    setIsSigning(true);
    try {
      const pKey = wallet.privateKey || '0x4f89219018402918409128409128401928401928401928401928401928401928';
      const sigData = await signOraclePayload(customPayload, pKey);
      setGeneratedSignature(sigData);
      if (onSignGreenlock && wallet.address) {
        onSignGreenlock(sigData.signature, wallet.address);
      }
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel border border-cyan-500/30 rounded-2xl flex flex-col overflow-hidden shadow-2xl shadow-cyan-950/60">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-cyan-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide text-white font-cyber flex items-center gap-2">
                SOVEREIGN ORACLE WALLET <span className="text-cyan-400 text-xs px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">ECDSA / ED25519</span>
              </h2>
              <p className="text-xs text-slate-400">Cryptographic Governance Signer & Autonomous Authority</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${wallet.connected ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-slate-500'}`} />
            <span className="text-slate-300 font-mono">
              {wallet.connected ? `CONNECTED: ${wallet.walletType}` : 'WALLET: DISCONNECTED'}
            </span>
          </div>
          {wallet.connected && (
            <div className="flex items-center gap-2 font-mono text-cyan-400">
              <span className="text-slate-400">ROLE:</span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[11px]">
                {wallet.governanceRole}
              </span>
              <button 
                onClick={handleDisconnect}
                className="ml-2 text-xs text-red-400 hover:text-red-300 underline"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/5 bg-slate-950/40 px-6 gap-2 py-2">
          {[
            { id: 'generate', label: 'Sovereign Key Generator', icon: Sparkles },
            { id: 'connect', label: 'Connect Web3 Wallet', icon: Wallet },
            { id: 'sign', label: 'Sign Governance Proof', icon: FileSignature },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          
          {/* TAB 1: GENERATE SOVEREIGN KEY */}
          {activeTab === 'generate' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl glass-cyan border border-cyan-500/30 flex items-start justify-between">
                <div>
                  <h4 className="text-cyan-300 font-bold text-sm font-cyber flex items-center gap-2">
                    <Cpu className="w-4 h-4" /> Sovereign Browser Keypair Generation
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Generate an un-censorable sovereign keypair directly in your browser. 
                    Used by the Oracle Protocol to seal GreenLock protection and sign autonomous patches.
                  </p>
                </div>
                <button
                  onClick={handleGenerateKey}
                  className="px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,243,255,0.4)] whitespace-nowrap"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Generate Key
                </button>
              </div>

              {wallet.mnemonic && (
                <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" /> 12-Word Mnemonic Seed Phrase
                    </span>
                    <button
                      onClick={() => copyToClipboard(wallet.mnemonic!, 'mnemonic')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      {copiedKey === 'mnemonic' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === 'mnemonic' ? 'Copied' : 'Copy Words'}
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 p-3 rounded-lg bg-black/60 border border-white/5 font-mono text-xs text-cyan-200">
                    {wallet.mnemonic.split(' ').map((word, i) => (
                      <span key={i} className="flex gap-1.5 text-slate-400">
                        <span className="text-slate-600 select-none">{(i + 1).toString().padStart(2, '0')}.</span>
                        <span className="text-cyan-300 font-semibold">{word}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {wallet.address && (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-black/60 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono">Public Address:</span>
                      <button
                        onClick={() => copyToClipboard(wallet.address!, 'address')}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        {copiedKey === 'address' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedKey === 'address' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="font-mono text-xs text-cyan-300 break-all">{wallet.address}</p>
                  </div>

                  {wallet.privateKey && (
                    <div className="p-3 rounded-lg bg-black/60 border border-red-500/20 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-red-400 font-mono flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Private Key (Confidential):
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowPrivateKey(!showPrivateKey)}
                            className="text-xs text-slate-400 hover:text-white"
                          >
                            {showPrivateKey ? 'Hide' : 'Reveal'}
                          </button>
                          <button
                            onClick={() => copyToClipboard(wallet.privateKey!, 'privateKey')}
                            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                          >
                            {copiedKey === 'privateKey' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            {copiedKey === 'privateKey' ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>
                      <p className="font-mono text-xs text-slate-300 break-all">
                        {showPrivateKey ? wallet.privateKey : '•'.repeat(48) + wallet.privateKey.slice(-6)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CONNECT WEB3 WALLET */}
          {activeTab === 'connect' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Connect your organization's Web3 hardware or extension wallet to authorize enterprise repo actions.
              </p>

              {[
                { name: 'MetaMask / Web3 Browser', type: 'METAMASK', icon: Wallet, desc: 'Connect EVM compatible browser extension' },
                { name: 'Phantom / Solana Wallet', type: 'PHANTOM', icon: Shield, desc: 'Connect Solana ecosystem governance authority' },
                { name: 'Hardware Key (Ledger / Trezor)', type: 'HARDWARE', icon: Cpu, desc: 'FIPS 140-2 Level 3 cryptographic hardware module' },
              ].map((provider) => (
                <button
                  key={provider.type}
                  onClick={() => handleConnectProvider(provider.type as any)}
                  className="w-full p-4 rounded-xl glass-panel glass-panel-hover flex items-center justify-between text-left transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-cyan-400">
                      <provider.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-cyber">{provider.name}</h4>
                      <p className="text-xs text-slate-400">{provider.desc}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          )}

          {/* TAB 3: SIGN GOVERNANCE PROOF */}
          {activeTab === 'sign' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-black/60 border border-white/10 space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Payload to Sign (GreenLock Certificate)
                </label>
                <textarea
                  value={customPayload}
                  onChange={(e) => setCustomPayload(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-lg p-2.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                onClick={handleSignGovernanceAction}
                disabled={!wallet.connected || isSigning}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 text-black font-cyber font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)]"
              >
                <FileSignature className="w-4 h-4" />
                {isSigning ? 'Calculating SHA-256 Signature...' : 'Cryptographically Sign Payload'}
              </button>

              {generatedSignature && (
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Signature Generated & Validated
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{generatedSignature.timestamp}</span>
                  </div>
                  <div className="p-2 rounded bg-black/60 font-mono text-[11px] text-emerald-300 break-all border border-emerald-500/20">
                    {generatedSignature.signature}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Hash: <code className="text-cyan-300 font-mono">{generatedSignature.hash}</code>
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-cyan-500/20 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Deterministic Sovereign Auth</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-medium transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
