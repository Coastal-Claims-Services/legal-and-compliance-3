
import { StateRule } from '../types/admin';

export const hawaiiRules: StateRule[] = [
  {
    id: 'HI-001',
    state: 'Hawaii',
    rule_id: 'HI-PUBADJ-LIC-001',
    version: '0.9',
    last_updated: '2025-06-13',
    authority_level: 'STATUTE',
    confidence: 'HIGH',
    category: 'Public Adjuster Compliance',
    subcategory: 'License Requirements',
    text: 'A person may not act as a public adjuster in Hawaiʻi without a license issued under HRS § 431:9‑201. Each licensee shall maintain a surety bond of $10,000 for the life of the license. (§ 431:9‑223).',
    sources: ['§ 431:9‑223 HRS'],
    tests: [
      { given: { licensed: false }, expect: 'FAIL' },
      { given: { bond_amount: 5000 }, expect: 'FAIL' },
      { given: { licensed: true, bond_amount: 10000 }, expect: 'PASS' }
    ]
  },
  {
    id: 'HI-002',
    state: 'Hawaii',
    rule_id: 'HI-PUBADJ-CONTRACT-002',
    version: '0.9',
    last_updated: '2025-06-13',
    authority_level: 'STATUTE',
    confidence: 'HIGH',
    category: 'Public Adjuster Compliance',
    subcategory: 'Contract Requirements',
    text: 'A PA contract must be in writing and include: fee basis, bond attestation, three‑business‑day rescission right, and full disclosure of any financial interest (§ 431:9‑244(a)‑(f)). If the insurer pays or commits to policy limits within 72 hours of first notice, the PA may charge time‑based reasonable comp only (no percentage). (§ 431:9‑244(d)).',
    sources: ['§ 431:9‑244 HRS'],
    tests: [
      { given: { policy_limits_paid_hrs: 48, fee_type: "percent" }, expect: 'FAIL' },
      { given: { rescission_days: 2, cancel_request: true }, expect: 'FULL_REFUND' }
    ]
  },
  {
    id: 'HI-003',
    state: 'Hawaii',
    rule_id: 'HI-PUBADJ-FEES-003',
    version: '0.9',
    last_updated: '2025-06-13',
    authority_level: 'STATUTE',
    confidence: 'MEDIUM',
    category: 'Public Adjuster Compliance',
    subcategory: 'Fee Caps & Structures',
    text: 'Hawaiʻi sets no numeric fee cap. Compensation must be "reasonable" in the commissioner\'s judgment (§ 431:9‑244(c)). When fees are a percentage of the settlement, the exact percentage must appear in the contract.',
    sources: ['§ 431:9‑244(c) HRS'],
    tests: [
      { given: { fee_reasonable: false }, expect: 'FAIL' },
      { given: { fee_pct: 18, disclosed: true }, expect: 'PASS' }
    ]
  },
  {
    id: 'HI-004',
    state: 'Hawaii',
    rule_id: 'HI-CARRIER-RESP-004',
    version: '0.9',
    last_updated: '2025-06-13',
    authority_level: 'STATUTE',
    confidence: 'HIGH',
    category: 'Insurance Carrier Obligations',
    subcategory: 'Response Timeframes',
    text: 'An insurer must issue a written response with reasonable promptness, and in no case more than 15 working days, to communications about a claim. Failing to do so is an unfair practice. (HRS § 431:13‑103(a)(11)(B)).',
    sources: ['§ 431:13‑103(a)(11)(B) HRS'],
    tests: [
      { given: { response_days: 17 }, expect: 'FAIL' },
      { given: { response_days: 10 }, expect: 'PASS' }
    ]
  },
  {
    id: 'HI-005',
    state: 'Hawaii',
    rule_id: 'HI-PUBADJ-REC-005',
    version: '0.9',
    last_updated: '2025-06-13',
    authority_level: 'ADVISORY',
    confidence: 'LOW',
    sunset: '2026-12-31',
    category: 'Public Adjuster Compliance',
    subcategory: 'Record Keeping',
    text: 'Keep claim files for at least 5 years after final payment or denial. (Best‑practice advisory; not yet codified.)',
    sources: ['NAIC PA Model #228 § 18'],
    tests: [
      { given: { retention_years: 4 }, expect: 'FAIL' },
      { given: { retention_years: 6 }, expect: 'PASS' }
    ]
  },
  {
    id: 'HI-006',
    state: 'Hawaii',
    rule_id: 'HI-PROP-MATCH-006',
    version: '0.9',
    last_updated: '2025-06-13',
    authority_level: 'ADVISORY',
    confidence: 'LOW',
    sunset: '2027-06-30',
    category: 'Construction Standards',
    subcategory: 'Matching Requirements',
    text: 'Hawaiʻi has no matching statute, regulation, or reported case specific to roof/siding uniformity as of June 2025. Policy language controls. Adjusters should document "like kind & quality" and argue aesthetics under replacement‑cost valuation where policy is ambiguous.',
    sources: ['MWL 50‑State Survey (2022)'],
    tests: [
      { given: { match: false }, expect: 'POLICY_GOVERNS' }
    ]
  },
  {
    id: 'HI-007',
    state: 'Hawaii',
    rule_id: 'HI-LAW-SOL-007',
    version: '0.9',
    last_updated: '2025-06-13',
    authority_level: 'STATUTE',
    confidence: 'MEDIUM',
    category: 'Legal Framework',
    subcategory: 'Statute of Limitations',
    text: 'Written‑contract actions (including property‑insurance policies) must be filed within 6 years from the date the right to sue accrues. HRS § 657‑1(1). Policy language may not shorten the statutory SOL.',
    sources: ['§ 657‑1(1) HRS'],
    tests: [
      { given: { years_since_dol: 7 }, expect: 'FAIL' },
      { given: { years_since_dol: 5 }, expect: 'PASS' }
    ]
  },
  {
    id: 'HI-008',
    state: 'Hawaii',
    rule_id: 'HI-RES-DOI-008',
    version: '0.9',
    last_updated: '2025-06-13',
    authority_level: 'AGENCY',
    confidence: 'HIGH',
    category: 'Professional Resources',
    subcategory: 'Regulatory Contacts',
    text: 'Hawaiʻi Insurance Division, Dept. of Commerce & Consumer Affairs\n335 Merchant St., Room 213, Honolulu HI 96813\nPhone (808) 586‑2790 | Email insurance@dcca.hawaii.gov',
    sources: ['DCCA contact page'],
    tests: []
  }
];
