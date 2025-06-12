
import { StateRule } from '../types/admin';

export const KENTUCKY_RULES: StateRule[] = [
  {
    id: '1',
    state: 'Kentucky',
    rule_id: 'KY-PUBADJ-LIC-001',
    version: '1.0',
    last_updated: '2025-06-12',
    authority_level: 'STATUTE',
    confidence: 'HIGH',
    category: 'Public Adjuster Compliance',
    subcategory: 'License Requirements',
    text: 'A person may not act as a public adjuster in Kentucky without a license issued under KRS 304.9-430. Each licensee shall maintain a $50,000 surety bond or irrevocable letter of credit for the life of the license.',
    sources: ['KRS 304.9-430'],
    tests: [
      { given: { licensed: false }, expect: 'FAIL' },
      { given: { bond_amount: 30000 }, expect: 'FAIL' },
      { given: { licensed: true, bond_amount: 50000 }, expect: 'PASS' }
    ]
  },
  {
    id: '2',
    state: 'Kentucky',
    rule_id: 'KY-PUBADJ-REC-002',
    version: '1.0',
    last_updated: '2025-06-12',
    authority_level: 'STATUTE',
    confidence: 'MEDIUM',
    category: 'Public Adjuster Compliance',
    subcategory: 'Record Keeping',
    text: 'Keep every claim-related document for at least five (5) years after the file closes. Make the file available to DOI on request.',
    sources: ['DOI Records Schedule § 03094'],
    tests: [
      { given: { retention_years: 4 }, expect: 'FAIL' },
      { given: { retention_years: 6 }, expect: 'PASS' }
    ]
  },
  {
    id: '3',
    state: 'Kentucky',
    rule_id: 'KY-PUBADJ-FEES-003',
    version: '1.0',
    last_updated: '2025-06-12',
    authority_level: 'STATUTE',
    confidence: 'HIGH',
    category: 'Public Adjuster Compliance',
    subcategory: 'Fee Caps & Structures',
    text: 'Non-cat claims – fee ≤ 15% of total recovery. Cat claims – fee ≤ 10%. If the insurer pays or commits in writing to pay policy limits within seventy-two (72) hours of the first notice of loss, charge only a reasonable time-based fee.',
    sources: ['2023 HB 232 § 1(4)(c)'],
    tests: [
      { given: { cat: false, fee_pct: 18 }, expect: 'FAIL' },
      { given: { cat: true, fee_pct: 9 }, expect: 'PASS' },
      { given: { policy_limits_paid_hrs: 48, fee_type: 'percent' }, expect: 'FAIL' }
    ]
  },
  {
    id: '4',
    state: 'Kentucky',
    rule_id: 'KY-PUBADJ-CON-004',
    version: '1.0',
    last_updated: '2025-06-12',
    authority_level: 'REG',
    confidence: 'HIGH',
    category: 'Public Adjuster Compliance',
    subcategory: 'Contract Requirements',
    text: 'Use only a contract form pre-approved by DOI under 806 KAR 9:400. Provide duplicate originals to the insured and keep one copy. After a catastrophe you may file an "Intent to Contract" within three (3) business days and execute the full contract within seven (7) business days.',
    sources: ['806 KAR 9:400 § 2 & § 6'],
    tests: [
      { given: { contract_on_file: false }, expect: 'FAIL' },
      { given: { cat_event: true, intent_filed_days: 4 }, expect: 'FAIL' },
      { given: { cat_event: true, intent_filed_days: 2, full_contract_days: 6 }, expect: 'PASS' }
    ]
  },
  {
    id: '5',
    state: 'Kentucky',
    rule_id: 'KY-CARRIER-PAY-005',
    version: '1.0',
    last_updated: '2025-06-12',
    authority_level: 'STATUTE',
    confidence: 'HIGH',
    category: 'Insurance Carrier Obligations',
    subcategory: 'Payment Deadlines',
    text: 'The insurer must pay all undisputed amounts no later than thirty (30) days after receiving notice and proof of claim. Failure triggers 12% interest and, if the delay was without reasonable foundation, reasonable attorney fees.',
    sources: ['KRS 304.12-235(1)-(3)'],
    tests: [
      { given: { days_since_proof: 35, disputed: false }, expect: 'FAIL' },
      { given: { days_since_proof: 20, disputed: true }, expect: 'PASS' }
    ]
  },
  {
    id: '6',
    state: 'Kentucky',
    rule_id: 'KY-CARRIER-STAT-006',
    version: '1.0',
    last_updated: '2025-06-12',
    authority_level: 'REG',
    confidence: 'HIGH',
    sunset: '2028-11-30',
    category: 'Insurance Carrier Obligations',
    subcategory: 'Communication Standards',
    text: 'If the claim remains open, the insurer must send a written status letter within the first 30 days and every 45 days thereafter explaining why it has not yet settled and what remains outstanding.',
    sources: ['806 KAR 12:095 § 6(2)(d)'],
    tests: [
      { given: { last_status_days: 50 }, expect: 'FAIL' },
      { given: { last_status_days: 40 }, expect: 'PASS' }
    ]
  },
  {
    id: '7',
    state: 'Kentucky',
    rule_id: 'KY-PROP-MATCH-007',
    version: '1.0',
    last_updated: '2025-06-12',
    authority_level: 'REG',
    confidence: 'HIGH',
    sunset: '2028-11-30',
    category: 'Construction Standards',
    subcategory: 'Matching Requirements',
    text: 'If replacement items do not reasonably match in quality, color, and size, the insurer must replace all items in the area to achieve a reasonably uniform appearance. Applies to interior and exterior losses. No "line-of-sight" limitation is allowed.',
    sources: [
      '806 KAR 12:095 § 9(1)(b)',
      'DOI Advisory Opinion 2023-08'
    ],
    tests: [
      { given: { match: false }, expect: 'FULL_AREA_REPLACE' },
      { given: { match: true }, expect: 'PATCH_OK' }
    ]
  },
  {
    id: '8',
    state: 'Kentucky',
    rule_id: 'KY-LAW-FEESHIFT-008',
    version: '1.0',
    last_updated: '2025-06-12',
    authority_level: 'CASE',
    confidence: 'HIGH',
    category: 'Legal Framework',
    subcategory: 'Fee-Shifting Statutes',
    text: 'When § 235 interest attaches, Kentucky courts may also award attorney fees if the delay was without reasonable foundation. *Motorists Mut. v. Glass* confirms the combination is permissible.',
    sources: ['Motorists Mut. v. Glass, 996 S.W.2d 437 (Ky. 1997)'],
    tests: [
      { given: { delay_without_foundation: true }, expect: 'FEES_YES' },
      { given: { delay_without_foundation: false }, expect: 'FEES_NO' }
    ]
  },
  {
    id: '9',
    state: 'Kentucky',
    rule_id: 'KY-LAW-BADFAITH-009',
    version: '1.0',
    last_updated: '2025-06-12',
    authority_level: 'CASE',
    confidence: 'HIGH',
    category: 'Legal Framework',
    subcategory: 'Bad Faith Standards',
    text: 'To recover under common-law bad faith, the insured must prove the three *Wittmer* elements: (1) clear liability, (2) insurer knew or should have known the claim was legitimate, (3) intentional or reckless disregard for the insured\'s rights.',
    sources: ['Wittmer v. Jones, 864 S.W.2d 885 (Ky. 1993)'],
    tests: [
      { given: { wittmer_1: true, wittmer_2: true, wittmer_3: false }, expect: 'FAIL' },
      { given: { wittmer_1: true, wittmer_2: true, wittmer_3: true }, expect: 'PASS' }
    ]
  },
  {
    id: '10',
    state: 'Kentucky',
    rule_id: 'KY-RES-DOI-010',
    version: '1.0',
    last_updated: '2025-06-12',
    authority_level: 'AGENCY',
    confidence: 'HIGH',
    category: 'Professional Resources',
    subcategory: 'Regulatory Contacts',
    text: 'Kentucky Department of Insurance\n500 Mero Street, 2 SE 11, Frankfort KY 40601\nPhone 502-564-3630 | Toll-free 800-595-6053',
    sources: ['DOI Contact Page'],
    tests: []
  },
  {
    id: '11',
    state: 'Kentucky',
    rule_id: 'KY-PUBADJ-CON-011',
    version: '1.0',
    last_updated: '2025-06-12',
    authority_level: 'STATUTE',
    confidence: 'MEDIUM',
    category: 'Public Adjuster Compliance',
    subcategory: 'Contract Requirements',
    text: 'The insured may cancel the public adjuster contract without penalty by written notice within three (3) business days after execution.',
    sources: ['HB 232 § 1(5) draft language'],
    tests: [
      { given: { days_since_exec: 2, cancel_request: true }, expect: 'FULL_REFUND' },
      { given: { days_since_exec: 5, cancel_request: true }, expect: 'STANDARD_TERMS' }
    ]
  },
  {
    id: '12',
    state: 'Kentucky',
    rule_id: 'KY-PROP-CODE-012',
    version: '0.1',
    last_updated: '2025-06-12',
    authority_level: 'ADVISORY',
    confidence: 'LOW',
    sunset: '2026-06-30',
    category: 'Construction Standards',
    subcategory: 'Code Upgrade Triggers',
    text: 'Kentucky follows the 2018 International Residential Code with state amendments. No statute forces insurers to pay code-upgrade costs unless policy language grants it. Confirm local AHJ requirements.',
    sources: ['Kentucky Residential Code FAQ (planning cabinet memo, 2024-03-15) [to be added]'],
    tests: []
  }
];
