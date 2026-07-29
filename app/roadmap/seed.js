// Default content for the RYO Filter implementation guide.
// This is the fallback the page renders when nothing has been saved to storage yet,
// and the baseline the "Reset to original" action restores.
// Source: 05-Beginner-Step-by-Step-Guide (EN).pdf, prepared 28 July 2026.

export const GUIDE_VERSION = 2;

export const seedDoc = {
  version: GUIDE_VERSION,
  title: 'RYO Filter — Step-by-Step Implementation Guide',
  subtitle: 'The execution sequence from the earliest stage to the first sale',
  branches: [],
  intro: [
    {
      id: 'intro-1',
      text: 'This document sets out the implementation steps in order, from the earliest stage through the first sale, in plain language. Each step covers four elements: what, how, what to prepare, and the expected result. Prepared 28 July 2026.',
    },
    {
      id: 'intro-2',
      text: 'The (!) mark indicates items that must not be assumed and require confirmation from the relevant authority or a consultant. Existing assets: PT ITSFR together with its export and filter-rod production licenses. Consequently, most steps add a new line rather than establish a new company.',
    },
  ],
  parts: [
    {
      id: 'part-a',
      label: 'PART A — PREPARATION (Week 1)',
      lead: '',
      steps: [
        {
          id: 'step-1',
          num: '1',
          title: 'Create a product sample',
          needsConfirmation: false,
          fields: [
            {
              id: 'step-1-what',
              label: 'What',
              text: 'A physical example of the RYO filter to be sold.',
            },
            {
              id: 'step-1-how',
              label: 'How',
              text: 'Take a filter rod produced by ITSFR, cut it to RYO size (typically around 15 mm), then pack a few sticks in simple packaging.',
            },
            {
              id: 'step-1-prepare',
              label: 'Prepare',
              text: '3–5 samples in plastic or a small box.',
            },
            {
              id: 'step-1-result',
              label: 'Result',
              text: 'Samples ready to present to Customs and for photo documentation.',
            },
          ],
        },
        {
          id: 'step-2',
          num: '2',
          title: 'Write the product specification (one page)',
          needsConfirmation: false,
          fields: [
            {
              id: 'step-2-what',
              label: 'What',
              text: 'A data sheet describing the product.',
            },
            {
              id: 'step-2-how',
              label: 'How',
              text: 'Prepare one page listing the working name, material (cellulose acetate), diameter (mm), length (mm), weight per stick, and quantity per pack, with the emphasis: NO tobacco.',
            },
            {
              id: 'step-2-prepare',
              label: 'Prepare',
              text: 'A one-page Word or PDF file.',
            },
            {
              id: 'step-2-result',
              label: 'Result',
              text: 'A supporting document for the excise consultation and HS code determination.',
            },
          ],
        },
      ],
      footnote: 'Steps 1 and 2 are the foundation. Without them, the following steps cannot proceed.',
      callout: null,
    },
    {
      id: 'part-b',
      label: 'PART B — THREE KEY DECISIONS (Weeks 1–3, done in parallel)',
      lead: 'The following three steps determine the overall business direction and should be carried out simultaneously.',
      steps: [
        {
          id: 'step-3',
          num: '3',
          title: 'Excise consultation with Customs (DJBC) — top priority',
          needsConfirmation: true,
          fields: [
            {
              id: 'step-3-what',
              label: 'What',
              text: 'Confirming whether the product is subject to excise.',
            },
            {
              id: 'step-3-why',
              label: 'Why it matters',
              text: 'Excise status changes the cost structure and rules entirely, so it must be known first.',
            },
            {
              id: 'step-3-how',
              label: 'How',
              text: '1. Prepare a letter requesting consultation or classification (a draft is available as a separate document).\n2. Visit the Customs Office in the region of the ITSFR factory, bringing the letter, the sample (Step 1), and the specification (Step 2).\n3. Ask clearly: is a retail acetate filter without tobacco subject to excise, and does it require an NPPBKC license and excise bands.',
            },
            {
              id: 'step-3-result',
              label: 'Result',
              text: 'An official answer or letter from DJBC — the key document.',
            },
          ],
        },
        {
          id: 'step-4',
          num: '4',
          title: 'Confirm the HS code',
          needsConfirmation: false,
          fields: [
            {
              id: 'step-4-what',
              label: 'What',
              text: 'The goods classification code for export, which determines duties and documents.',
            },
            {
              id: 'step-4-how',
              label: 'How',
              text: 'Ask Customs (can be combined with Step 3) or a freight forwarder/export consultant for the HS code for retail acetate filter tips.',
            },
            {
              id: 'step-4-result',
              label: 'Result',
              text: 'A single HS code used across all export documents.',
            },
          ],
        },
        {
          id: 'step-5',
          num: '5',
          title: 'Check brand name availability (no cost)',
          needsConfirmation: false,
          fields: [
            {
              id: 'step-5-what',
              label: 'What',
              text: 'Confirming the desired name is not already in use.',
            },
            {
              id: 'step-5-how',
              label: 'How',
              text: '1. Prepare 3–5 candidate names.\n2. Open pdki-indonesia.dgip.go.id, search each name, and check its registration status.\n3. If there is a conflict, replace it with an available name.',
            },
            {
              id: 'step-5-result',
              label: 'Result',
              text: 'At least one name that is safe to use.',
            },
          ],
        },
      ],
      footnote: '',
      callout: {
        id: 'callout-part-c',
        tone: 'warn',
        text: '(!) Part C must not begin before the answer to Step 3 is available. Excise status determines every subsequent stage.',
      },
    },
    {
      id: 'part-c',
      label: 'PART C — BUSINESS LICENSING (Weeks 3–6, after excise status is clear)',
      lead: '',
      steps: [
        {
          id: 'step-6',
          num: '6',
          title: 'Add a KBLI code in OSS',
          needsConfirmation: true,
          fields: [
            {
              id: 'step-6-what',
              label: 'What',
              text: 'Adding a permit so the company is officially allowed to produce the RYO filter line.',
            },
            {
              id: 'step-6-how',
              label: 'How',
              text: '1. Log in to oss.go.id with the PT ITSFR account.\n2. Review the existing NIB, then add the KBLI for the acetate component/goods industry (confirm the correct code with a consultant).\n3. Ensure the Industrial Business License (IUI) covers the RYO filter.',
            },
            {
              id: 'step-6-result',
              label: 'Result',
              text: 'An NIB, KBLI, and IUI that cover the new product.',
            },
          ],
        },
        {
          id: 'step-7',
          num: '7',
          title: 'Confirm the environmental permit',
          needsConfirmation: true,
          fields: [
            {
              id: 'step-7-what',
              label: 'What',
              text: 'Ensuring the existing factory environmental permit already covers the new activity.',
            },
            {
              id: 'step-7-how',
              label: 'How',
              text: 'Confirm with the factory permit manager or the Environmental Agency whether the existing AMDAL/UKL-UPL permit is sufficient for the RYO cutting and packing process.',
            },
            {
              id: 'step-7-result',
              label: 'Result',
              text: 'Written confirmation, or assurance that no new permit is required.',
            },
          ],
        },
      ],
      footnote: '',
      callout: null,
    },
    {
      id: 'part-d',
      label: 'PART D — READY TO SELL: TAKE THE FASTEST ROUTE FIRST',
      lead: 'Primary recommendation: start with OEM export because the legal burden is lightest and the permits already exist. An own brand is developed at a later stage.',
      steps: [
        {
          id: 'step-8',
          num: '8',
          title: 'Prepare labels and packaging',
          needsConfirmation: false,
          fields: [
            {
              id: 'step-8-what',
              label: 'What',
              text: 'Packaging design that meets the requirements.',
            },
            {
              id: 'step-8-how',
              label: 'How',
              text: 'Domestic: state the product name, manufacturer and address, contents, net weight, and material.\nEU export: must add the statement "This product contains plastic" with a pictogram per the SUPD rules.',
            },
            {
              id: 'step-8-result',
              label: 'Result',
              text: 'Print-ready packaging design for each market.',
            },
          ],
        },
        {
          id: 'step-9',
          num: '9',
          title: 'Explore OEM export buyers',
          needsConfirmation: false,
          fields: [
            {
              id: 'step-9-what',
              label: 'What',
              text: 'Identifying 3–5 prospective B2B buyers abroad.',
            },
            {
              id: 'step-9-how',
              label: 'How',
              text: "Leverage ITSFR's existing network, agents, and customer base for filter rods, then offer the retail RYO version.",
            },
            {
              id: 'step-9-result',
              label: 'Result',
              text: 'A list of prospective buyers with initial indications of interest.',
            },
          ],
        },
        {
          id: 'step-10',
          num: '10',
          title: 'Execute the first OEM export transaction',
          needsConfirmation: false,
          fields: [
            {
              id: 'step-10-what',
              label: 'What',
              text: 'The first legitimate sale.',
            },
            {
              id: 'step-10-how',
              label: 'How',
              text: 'Use the HS code (Step 4), export documents (PEB, invoice, packing list), and SUPD-labeled packaging. The EPR burden is borne by the EU importer.',
            },
            {
              id: 'step-10-result',
              label: 'Result',
              text: 'The first legal transaction.',
            },
          ],
        },
      ],
      footnote: '',
      callout: null,
    },
    {
      id: 'part-e',
      label: 'PART E — LATER PHASE: OWN BRAND (once cash flow is running)',
      lead: '',
      steps: [
        {
          id: 'step-11',
          num: '11',
          title: 'Lock the name and design, then register IP',
          needsConfirmation: false,
          fields: [
            {
              id: 'step-11-how',
              label: 'How',
              text: 'Finalize the name (that passed Step 5) and logo, then register the trademark at DJKI. For the EU market, file separately at EUIPO.',
            },
            {
              id: 'step-11-result',
              label: 'Result',
              text: 'A registered trademark.',
            },
          ],
        },
        {
          id: 'step-12',
          num: '12',
          title: 'Review advertising rules (Government Regulation 28/2024)',
          needsConfirmation: true,
          fields: [
            {
              id: 'step-12-how',
              label: 'How',
              text: 'Have a consultant check promotion limits for selling an own brand to consumers.',
            },
            {
              id: 'step-12-result',
              label: 'Result',
              text: 'Guidance on what promotion is and is not allowed.',
            },
          ],
        },
        {
          id: 'step-13',
          num: '13',
          title: 'Own-brand export to the EU: appoint an EPR Authorized Representative',
          needsConfirmation: true,
          fields: [
            {
              id: 'step-13-how',
              label: 'How',
              text: 'For each EU destination country, appoint an Authorized Representative, register, and pay the EPR fee. Rules tighten further from 12 August 2026.',
            },
            {
              id: 'step-13-result',
              label: 'Result',
              text: 'Legal basis to sell the own brand directly to the EU market.',
            },
          ],
        },
      ],
      footnote: '',
      callout: null,
    },
  ],
  quickMap: {
    title: 'QUICK MAP — SCHEDULE SUMMARY',
    rows: [
      {
        id: 'qm-1',
        when: 'Week 1',
        what: 'Steps 1–2 — Sample + Specification',
        key: false,
        sub: '',
      },
      {
        id: 'qm-2',
        when: 'Weeks 1–3',
        what: 'Steps 3–5 — Excise (priority) + HS code + Name check   [KEY]',
        key: true,
        sub: '(await the excise answer)',
      },
      {
        id: 'qm-3',
        when: 'Weeks 3–6',
        what: 'Steps 6–7 — Add KBLI + Environmental permit',
        key: false,
        sub: '',
      },
      {
        id: 'qm-4',
        when: 'Ready to sell',
        what: 'Steps 8–10 — Label → find buyer → OEM export',
        key: false,
        sub: '',
      },
      {
        id: 'qm-5',
        when: 'Later phase',
        what: 'Steps 11–13 — Own brand: IP + advertising + EU EPR',
        key: false,
        sub: '',
      },
    ],
    rule: 'Execution rule: begin with Step 1 first. Steps 8–13 belong to a later stage. Focus on one step at a time.',
  },
  related: 'Related documents: 01 regulations · 02 legalization steps · 03 target matrix · 04 seven legal components.',
};
