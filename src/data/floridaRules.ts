
import { StateRule } from '../types/admin';

export const floridaRules: StateRule[] = [
  {
    id: "fl-lic-001",
    state: "FL",
    rule_id: "FL-PUBADJ-LIC-001",
    version: "1.0",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "HIGH",
    category: "Public Adjuster Compliance",
    subcategory: "License Requirements",
    text: "A public adjuster must hold a license under § 626.865, Fla. Stat. A $50,000 surety bond (or irrevocable letter of credit) must remain in force for the life of the license and 1 year after termination.",
    sources: ["626.865 Fla. Stat."],
    tests: [
      { given: { licensed: false }, expect: "FAIL" },
      { given: { bond_amount: 25000 }, expect: "FAIL" },
      { given: { licensed: true, bond_amount: 50000 }, expect: "PASS" }
    ]
  },
  {
    id: "fl-fees-002",
    state: "FL",
    rule_id: "FL-PUBADJ-FEES-002",
    version: "1.0",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "HIGH",
    category: "Public Adjuster Compliance",
    subcategory: "Fee Caps & Structures",
    text: "Cat claims within the first year after a Governor-declared emergency: fee ≤ 10% of amounts paid. All other claims: fee ≤ 20%. Reopened/supplemental claims: cap stays 20%. Fee may not be calculated on the deductible. (§ 626.854(11)(b))",
    sources: ["626.854 Fla. Stat."],
    tests: [
      { given: { cat_event: true, fee_pct: 11 }, expect: "FAIL" },
      { given: { cat_event: false, fee_pct: 18 }, expect: "PASS" }
    ]
  },
  {
    id: "fl-contract-003",
    state: "FL",
    rule_id: "FL-PUBADJ-CONTRACT-003",
    version: "1.0",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "HIGH",
    category: "Public Adjuster Compliance",
    subcategory: "Contract Requirements",
    text: "Use DFS-approved form; 18-pt cancellation notice. No solicitation on Sunday; Mon-Sat only 8 a.m.–8 p.m. (§ 626.854(5)). No in-person/phone solicitation until 48 h after event unless insured initiates contact (§ 626.854(6)). Insured may cancel: normal claim → within 10 days of contract; cat event → 30 days after loss or 10 days after contract, whichever is longer. (§ 626.854(7)).",
    sources: ["626.854(5)-(7) Fla. Stat."],
    tests: [
      { given: { day: "Sunday", solicitation: true }, expect: "FAIL" },
      { given: { cancel_days: 8 }, expect: "FULL_REFUND" },
      { given: { hours_after_event: 30, solicitation: true }, expect: "PASS" }
    ]
  },
  {
    id: "fl-pay-004",
    state: "FL",
    rule_id: "FL-CARRIER-PAY-004",
    version: "1.0",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "HIGH",
    category: "Insurance Carrier Obligations",
    subcategory: "Payment Deadlines",
    text: "Insurer must pay or deny all or part of a property claim within 90 days of notice unless factors beyond its control reasonably prevent payment. Late sums bear statutory interest from notice date. (§ 627.70131(7)(a)).",
    sources: ["627.70131(7)(a) Fla. Stat."],
    tests: [
      { given: { days_since_notice: 95, no_exception: true }, expect: "FAIL" },
      { given: { days_since_notice: 70 }, expect: "PASS" }
    ]
  },
  {
    id: "fl-ack-005",
    state: "FL",
    rule_id: "FL-CARRIER-ACK-005",
    version: "1.0",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "HIGH",
    category: "Insurance Carrier Obligations",
    subcategory: "Response Timeframes",
    text: "Insurer must acknowledge claim communications within 7 days. If a physical inspection is required, complete it within 30 days of proof-of-loss. (§ 627.70131(1), (3)(b)).",
    sources: ["627.70131 Fla. Stat."],
    tests: [
      { given: { ack_days: 10 }, expect: "FAIL" },
      { given: { inspection_days: 25 }, expect: "PASS" }
    ]
  },
  {
    id: "fl-fees-006",
    state: "FL",
    rule_id: "FL-LAW-FEES-006",
    version: "1.0",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "HIGH",
    category: "Legal Framework",
    subcategory: "Fee-Shifting Statutes",
    text: "SB 2-A (Dec 2022) removed one-way attorney-fee rights for residential & commercial property suits. §§ 627.428, 626.9373, 627.70152 no longer apply to property policies issued on or after 12-16-2022.",
    sources: ["SB 2-A summary"],
    tests: [
      { given: { policy_issue_date: "2023-01-05", seeks_one_way_fees: true }, expect: "DENY" }
    ]
  },
  {
    id: "fl-notice-007",
    state: "FL",
    rule_id: "FL-PROP-NOTICE-007",
    version: "1.0",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "HIGH",
    category: "Legal Framework",
    subcategory: "Statute of Limitations",
    text: "Initial/reopened claims: notice to insurer within 1 year of DOL. Supplemental claims: notice within 18 months of DOL. (§ 627.70132).",
    sources: ["627.70132 Fla. Stat."],
    tests: [
      { given: { notice_days: 400 }, expect: "FAIL" },
      { given: { notice_days: 200 }, expect: "PASS" }
    ]
  },
  {
    id: "fl-roof-008",
    state: "FL",
    rule_id: "FL-PROP-ROOF-008",
    version: "1.0",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "HIGH",
    sunset: "2028-05-26",
    category: "Construction Standards",
    subcategory: "Code Upgrade Triggers",
    text: "When ≥ 25% of a roof section is repaired on a roof built to the 2007 FBC or later, only that section must meet current code. Full replacement is no longer automatic. (SB 4-D, FBC Existing 706.1.1).",
    sources: ["SB 4-D summary"],
    tests: [
      { given: { roof_percent: 30, year_built: 2015 }, expect: "SECTION_ONLY" }
    ]
  },
  {
    id: "fl-solicit-009",
    state: "FL",
    rule_id: "FL-PUBADJ-SOLICIT-009",
    version: "1.0",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "HIGH",
    category: "Public Adjuster Compliance",
    subcategory: "Contact Restrictions",
    text: "No public-adjuster solicitation on Sundays. Mon-Sat only, from 8 a.m. to 8 p.m. (§ 626.854(5)).",
    sources: ["626.854(5) Fla. Stat."],
    tests: [
      { given: { day: "Sunday" }, expect: "FAIL" },
      { given: { hour: "19:00" }, expect: "PASS" }
    ]
  },
  {
    id: "fl-dfs-010",
    state: "FL",
    rule_id: "FL-RES-DFS-010",
    version: "1.0",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "AGENCY",
    confidence: "HIGH",
    category: "Professional Resources",
    subcategory: "Regulatory Contacts",
    text: "Florida Department of Financial Services, Agent & Agency Services – Licensing, 200 E. Gaines St., Tallahassee FL 32399, Licensing: (850) 413-3137 | Consumer Helpline: (877) 693-5236",
    sources: ["DFS website"],
    tests: []
  },
  {
    id: "fl-match-011",
    state: "FL",
    rule_id: "FL-PROP-MATCH-011",
    version: "1.0",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "HIGH",
    category: "Construction Standards",
    subcategory: "Matching Requirements",
    text: "If replaced items do not match, insurer must make reasonable repairs or replace items in adjoining areas to create a uniform appearance. Applies to homeowner forms only. (§ 626.9744).",
    sources: ["§626.9744 Fla. Stat."],
    tests: [
      { given: { policy_type: "HO", match: false }, expect: "ADJOIN_AREA_REPAIR" },
      { given: { policy_type: "COMM", match: false }, expect: "STATUTE_NOT_APPLICABLE" }
    ]
  },
  {
    id: "fl-match-012",
    state: "FL",
    rule_id: "FL-PROP-MATCH-012",
    version: "0.9",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "CASE",
    confidence: "HIGH",
    category: "Construction Standards",
    subcategory: "Matching Requirements",
    text: "Strasser v. Nationwide – statute does not apply to commercial forms. Vazquez v. Citizens – matching costs are replacement-cost dollars, not owed until incurred.",
    sources: ["Strasser, 2010 WL 667945 (S.D. Fla.)", "Vazquez, 304 So.3d 1280 (Fla. 3d DCA 2019)"],
    tests: [
      { given: { policy_type: "COMM" }, expect: "STATUTE_NOT_APPLICABLE" },
      { given: { repair_started: false }, expect: "MATCH_COST_DEFERRED" }
    ]
  },
  {
    id: "fl-aob-013",
    state: "FL",
    rule_id: "FL-PROP-AOB-013",
    version: "1.0",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "HIGH",
    category: "Legal Framework",
    subcategory: "Multi-State Jurisdiction",
    text: "Post-loss benefits may be assigned only via an agreement meeting § 627.7152 requirements: AOB must (a) be in writing; (b) itemize services & materials; (c) include 14-day rescission right; (d) bar penalties for cancellation; (e) prohibit assignee attorney-fee shifting. Applies to residential & commercial property.",
    sources: ["§627.7152 Fla. Stat."],
    tests: [
      { given: { aob_fee_shift: true }, expect: "FAIL" }
    ]
  },
  {
    id: "fl-noi-014",
    state: "FL",
    rule_id: "FL-PROP-NOI-014",
    version: "1.0",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "HIGH",
    category: "Legal Framework",
    subcategory: "Court Procedures",
    text: "Before filing suit under a property policy, claimant must serve DFS with a Notice of Intent to Initiate Litigation (NOI) ≥ 10 business days before suit. Insurer must respond within 10 business days. (§ 627.70152).",
    sources: ["§627.70152 Fla. Stat."],
    tests: [
      { given: { days_before_suit: 7 }, expect: "FAIL" },
      { given: { days_before_suit: 12 }, expect: "PASS" }
    ]
  },
  {
    id: "fl-crn-015",
    state: "FL",
    rule_id: "FL-LAW-CRN-015",
    version: "1.0",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "HIGH",
    category: "Legal Framework",
    subcategory: "Bad Faith Standards",
    text: "To allege statutory bad faith, an insured must file a Civil Remedy Notice with DFS and serve the insurer 60 days before suit. (§ 624.155).",
    sources: ["§624.155 Fla. Stat."],
    tests: [
      { given: { crn_days: 45 }, expect: "FAIL" },
      { given: { crn_days: 65 }, expect: "PASS" }
    ]
  },
  {
    id: "fl-badfaith-016",
    state: "FL",
    rule_id: "FL-LAW-BADFAITH-016",
    version: "1.0",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "HIGH",
    category: "Legal Framework",
    subcategory: "Bad Faith Standards",
    text: "A first-party bad-faith action may not proceed until the insured first wins an adjudication that the insurer breached the contract. (§ 624.1551).",
    sources: ["§624.1551 Fla. Stat."],
    tests: [
      { given: { breach_proved: false }, expect: "BAD_FAITH_BAR" },
      { given: { breach_proved: true }, expect: "BAD_FAITH_OK" }
    ]
  },
  {
    id: "fl-sol-017",
    state: "FL",
    rule_id: "FL-LAW-SOL-017",
    version: "0.9",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "MEDIUM",
    category: "Legal Framework",
    subcategory: "Statute of Limitations",
    text: "Action for breach of a property-insurance contract must be filed within 5 years from date of loss. (§ 95.11(2)(e)). The time may not be shortened by policy language (§ 95.03). (Note: SB 76 shortened notice to insurer, not the lawsuit SOL.)",
    sources: ["§95.11(2)(e) Fla. Stat."],
    tests: [
      { given: { years_since_dol: 6 }, expect: "FAIL" },
      { given: { years_since_dol: 4 }, expect: "PASS" }
    ]
  },
  {
    id: "fl-adr-018",
    state: "FL",
    rule_id: "FL-PROP-ADR-018",
    version: "0.9",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "HIGH",
    category: "Legal Framework",
    subcategory: "Discovery Rules",
    text: "DFS mediation available for residential claims ≤ $100,000. (§ 627.7015). Where policy requires appraisal, parties must follow § 627.70151 to avoid conflicts of interest (disclosure & impartiality rules).",
    sources: ["§627.7015 Fla. Stat.", "§627.70151 Fla. Stat."],
    tests: [
      { given: { claim_amt: 120000 }, expect: "MEDIATION_NOT_AVAILABLE" },
      { given: { claim_amt: 80000 }, expect: "MEDIATION_OFFER" }
    ]
  },
  {
    id: "fl-rec-019",
    state: "FL",
    rule_id: "FL-PUBADJ-REC-019",
    version: "1.0",
    last_updated: "2025-06-13T00:00:00.000Z",
    authority_level: "STATUTE",
    confidence: "HIGH",
    category: "Public Adjuster Compliance",
    subcategory: "Record Keeping",
    text: "A public adjuster must keep every document relating to a claim for at least 5 years after completion of the adjustment and make them available to DFS on request. (§ 626.875).",
    sources: ["§626.875 Fla. Stat."],
    tests: [
      { given: { retention_years: 4 }, expect: "FAIL" },
      { given: { retention_years: 6 }, expect: "PASS" }
    ]
  }
];
