/* FenceLine prototype v3 · sample data (moved unchanged from v2), plus simulated values for the mockup screens */
"use strict";
const CONFIG = { version: "v3", built: "2026-11-22", versionTag: "v3 · guided tour", contactEmail: "olanin@hawk.illinoistech.edu" };


const DATA = {
 project: {
  town: "New Albany, Ohio", townShort: "New Albany, OH",
  project: "Amazon Data Services (AWS) data-center campus, Beech & Miller Rd",
  board: "New Albany City Council",
  vote: "Sept 19, 2023, Resolution R-41-2023", voteWhat: "the tax agreement with Amazon Data Services, Inc. (signed text not online)", voteSources: ["S26"],
  passedBy: "The city administrator or planning office, with the staff report",
  county_reviewer: "Licking County Tax Incentive Review Council (TIRC)"
 },
 texts: {
  disclaimer: "Research prototype with real public documents; simulated values are marked. Not a verification or certification. Not affiliated with the City of New Albany, Amazon or Google.",
  neutrality: "We suggest questions. We never recommend a vote.",
  simTip: "Made-up value so you can react to the format. Not real data.",
  evidenceMissing: "No public evidence yet. That alone does not mean it was missed.",
  timeframe: "Retrospective demo: written as if before the Sept 2023 vote, from what is public today (including later sources).",
  forCouncil: "Covers the applicant's claims, not the city's own work.",
  techNote: "We show who produced each study. Checking the engineering stays with your reviewer.",
  offer: "Want an outline of a pilot for one hearing? Reply to our email.",
  studentLine: "Student research, not a service offer. We are testing whether a brief like this helps a council before a vote.",
  modelCode: "A model data-center code could require an independent pre-vote summary like this one, paid through the applicant's escrow.",
  aiUse: "AI use: built with Claude from public documents, simulated data and officials' written feedback; facts and labels checked by the team."
 },
 position: {
  adds: "One page for council. Each claim is labelled by what can be checked before the vote, with its source, who produced it and a question to ask.",
  repeats: "Figures and studies already in your staff report. We cite them; we don't redo them.",
  cannot: "Whether figures are right, the engineering of noise, heat or water studies, terms or data that aren't public, or how to vote.",
  foot: "Could be prepared with your existing consultants."
 },
 copy: {
  startKicker: "For councils and town staff reviewing data-center proposals",
  startH1: "Know which developer claims are documented, before council votes.", startH1Em: "documented",
  startLede: "A one-page brief for council: each claim labelled documented, forecast or no public source yet, with who prepared it and a question for the applicant.",
  trust: [["shield", "Proposed: paid through an escrow the town controls"], ["lock", "The town controls scope and publication"], ["question", "We never recommend a vote"]],
  sampleLine: "Sample brief: Amazon Data Services (AWS) campus, New Albany, Ohio. Real public documents; made-up values carry this badge:",
  briefCard: "One page for the board packet, on top of your staff report and existing studies.",
  recordCard: "Each year: every commitment's owner, due date, evidence and status, with every change logged.",
  recordH1: "New Albany, Ohio"
 },

 sources: [
  { id: "S1", title: "City of New Albany data-center website", acc: "n12", links: [{ u: "https://datacenters.newalbanyohio.org/" }] },
  { id: "S2", title: "City Finances page", acc: "n12", links: [{ u: "https://datacenters.newalbanyohio.org/city-finances/" }] },
  { id: "S3", title: "Resident questions page (city data-center site)", acc: "n12", links: [{ u: "https://datacenters.newalbanyohio.org/resident-questions/" }] },
  { id: "S5", title: "Sample data-center tax agreement (Community Reinvestment Area, CRA)", acc: "n12", links: [{ u: "https://datacenters.newalbanyohio.org/wp-content/uploads/2026/08/Sample-Data-Center-CRA-Agreement.pdf" }] },
  { id: "S6", title: "Sample data-center water memorandum of understanding (MOU)", acc: "n12", links: [{ u: "https://datacenters.newalbanyohio.org/wp-content/uploads/2026/08/Sample-Data-Center-Water-MOU.pdf" }] },
  { id: "S10", title: "Council agenda, Sept 1, 2026 (lists Resolution R-39-2026)", acc: "n17", links: [{ u: "https://newalbanyohio.org/wp-content/uploads/2026/08/Council-Agenda-9-1-26.pdf" }] },
  { id: "S13", title: "Franklin County review packet for New Albany (2021)", acc: "n12", links: [{ u: "https://gis.franklincountyohio.gov/Assets/tirc/2021TY2020/packets/New%20Albany%20Packet.pdf" }] },
  { id: "S17", title: "News on the AWS deal", acc: "n12", links: [
    { u: "https://www.yahoo.com/finance/news/amazon-spend-3-5-billion-232127332.html", label: "Columbus Dispatch via Yahoo" },
    { u: "https://www.datacenterfrontier.com/site-selection/article/33011941/aws-readies-35b-for-5-more-ohio-data-centers-in-booming-columbus-suburb-new-albany", label: "Data Center Frontier" } ] },
  { id: "S21", title: "Ohio Revised Code § 5709.85 (version effective Apr 6, 2023)", acc: "n17", links: [{ u: "https://codes.ohio.gov/ohio-revised-code/section-5709.85" }] },
  { id: "S22", title: "SRC EvalMetrics analysis, Oct 3, 2026", secondary: true, acc: "n12", links: [{ u: "https://srcevalmetrics.com/insights/data-center-tax-abatement-report-card" }] },
  { id: "S23", title: "CitizenPortal meeting summary, Oct 6, 2026 (no author)", secondary: true, acc: "n12", links: [{ u: "https://citizenportal.ai/articles/10611310/Ohio/Franklin-County/New-Albany/Council-affirms-taxincentive-review-council-recommendations-for-Franklin-and-Licking-counties" }] },
  { id: "S26", title: "Council agenda, Sept 19, 2023 (Resolution R-41-2023)", acc: "n17", links: [{ u: "https://newalbanyohio.org/wp-content/uploads/2020/03/Council-Agenda-9-19-23.pdf" }] },
  { id: "S29", title: "Council agenda, Oct 6, 2026 (lists Resolutions R-38-2026 and R-39-2026)", acc: "n17", links: [{ u: "https://newalbanyohio.org/wp-content/uploads/2026/09/Council-Agenda-10-6-26.pdf" }] },
  { id: "S27", title: "City news: Amazon investment in New Albany (Aug 2025)", acc: "n17", links: [{ u: "https://newalbanyohio.org/news/2025/08/amazon-investment-in-new-albany/" }] },
  { id: "S28", title: "City news: Amazon announcements (date not shown)", acc: "n17", links: [{ u: "https://newalbanyohio.org/?p=48362" }] }
 ],
 accessed: { n12: "Nov 12, 2026", n17: "Nov 17, 2026" },

 sections: [
  { id: "fiscal", title: "Fiscal and tax claims", icon: "coin", claims: ["B3", "B4", "B5", "B2", "B1"] },
  { id: "tech", title: "Noise, heat and other technical claims", icon: "thermo", introKey: "techNote", claims: ["B7", "B6"] }
 ],
 topicIcon: { Taxes: "coin", Jobs: "user", Investment: "bldg", Noise: "sound", Water: "drop" },
 claims: [
  { id: "B1", topic: "Investment", claim: "$3.5B in data centers; construction from 2025, finished by Dec 31, 2030", label: "No public source yet", note: "News reports these as agreement terms. The agreement is not online.", sources: ["S17"],
    by: "News media", byFull: "News reports (Columbus Dispatch, Data Center Frontier), citing the agreement.", ask: "Is $3.5B a minimum in the agreement, and what happens if it is smaller or later?" },
  { id: "B2", topic: "Jobs", claim: "About 105 jobs and $9M payroll", label: "No public source yet", note: "News only; the agreement is not online. The city template sets minimum jobs and payroll (§2).", sources: ["S17", "S5"],
    by: "News media · city template", byFull: "Figures from news reports; the minimums rule from a city template.", ask: "Are these minimums in the agreement, and who checks the reported numbers?" },
  { id: "B3", topic: "Taxes", claim: "At least $352,750 a year to the city, rising over time", label: "No public source yet", note: "News only. The city template sets a minimum yearly payment (§5a) and a 10% late penalty (§5c).", sources: ["S17", "S5"],
    by: "News media · city template", byFull: "Figure from news reports; payment and penalty rules from a city template.", ask: "Will paid-versus-owed amounts be reported each year, and to whom?" },
  { id: "B4", topic: "Taxes", claim: "Property-tax break: 100% for 15 years, then 75% for 15 years", label: "No public source yet", note: "News only. The agreement is not online.", sources: ["S17"],
    by: "News media", byFull: "News reports.", ask: "Which review packet will show this deal each year, and will it be public?" },
  { id: "B5", topic: "Taxes", claim: "A county council reviews every tax-break deal each year. City Council then votes on its recommendations within 60 days.", label: "Documented", note: "A general rule, not an AWS-specific term: Ohio law § 5709.85(C), (E), repeated in the city template (§3).", sources: ["S21", "S5"],
    by: "State law · city template", byFull: "Ohio Revised Code; repeated in a city template.", ask: "Who collects the company's numbers for the review?" },
  { id: "B6", topic: "Water", claim: "The city's template water agreement: the city supplies water to the site edge, and the developer gives 36 months' notice before each phase.", label: "Documented", note: "Background only: the template has no cap on use, no reporting and no penalty. The AWS water memorandum (MOU) is not public.", sources: ["S6", "S26"],
    by: "City staff (template)", byFull: "City template document.", ask: "Will water use be reported, and to whom?" },
  { id: "B7", topic: "Noise", claim: "No noise commitment found for this project", label: "No public source yet", note: "Nearby, residents complained about Google's fan noise in Sept 2025 (after this vote; shown for format).", sources: ["S3"],
    by: "Nearby developer, relayed by the city", byFull: "Google (nearby project), relayed on the city's resident page. No study found for this project.", ask: "What noise limit applies, and who measures it?" }
 ],

 hearingQuestions: [
  "Which of these figures will become minimums or conditions of approval, and which stay estimates?",
  "Will the yearly review packet for this deal be public, and where?",
  "Who tracks these commitments after the vote, and how will council hear about them?"
 ],

 commitments: [
  { id: "C1", title: "Jobs and payroll", group: "aws", project: "AWS campus", type: "Agreement term", basis: "reported in news; signed agreement not online",
    owner: "Amazon Data Services, Inc. (AWS)", checks: "City Finance and Community Development collect data each spring. Licking County Tax Incentive Review Council (TIRC) reviews it. City Council votes.",
    cadence: "Yearly", due: "July 2027 review", dueNote: "estimate", dueSim: true, dueKey: "2027-07-31",
    promised: "About 105 jobs and $9M payroll.", promisedSources: ["S17", { id: "S5", loc: "template §2" }],
    status: "Tracked by the city, figures withheld", reason: "The city collects these figures each spring for the county's yearly review. Per-company figures are not on city or county sites.", reasonSources: ["S21", { id: "S5", loc: "template §3" }],
    evidence: [
     { date: "2026-07", item: "Licking County TIRC review held", src: { id: "S22", note: "secondary" } },
     { date: "2026-09-01", item: "Council agenda lists Resolution R-39-2026, affirming the county review council's recommendations", src: { id: "S10" } },
     { date: "2026-10-06", item: "Council agenda lists Resolution R-39-2026 under resolutions and public hearing", src: { id: "S29" } },
     { date: "2026-10-06", item: "City Council kept the deal", src: { id: "S23", note: "secondary; minutes pending" } } ],
    change: "Moves to Not yet due for 2027 if the city shares or publishes the 2026 jobs and payroll figures." },
  { id: "C2", title: "Minimum yearly payment to the city", group: "aws", project: "AWS campus", type: "Agreement term", basis: "reported in news; signed agreement not online",
    owner: "Amazon Data Services, Inc. (AWS)", checks: "City Finance", cadence: "Yearly", due: "Dec 31, 2026", dueSim: true, dueKey: "2026-12-31",
    promised: "At least $352,750 a year, rising over time.", promisedSources: ["S17", { id: "S5", loc: "template §5a, §5c" }],
    status: "Evidence missing", reason: "The city publishes only city-wide totals, not payments per company.", reasonSources: ["S2"],
    evidence: [
     { date: "2025", item: "City-wide total published: about $10M in community development charges from data centers, tax year 2024 (collected 2025)", src: { id: "S2" } } ],
    change: "Moves to a status once the paid-vs-owed amount is shared or published." },
  { id: "C3", title: "Yearly community participation statement", group: "aws", project: "AWS campus", type: "Agreement term", basis: "reported in news; signed agreement not online",
    owner: "Amazon Data Services, Inc. (AWS)", checks: "City (not stated)", cadence: "Yearly", due: "Dec 31, 2026", dueSim: true, dueKey: "2026-12-31",
    promised: "A yearly community participation statement.", promisedSources: ["S17"],
    status: "Evidence missing", reason: "A city news post reports a progress update. We found no yearly statement as named in the deal.",
    evidence: [
     { date: "2025-08", item: "City news post: Amazon updated the community on its $3.5B plan; $6.2B invested in Licking County, 2015–2024", src: { id: "S27" } },
     { date: "Undated", item: "City post: Amazon launched a $100,000 local grant program", src: { id: "S28" } },
     { date: "2026-11-12", item: "Searched the city data-center site: no yearly statement found", src: { id: "S1" } } ],
    change: "Becomes Not yet due for next year once this year's statement is shared with the city or published." },
  { id: "C4", title: "Fan-noise fix (Google campus, nearby)", group: "near", project: "Google (Montauk Innovations)", type: "Voluntary promise", basis: "relayed on the city's resident questions page; not found in an agreement",
    owner: "Google", checks: "Google monitors itself. The city relays updates.", cadence: "One-off", due: "Dec 31, 2026", dueSim: false, dueKey: "2026-12-31",
    promised: "Permanent fix for fan noise: work starting June 2026, finished December 2026.", promisedSources: ["S3"],
    status: "Not yet due", reason: "The completion date has not passed.",
    evidence: [
     { date: "2025-09", item: "Residents complained about fan noise. Google hired sound engineers.", src: { id: "S3" } },
     { date: "2026-11-17", item: "City resident page checked: fix still scheduled to start June 2026 and finish December 2026", src: { id: "S3" } } ],
    change: "After Dec 31, 2026: Evidence missing unless a completion notice or noise reading is shared or published.",
    note: "Here to test whether promises outside the tax deal belong in the report." },
  { id: "C5", title: "Yearly review of the tax break", group: "aws", project: "AWS campus", type: "Statutory duty", basis: "Ohio Revised Code § 5709.85",
    owner: "Licking County Tax Incentive Review Council (TIRC) and New Albany City Council", checks: "FenceLine records the outcome and the packet link", checksSim: true,
    cadence: "Yearly", due: "July 2027 review, Council vote about Sept–Oct 2027", dueNote: "estimate", dueSim: true, dueKey: "2027-07-31",
    promised: "TIRC “shall annually review this Agreement.” The break: 100% for 15 years, then 75% for 15.", promisedSources: [{ id: "S5", loc: "template §3, p. 4" }, "S21", { id: "S17", loc: "tax-break terms" }],
    status: "Not yet due", reason: "The 2027 review cycle has not started.",
    evidence: [
     { date: "2026-07", item: "2026 review held", src: { id: "S22", note: "secondary" } },
     { date: "2026-09-01", item: "Council agenda lists Resolution R-39-2026 on the Licking County review", src: { id: "S10" } },
     { date: "2026-10-06", item: "Council agenda lists Resolution R-39-2026 again, under resolutions and public hearing", src: { id: "S29" } },
     { date: "2026-10-06", item: "Council kept 26 of 27 Licking County agreements. Which one ended is not public.", src: { id: "S23", note: "secondary, to confirm against minutes" } } ],
    change: "Disputed if the Oct 6, 2026 minutes contradict the secondary report." }
 ],
 groups: { aws: "Amazon Data Services (AWS) campus", near: "Nearby project · test item" },
 lastChecked: "Nov 22, 2026", statusSetBy: "FenceLine reviewer; the town or the developer can challenge it",

 labels: {
  "Documented": "In a public official document we link. A law or template shows the rule, not the signed terms.",
  "Forecast": "A projection, not a commitment.",
  "No public source yet": "Nothing public to check it against before the vote (news only, or nothing found).",
  "Not yet due": "The deadline has not passed.",
  "Evidence missing": "The deadline passed or evidence should exist, but none is public. Not proof the commitment was missed.",
  "Tracked by the city, figures withheld": "The town collects the figures but does not publish them.",
  "Redacted (proprietary)": "The town withholds the figures as the company's proprietary information.",
  "Disputed": "Sources disagree, or someone has challenged the evidence.",
  "Verified (specialist)": "A named specialist signed off. FenceLine never does this itself."
 },
 statusExamples: {
  "Redacted (proprietary)": "Example: yearly water use.",
  "Verified (specialist)": "Example: a licensed acoustic engineer's report."
 },

 independence: [
  "Town control: the money sits in a town-held account; the town controls scope and publication.",
  "Disclosure: every page shows who paid and how much.",
  "No verdicts: no vote recommendations, no certification, no promise of faster approval.",
  "Clear labels: only a specialist's sign-off makes an item Verified (specialist).",
  "Corrections: every change is dated and explained. The log shows what changed, not that the numbers are right.",
  "No conflicts: no fee depends on the vote, and no paid work for the developer on the same project."
 ],
 methodSteps: [
  ["Find and plan", "The commitment in a law, agreement, city template or official page, with its owner, due date and the evidence that should exist."],
  ["Review the evidence", "A FenceLine reviewer sets each status from the evidence; the town or the developer can challenge it, shown as Disputed. Only a named specialist can mark Verified (specialist)."],
  ["Hand it to the town", "The town decides who sees it. Every change is logged with a date and a reason."]
 ],
 corrections: [
  { date: "2026-11-14", id: "C5", what: "Added “which agreement ended is not public”", why: "The 2026 vote counts come from secondary sources", by: "FenceLine analyst", sim: true },
  { date: "2026-11-16", id: "C2", what: "Source changed from news to city template §5a for the minimum-payment rule", why: "Prefer the official document", by: "FenceLine analyst", sim: true },
  { date: "2026-11-17", id: "C1–C3", ids: ["C1", "C2", "C3"], what: "Owner changed from “Amazon Web Services” to “Amazon Data Services, Inc. (AWS)”", why: "Legal name in Council Resolution R-41-2023", src: "S26", by: "Research team", sim: false },
  { date: "2026-11-17", id: "C4", what: "Due date set to Dec 31, 2026", why: "The city page gives two dates; we use the later one", by: "FenceLine analyst", sim: true },
  { date: "2026-11-17", id: "C2", what: "Evidence corrected: the $10M total is for tax year 2024, collected 2025, not 2026", why: "Wording on the City Finances page", src: "S2", by: "Research team", sim: false },
  { date: "2026-11-17", id: "C4", what: "Removed “page updated Nov 6, 2026”", why: "The city page shows no update date", src: "S3", by: "Research team", sim: false },
  { date: "2026-11-17", id: "C1, C5", ids: ["C1", "C5"], what: "Added the Oct 6, 2026 Council agenda as an official source", why: "Prefer the official document to a secondary summary", src: "S29", by: "Research team", sim: false },
  { date: "2026-11-22", id: "C1", what: "Status changed from Evidence missing to Tracked by the city, figures withheld", why: "The city collects these figures for the county's yearly review; per-company figures are not on its sites", by: "FenceLine analyst", sim: true }
 ],
 journey: [
  ["Receive proposal", "Read the application; decide who reviews it.", "", "doc"],
  ["Review impacts", "Staff and consultants review the studies.", "", "user"],
  ["Prepare for hearing", "Build the board packet; flag open questions.", "brief", "question"],
  ["Record decision", "Capture the decision and its conditions.", "", "gavel"],
  ["Follow up", "Check each condition with its owner.", "record", "cal"]
 ],
 feedbackQuestions: [
  "Does this add anything to what your board receives today?",
  "Who could authorize a brief like this, and how would it be paid for?"
 ],
 detailQuestions: [
  "Would your office keep this up to date, or want someone else to?",
  "Where would you look for the next update, and what would you do if the deadline passed with no evidence?"
 ],
 recordUpdated: "Nov 22, 2026",
 recordFacts: {
  covers: "4 commitments from the Amazon Data Services (AWS) tax deal · 1 nearby Google promise (test item)",
  real: "Commitments, sources, dated evidence",
  simulated: "Statuses, estimated dates, status dates and analyst corrections",
  publication: "The town's choice: staff, council or on request"
 }
};

/* ---- v3: simulated values for the mockup screens (spec §4.3–4.4). Every value here is simulated. ---- */
const MOCK = {
 badge: "Mockup · simulated values",
 asOf: "Nov 22, 2026",
 // Workbench (gate G1): AI-draft confidence per claim; the queue shows low confidence first
 confidence: { B1: 0.94, B2: 0.78, B3: 0.71, B4: 0.92, B5: 0.97, B6: 0.95, B7: 0.90 },
 preparedBy: ["Applicant", "Applicant's consultant", "City", "County", "State", "News media", "Nearby developer"],
 rejectedDraft: { id: "D8", topic: "Taxes", claim: "$400,000 a year to the city", reason: "Quote not found on page 3 of the stored text" },
 comparables: { B3: { from: 0.22, to: 0.70, marker: 0.12, n: 6 } },
 // Tracer: hearing claims against agreement draft v3
 tracer: {
  draft: "agreement draft v3",
  rows: [
   { claim: "B2", text: "About 105 jobs and $9M payroll", outcome: "minimum", where: "Draft §2" },
   { claim: "B3", text: "At least $352,750 a year to the city", outcome: "minimum", where: "Draft §5a, 10% late penalty §5c" },
   { claim: "B1", text: "$3.5B investment, finished by 2030", outcome: "estimate", where: "" },
   { claim: "B6", text: "Water use reported each year", outcome: "notfound", where: "" },
   { claim: "B7", text: "Noise limit at the property line", outcome: "condition", where: "Permit condition", extra: "cure period left to the agreement" }
  ],
  since: "1 claim moved from estimate to minimum.",
  changes: [{ claim: "B2", from: "estimate", to: "minimum", note: "Jobs and payroll now a minimum in draft §2" }]
 },
 outcomes: {
  minimum: { label: "Minimum in agreement", icon: "check", cls: "oc-min", def: "A minimum written into the agreement draft." },
  condition: { label: "Condition", icon: "gavel", cls: "oc-con", def: "A condition of approval, outside the agreement." },
  estimate: { label: "Stayed an estimate", icon: "forecast", cls: "oc-est", def: "Said at the hearing; not binding in the draft." },
  notfound: { label: "Not found in draft", icon: "xcirc", cls: "oc-nf", def: "No matching term found in the draft." }
 },
 // Town console (gate G3)
 console: {
  version: 3,
  factual: "Done · 4 corrections logged",
  access: "WCAG 2.1 AA, tagged PDF + HTML",
  withheld: "1 · Redacted (proprietary): water use",
  audiences: [["staff", "Town staff"], ["council", "Council"], ["consultant", "Town consultant"], ["developer", "Developer response"], ["public", "Public"]],
  audienceShort: { staff: "staff", council: "council", consultant: "the town consultant", developer: "the developer", public: "the public" },
  approvers: ["Town administrator", "Planning director", "Finance director"]
 },
 // Developer response
 dispute: { id: "C2", reasonSample: "Sample text: the yearly payment was made, and a receipt was shared with the town.", evidenceSample: "receipt-2025.pdf (sample) · shared with the town, not published" },
 // Resident question register: no names
 questions: [
  { topic: "Noise", q: "Will noise be measured after the campus opens?", answers: [{ claim: "B7", label: "No public source yet", text: "No measurement duty found in public documents.", sources: ["S3"] }] },
  { topic: "Taxes", q: "Will the city report what the company actually paid each year?", answers: [
    { claim: "B3", label: "No public source yet", text: "Per-company payments are not published; the city publishes only city-wide totals.", sources: ["S2"] },
    { claim: "B5", label: "Documented", text: "A county council reviews every tax-break deal each year; City Council votes on its recommendations (Ohio law § 5709.85).", sources: ["S21", "S5"] } ] },
  { topic: "Water", q: "Will yearly water use be published?", answers: [{ claim: "B6", label: "Redacted (proprietary)", text: "Example status.", sim: true, sources: ["S6"] }] }
 ]
};
