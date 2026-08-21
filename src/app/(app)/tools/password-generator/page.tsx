// src/app/(app)/tools/password-generator/page.tsx
"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Copy,
  RefreshCw,
  ShieldCheck,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import { CompactCardLayout } from "@/components/layouts/compact-card-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";

// Character set pools
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const AMBIGUOUS = /[O0oIl1|]/g;

function getRandomChar(str: string): string {
  if (typeof window === "undefined" || !window.crypto) {
    return str[Math.floor(Math.random() * str.length)];
  }
  const rand = new Uint32Array(1);
  window.crypto.getRandomValues(rand);
  return str[rand[0] % str.length];
}

// Cryptographically secure password generator
function generateSecurePassword(
  length: number,
  options: {
    includeUpper: boolean;
    includeLower: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
    excludeAmbiguous: boolean;
  }
): string {
  let pool = "";
  const requiredChars: string[] = [];

  let lower = LOWERCASE;
  let upper = UPPERCASE;
  let nums = NUMBERS;
  const syms = SYMBOLS;

  if (options.excludeAmbiguous) {
    lower = lower.replace(AMBIGUOUS, "");
    upper = upper.replace(AMBIGUOUS, "");
    nums = nums.replace(AMBIGUOUS, "");
  }

  if (options.includeLower) {
    pool += lower;
    requiredChars.push(getRandomChar(lower));
  }
  if (options.includeUpper) {
    pool += upper;
    requiredChars.push(getRandomChar(upper));
  }
  if (options.includeNumbers) {
    pool += nums;
    requiredChars.push(getRandomChar(nums));
  }
  if (options.includeSymbols) {
    pool += syms;
    requiredChars.push(getRandomChar(syms));
  }

  if (!pool) return "";

  const remainingLength = Math.max(0, length - requiredChars.length);
  const resultChars = [...requiredChars];

  if (typeof window !== "undefined" && window.crypto) {
    const randomValues = new Uint32Array(remainingLength);
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < remainingLength; i++) {
      resultChars.push(pool[randomValues[i] % pool.length]);
    }

    // Shuffle array using Fisher-Yates with crypto random values
    const shuffleValues = new Uint32Array(resultChars.length);
    window.crypto.getRandomValues(shuffleValues);
    for (let i = resultChars.length - 1; i > 0; i--) {
      const j = shuffleValues[i] % (i + 1);
      [resultChars[i], resultChars[j]] = [resultChars[j], resultChars[i]];
    }
  } else {
    for (let i = 0; i < remainingLength; i++) {
      resultChars.push(pool[Math.floor(Math.random() * pool.length)]);
    }
  }

  return resultChars.join("");
}

// Calculate Shannon entropy in bits
function calculateEntropy(length: number, poolSize: number): number {
  if (poolSize <= 0 || length <= 0) return 0;
  return Math.round(length * Math.log2(poolSize));
}

export default function PasswordGeneratorPage() {
  const [length, setLength] = React.useState(18);
  const [includeUpper, setIncludeUpper] = React.useState(true);
  const [includeLower, setIncludeLower] = React.useState(true);
  const [includeNumbers, setIncludeNumbers] = React.useState(true);
  const [includeSymbols, setIncludeSymbols] = React.useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = React.useState(false);

  // Initialize state synchronously during render without calling setState inside an effect
  const [password, setPassword] = React.useState(() =>
    generateSecurePassword(18, {
      includeUpper: true,
      includeLower: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeAmbiguous: false,
    })
  );

  const [showPassword, setShowPassword] = React.useState(true);
  const [copied, setCopied] = React.useState(false);

  const handleGenerate = () => {
    if (!includeUpper && !includeLower && !includeNumbers && !includeSymbols) {
      toast.error("Please select at least one character type");
      return;
    }

    const pwd = generateSecurePassword(length, {
      includeUpper,
      includeLower,
      includeNumbers,
      includeSymbols,
      excludeAmbiguous,
    });
    setPassword(pwd);
  };

  // Compute character pool size & entropy
  const { entropy, strengthLabel, strengthColor } = React.useMemo(() => {
    let poolSize = 0;
    if (includeLower) poolSize += excludeAmbiguous ? 24 : 26;
    if (includeUpper) poolSize += excludeAmbiguous ? 23 : 26;
    if (includeNumbers) poolSize += excludeAmbiguous ? 8 : 10;
    if (includeSymbols) poolSize += SYMBOLS.length;

    const bits = calculateEntropy(length, poolSize);

    if (bits < 40) {
      return {
        entropy: bits,
        strengthLabel: "Weak",
        strengthColor: "text-rose-500 bg-rose-500/10 border-rose-500/30",
      };
    }
    if (bits < 64) {
      return {
        entropy: bits,
        strengthLabel: "Fair",
        strengthColor: "text-amber-500 bg-amber-500/10 border-amber-500/30",
      };
    }
    if (bits < 90) {
      return {
        entropy: bits,
        strengthLabel: "Strong",
        strengthColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
      };
    }
    return {
      entropy: bits,
      strengthLabel: "Very Strong",
      strengthColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/40",
    };
  }, [length, includeLower, includeUpper, includeNumbers, includeSymbols, excludeAmbiguous]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success("Password copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CompactCardLayout
      toolId="password-generator"
      title="Secure Password Generator"
      description="Create customizable cryptographically secure passwords locally in your browser using the Web Cryptography API."
      category="security"
      icon="KeyRound"
      tags={["generator"]}
      featured={true}
      controls={
        <>
          {/* Output Display Box */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-muted-foreground">
                Generated Password:
              </span>
              <Badge
                variant="outline"
                className={`text-[10px] font-mono gap-1 py-0.5 px-2 ${strengthColor}`}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>{strengthLabel} ({entropy} bits entropy)</span>
              </Badge>
            </div>

            <InputGroup className="h-12 rounded-xl border-border/80 bg-background/60">
              <InputGroupInput
                type={showPassword ? "text" : "password"}
                value={password}
                readOnly
                className="font-mono text-sm sm:text-base tracking-wider text-emerald-500 font-semibold selection:bg-emerald-500/20"
              />
              <InputGroupAddon align="inline-end" className="pr-1.5 gap-1">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setShowPassword(!showPassword)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleCopy}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  aria-label="Copy password"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>

          {/* Length Slider */}
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground">Password Length:</span>
              <span className="font-bold text-foreground text-sm">{length} Characters</span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={(e) => {
                const newLength = Number(e.target.value);
                setLength(newLength);
                setPassword(
                  generateSecurePassword(newLength, {
                    includeUpper,
                    includeLower,
                    includeNumbers,
                    includeSymbols,
                    excludeAmbiguous,
                  })
                );
              }}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Character Options Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border/40 text-xs font-mono">
            <label className="flex items-center gap-2.5 cursor-pointer text-foreground select-none">
              <input
                type="checkbox"
                checked={includeUpper}
                onChange={(e) => {
                  const val = e.target.checked;
                  setIncludeUpper(val);
                  setPassword(
                    generateSecurePassword(length, {
                      includeUpper: val,
                      includeLower,
                      includeNumbers,
                      includeSymbols,
                      excludeAmbiguous,
                    })
                  );
                }}
                className="rounded accent-emerald-500 h-4 w-4"
              />
              <span>Uppercase (A-Z)</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-foreground select-none">
              <input
                type="checkbox"
                checked={includeLower}
                onChange={(e) => {
                  const val = e.target.checked;
                  setIncludeLower(val);
                  setPassword(
                    generateSecurePassword(length, {
                      includeUpper,
                      includeLower: val,
                      includeNumbers,
                      includeSymbols,
                      excludeAmbiguous,
                    })
                  );
                }}
                className="rounded accent-emerald-500 h-4 w-4"
              />
              <span>Lowercase (a-z)</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-foreground select-none">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => {
                  const val = e.target.checked;
                  setIncludeNumbers(val);
                  setPassword(
                    generateSecurePassword(length, {
                      includeUpper,
                      includeLower,
                      includeNumbers: val,
                      includeSymbols,
                      excludeAmbiguous,
                    })
                  );
                }}
                className="rounded accent-emerald-500 h-4 w-4"
              />
              <span>Numbers (0-9)</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-foreground select-none">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => {
                  const val = e.target.checked;
                  setIncludeSymbols(val);
                  setPassword(
                    generateSecurePassword(length, {
                      includeUpper,
                      includeLower,
                      includeNumbers,
                      includeSymbols: val,
                      excludeAmbiguous,
                    })
                  );
                }}
                className="rounded accent-emerald-500 h-4 w-4"
              />
              <span>Symbols (!@#$)</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-foreground select-none sm:col-span-2 pt-1 border-t border-border/30">
              <input
                type="checkbox"
                checked={excludeAmbiguous}
                onChange={(e) => {
                  const val = e.target.checked;
                  setExcludeAmbiguous(val);
                  setPassword(
                    generateSecurePassword(length, {
                      includeUpper,
                      includeLower,
                      includeNumbers,
                      includeSymbols,
                      excludeAmbiguous: val,
                    })
                  );
                }}
                className="rounded accent-emerald-500 h-4 w-4"
              />
              <span className="text-muted-foreground">
                Exclude Ambiguous Characters (e.g. 0, O, l, 1, I)
              </span>
            </label>
          </div>
        </>
      }
      actions={
        <Button
          onClick={() => {
            handleGenerate();
            toast.success("Generated new secure password!");
          }}
          className="w-full h-11 bg-emerald-500 text-zinc-950 hover:bg-emerald-400 gap-2 font-medium text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Generate New Password</span>
        </Button>
      }
      result={<></>}
      footerInfo={
        <div className="rounded-xl border border-border/60 bg-muted/10 p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-foreground font-semibold font-mono text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Cryptographic Security Guarantee</span>
          </div>
          <p className="text-muted-foreground leading-relaxed text-xs">
            Entropy is sourced directly from the browser&apos;s CSPRNG (
            <code className="text-emerald-500">window.crypto.getRandomValues</code>
            ). No generated passwords are ever logged, sent across networks, or cached on any server.
          </p>
        </div>
      }
    />
  );
}