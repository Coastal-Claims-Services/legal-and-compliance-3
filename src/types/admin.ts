
export interface StateRule {
  id: string;
  state: string;
  rule_id: string;
  version: string;
  last_updated: string;
  authority_level: 'STATUTE' | 'REG' | 'ADVISORY' | 'CASE' | 'AGENCY';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  sunset?: string;
  category: 'Public Adjuster Compliance' | 'Insurance Carrier Obligations' | 'Legal Framework' | 'Construction Standards' | 'Professional Resources';
  subcategory: string;
  text: string;
  sources: string[];
  tests: Array<{
    given: Record<string, any>;
    expect: string;
  }>;
}

export interface ResponseTemplate {
  id: string;
  category: string;
  template: string;
  variables: string[];
  confidence: 'High' | 'Medium' | 'Low';
  lastUpdated: string;
}

export interface ComplianceAlert {
  id: string;
  state: string;
  type: 'Bond Expiration' | 'Rule Change' | 'Version Update' | 'Conflict Detected' | 'Sunset Warning';
  message: string;
  priority: 'High' | 'Medium' | 'Low';
  date: string;
  resolved: boolean;
  rule_id?: string;
}

export interface RuleTest {
  given: Record<string, any>;
  expect: string;
}

export interface RuleConflict {
  id: string;
  states: string[];
  rule_ids: string[];
  description: string;
  resolution: 'Manual Review' | 'Higher Protection' | 'Resolved';
  created: string;
}
