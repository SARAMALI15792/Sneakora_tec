import { type NextRequest, NextResponse } from "next/server";
import dns from "dns";
import { promisify } from "util";

const dnsMxLookup = promisify(dns.resolveMx);

const DISPOSABLE_DOMAINS = new Set([
  "tempmail.com",
  "throwaway.com",
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "temp-mail.org",
  "fakeinbox.com",
  "trashmail.com",
  "maildrop.cc",
  "getairmail.com",
  "yopmail.com",
  "sharklasers.com",
  "guerrillamail.info",
  "grr.la",
  "mailnesia.com",
  "tempail.com",
  "mohmal.com",
  "tempinbox.com",
]);

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const SUSPICIOUS_PATTERNS = [
  /^[a-zA-Z0-9]{20,}@/,
  /^user\d*@/,
  /^test\d*@/,
  /^temp\d*@/,
  /^spam\d*@/,
  /^fake\d*@/,
];

function analyzePatterns(email: string): { isSuspicious: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const localPart = email.split("@")[0].toLowerCase();

  if (SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(email))) {
    reasons.push("Email matches suspicious pattern");
  }

  const numbersOnly = localPart.replace(/\D/g, "");
  if (numbersOnly.length > 10) {
    reasons.push("Local part contains excessive numbers");
  }

  const repeatedChars = localPart.match(/(.)\1{4,}/);
  if (repeatedChars) {
    reasons.push("Local part contains repeated characters");
  }

  return {
    isSuspicious: reasons.length > 0,
    reasons,
  };
}

async function checkMxRecords(domain: string): Promise<boolean> {
  try {
    const records = await dnsMxLookup(domain);
    return records && records.length > 0;
  } catch {
    return false;
  }
}

function isDisposableEmail(email: string): { isDisposable: boolean; domain: string } {
  const domain = email.toLowerCase().split("@")[1];
  return {
    isDisposable: DISPOSABLE_DOMAINS.has(domain),
    domain,
  };
}

function isValidFormat(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { valid: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const validation = {
      valid: true,
      email: normalizedEmail,
      checks: {
        format: false,
        disposable: false,
        mxRecord: false,
        pattern: false,
      },
      details: {
        isDisposable: false,
        disposableDomain: null as string | null,
        hasMxRecord: false,
        patternAnalysis: {
          isSuspicious: false,
          reasons: [] as string[],
        },
      },
      suggestions: [] as string[],
    };

    if (!isValidFormat(normalizedEmail)) {
      validation.valid = false;
      validation.checks.format = false;
      validation.suggestions.push("Please enter a valid email address");
      return NextResponse.json(validation);
    }
    validation.checks.format = true;

    const disposableCheck = isDisposableEmail(normalizedEmail);
    if (disposableCheck.isDisposable) {
      validation.valid = false;
      validation.checks.disposable = false;
      validation.details.isDisposable = true;
      validation.details.disposableDomain = disposableCheck.domain;
      validation.suggestions.push("Please use a permanent email address");
      return NextResponse.json(validation);
    }
    validation.checks.disposable = true;
    validation.details.isDisposable = false;

    const domain = normalizedEmail.split("@")[1];
    const hasMx = await checkMxRecords(domain);
    if (!hasMx) {
      validation.valid = false;
      validation.checks.mxRecord = false;
      validation.details.hasMxRecord = false;
      validation.suggestions.push("Email domain does not accept mail");
      return NextResponse.json(validation);
    }
    validation.checks.mxRecord = true;
    validation.details.hasMxRecord = true;

    const patternAnalysis = analyzePatterns(normalizedEmail);
    validation.checks.pattern = !patternAnalysis.isSuspicious;
    validation.details.patternAnalysis = patternAnalysis;
    if (patternAnalysis.isSuspicious) {
      validation.suggestions.push("Consider using a more professional email");
    }

    return NextResponse.json(validation);
  } catch (error) {
    console.error("[VerifyEmail] Error:", error);
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}