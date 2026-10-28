import data from "@/data/info/rules.json";

export type RuleGroup = {
  id: string;
  title: string;
  items: string[];
};

type RulesContent = {
  section: { title: string; description: string };
  groups: RuleGroup[];
};

const rules = data satisfies RulesContent;

export function getRulesSection() {
  return rules.section;
}

export function getRuleGroups() {
  return rules.groups;
}