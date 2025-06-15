import { StateRule } from '../types/admin';

export const delawareRules: StateRule[] = [
  {
    id: "de-lic-001",
    state: "DE",
    rule_id: "DE-PUBADJ-LIC-001",
    version: "0.9",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "HIGH",
    sunset: undefined,
    category: "Public Adjuster Compliance",
    subcategory: "Licensing Requirements",
    text: "A public adjuster must hold a license under 18 Del. C. § 1751‑1761. The applicant shall file a **$20,000 surety bond**; the license auto‑terminates if the bond lapses. (§ 1753(a)).",
    sources: ["§ 1753 Del. Code"],
    tests: [
      { given: { licensed: false }, expect: "FAIL" },
      { given: { bond_amount: 15000 }, expect: "FAIL" },
      { given: { licensed: true, bond_amount: 20000 }, expect: "PASS" }
    ]
  },
  {
    id: "de-fees-002",
    state: "DE",
    rule_id: "DE-PUBADJ-FEES-002",
    version: "0.9",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "HIGH",
    sunset: undefined,
    category: "Public Adjuster Compliance",
    subcategory: "Fee Regulations",
    text: "§ 1756(e): • **2.5%** of the first **$25,000** of total recovery. • **Up to 12%** of any recovery **above $25,000**. • Fee must be shown as two numbers in the contract.",
    sources: ["§ 1756(e) Del. Code"],
    tests: [
      { given: { recovery: 15000, fee_pct: 3 }, expect: "FAIL" },
      { given: { recovery: 60000, fee_first25: 2.5, fee_above: 12 }, expect: "PASS" }
    ]
  },
  {
    id: "de-contract-003",
    state: "DE",
    rule_id: "DE-PUBADJ-CONTRACT-003",
    version: "0.9",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "HIGH",
    sunset: undefined,
    category: "Public Adjuster Compliance",
    subcategory: "Contract Requirements",
    text: "§ 1756(b): • Written contract before services start. • Insured may cancel **until midnight of the 3rd business day** after signing; form must include 12‑pt cancellation notice. • Contract void if it fails statutory content.",
    sources: ["§ 1756(b) Del. Code"],
    tests: [
      { given: { cancel_days: 2, cancel_request: true }, expect: "FULL_REFUND" },
      { given: { cancel_days: 4, cancel_request: true }, expect: "STANDARD_TERMS" },
      { given: { contract_written: false }, expect: "FAIL" }
    ]
  },
  {
    id: "de-rec-004",
    state: "DE",
    rule_id: "DE-PUBADJ-REC-004",
    version: "0.9",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "HIGH",
    sunset: undefined,
    category: "Public Adjuster Compliance",
    subcategory: "Record Keeping",
    text: "§ 1754: Keep a complete file on each claim **for at least 5 years** and produce it to DOI on request.",
    sources: ["§ 1754 Del. Code"],
    tests: [
      { given: { retention_years: 4 }, expect: "FAIL" },
      { given: { retention_years: 6 }, expect: "PASS" }
    ]
  },
  {
    id: "de-solicit-005",
    state: "DE",
    rule_id: "DE-PUBADJ-SOLICIT-005",
    version: "0.9",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "HIGH",
    sunset: undefined,
    category: "Public Adjuster Compliance",
    subcategory: "Solicitation Rules",
    text: "§ 1756(d): a PA may not prevent or dissuade an insured from talking with the carrier, its adjuster, an attorney, or others about the claim. Fee‑sharing with unlicensed persons is prohibited.",
    sources: ["§ 1756(d) Del. Code"],
    tests: [
      { given: { dissuade: true }, expect: "FAIL" }
    ]
  },
  {
    id: "de-carrier-ack-006",
    state: "DE",
    rule_id: "DE-CARRIER-ACK-006",
    version: "0.9",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "REG",
    confidence: "HIGH",
    sunset: undefined,
    category: "Insurance Carrier Obligations",
    subcategory: "Claim Handling Timeframes",
    text: "18 DE Admin Code 902 (Unfair Claim Settlement Practices): • Acknowledge pertinent claim comms **within 15 days**. • Accept, deny, or explain status **within 30 days** of satisfactory proof‑of‑loss, then update every 30 days.",
    sources: ["18 DE Admin Code 902 §3.0"],
    tests: [
      { given: { ack_days: 17 }, expect: "FAIL" },
      { given: { days_since_pol: 35, no_reason: true }, expect: "FAIL" },
      { given: { ack_days: 10, days_since_pol: 20 }, expect: "PASS" }
    ]
  },
  {
    id: "de-carrier-pay-007",
    state: "DE",
    rule_id: "DE-CARRIER-PAY-007",
    version: "0.9",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "MEDIUM",
    sunset: undefined,
    category: "Insurance Carrier Obligations",
    subcategory: "Payment Requirements",
    text: "§ 2304(16) deems it an unfair practice to delay payment \"more than 30 days\" without reasonable justification; interest at the legal rate may apply in court.",
    sources: ["§ 2304 (16) Del. Code"],
    tests: [
      { given: { days_since_agree: 35, no_justification: true }, expect: "INTEREST_DUE" },
      { given: { days_since_agree: 20 }, expect: "PASS" }
    ]
  },
  {
    id: "de-law-badfaith-008",
    state: "DE",
    rule_id: "DE-LAW-BADFAITH-008",
    version: "0.9",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "CASE",
    confidence: "HIGH",
    sunset: undefined,
    category: "Legal Framework",
    subcategory: "Bad Faith Claims",
    text: "Delaware recognizes a first‑party bad‑faith tort. *Tackett v. State Farm*, 653 A.2d 254 (Del. 1995): insured must show (1) absence of reasonable justification and (2) recklessness or intentional conduct. Punitive damages available.",
    sources: ["*Tackett v. State Farm*, 653 A.2d 254 (Del. 1995)"],
    tests: [
      { given: { no_reasonable_basis: true, reckless: true }, expect: "BAD_FAITH_OK" },
      { given: { no_reasonable_basis: false }, expect: "NO_BAD_FAITH" }
    ]
  },
  {
    id: "de-prop-match-009",
    state: "DE",
    rule_id: "DE-PROP-MATCH-009",
    version: "0.9",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "ADVISORY",
    confidence: "LOW",
    sunset: "2027-06-30",
    category: "Construction Standards",
    subcategory: "Matching Requirements",
    text: "Delaware has **no matching statute, regulation, or controlling case** on roof/siding uniformity. Policy wording governs.",
    sources: ["MWL Matching Survey (2019)"],
    tests: [
      { given: { match: false }, expect: "POLICY_GOVERNS" }
    ]
  },
  {
    id: "de-law-sol-010",
    state: "DE",
    rule_id: "DE-LAW-SOL-010",
    version: "0.9",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "MEDIUM",
    sunset: undefined,
    category: "Legal Framework",
    subcategory: "Statute of Limitations",
    text: "Breach‑of‑contract SOL = **3 years** (10 Del. C. § 8106). Many HO policies shorten to **1 year**; Delaware courts enforce if conspicuous and not barred by statute.",
    sources: ["§ 8106 Del. Code"],
    tests: [
      { given: { years_since_dol: 4 }, expect: "FAIL" },
      { given: { months_since_dol: 14, policy_sol_months: 12 }, expect: "FAIL" }
    ]
  },
  {
    id: "de-res-doi-011",
    state: "DE",
    rule_id: "DE-RES-DOI-011",
    version: "0.9",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "AGENCY",
    confidence: "HIGH",
    sunset: undefined,
    category: "Professional Resources",
    subcategory: "Regulatory Contacts",
    text: "Delaware Department of Insurance 1351 W. North Street, Suite 101, Dover DE 19904 Consumer Services (302) 674‑7310 | insurance.delaware.gov",
    sources: ["DOI directory page"],
    tests: []
  }
];