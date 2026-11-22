/* FenceLine prototype v3 · tour content only. Edit text here; the engine is tour.js.
   Step fields:
     id         unique within the tour
     route      hash route the step needs, e.g. "#/brief" (the tour navigates there and waits for the target)
     target     CSS selector using a data-tour attribute, or an array of selectors (first visible one wins)
     title      ≤ 6 words
     text       ≤ 20 words; action steps start with "Click here to …"
     action     "click": the tour advances only when the highlighted element is clicked (Next is hidden)
     placement  preferred bubble side: "top" | "bottom" | "left" | "right" (falls back automatically)
     before     optional list of named hooks run before the step: "assistant:open", "assistant:close",
                "reset:wb", "reset:release", "reset:dispute", "menu:close"
   A tour may also have a "before" list, run once when it starts. */
window.FENCELINE_TOURS = {
 main: {
  title: "FenceLine in 2 minutes",
  steps: [
   { id: "start-headline", route: "#/", target: "[data-tour='headline']", placement: "bottom",
     title: "Evidence before the vote", text: "Before council votes, see which developer claims are documented." },
   { id: "start-journey", route: "#/", target: "[data-tour='journey']", placement: "top",
     title: "Before and after the vote", text: "The brief comes before the vote; the status report follows after it." },
   { id: "open-brief", route: "#/", target: "[data-tour='open-brief']", action: "click", placement: "bottom",
     title: "Open the sample brief", text: "Click here to open the sample brief for the New Albany campus." },
   { id: "brief-vote", route: "#/brief", target: "[data-tour='vote']", placement: "bottom",
     title: "The vote that sets terms", text: "Written for the decision that locks in terms." },
   { id: "brief-label", route: "#/brief", target: "[data-tour='label-filter']", action: "click", placement: "bottom",
     title: "Three labels", text: "Click here to show only claims with no public source yet." },
   { id: "brief-claim", route: "#/brief", target: "[data-tour='claim-card']", placement: "right",
     title: "One claim, three parts", text: "Each claim shows who prepared the evidence and a question for the applicant." },
   { id: "brief-funding", route: "#/brief", target: "[data-tour='funding']", placement: "left",
     title: "Who paid for this brief", text: "Funding is shown on page one. Proposed: the applicant pays into an escrow the town controls." },
   { id: "ask-question", route: "#/brief", target: "[data-tour='ask-chip']", action: "click", placement: "left", before: ["assistant:open"],
     title: "Ask about this brief", text: "Click here to ask a suggested question. This is an idea we are testing." },
   { id: "ask-answer", route: "#/brief", target: "[data-tour='chat-answer']", placement: "left",
     title: "Answers cite their sources", text: "Scripted answers use only the brief's signed claims and cited sources, by source number." },
   { id: "open-workbench", route: "#/brief", target: "[data-tour='open-workbench']", action: "click", placement: "bottom", before: ["assistant:close"],
     title: "Behind the brief", text: "Click here to open the workbench. Behind the brief: an analyst signs every claim." },
   { id: "wb-source", route: "#/workbench", target: "[data-tour='wb-source']", placement: "bottom",
     title: "Quote found on the page", text: "AI drafts; a claim without a quote on the page is rejected." },
   { id: "open-tracer", route: "#/workbench", target: "[data-tour='open-tracer']", action: "click", placement: "top",
     title: "What council is locking in", text: "Click here to open the tracer: what becomes binding, and what stays an estimate." },
   { id: "tracer-table", route: "#/tracer", target: "[data-tour='tracer-table']", placement: "bottom",
     title: "Minimum, condition or estimate", text: "Each hearing claim against the draft terms. All outcomes here are simulated." },
   { id: "record-timeline", route: "#/record", target: "[data-tour='timeline']", placement: "top",
     title: "After approval", text: "After approval: each commitment's status, with an as-of date." },
   { id: "feedback", route: "#/record", target: ["[data-tour='feedback-nav']", "[data-tour='feedback-next']"], placement: "bottom",
     title: "Tell us what you think", text: "Two questions. “We already get this” is a useful answer." }
  ]
 },

 // UC-3 (town factual review) and UC-4 (release to council only)
 town: {
  title: "For town staff",
  before: ["reset:release"],
  steps: [
   { id: "t-claim", route: "#/brief", target: "[data-tour='claim-card']", placement: "right",
     title: "One factual review round", text: "Town staff review the draft once. A fix, such as relabelling B3, is logged as a correction." },
   { id: "t-results", route: "#/console", target: "[data-tour='console-results']", placement: "bottom",
     title: "Checks before release", text: "Factual review, accessibility checks and withheld items, all shown before anything is released." },
   { id: "t-audience", route: "#/console", target: "[data-tour='console-audience']", placement: "bottom",
     title: "The town chooses who sees it", text: "Here: staff and council only. The public cannot see this version." },
   { id: "t-release", route: "#/console", target: "[data-tour='console-release']", action: "click", placement: "top",
     title: "Release this version", text: "Click here to release version 3 to staff and council." },
   { id: "t-released", route: "#/console", target: "[data-tour='console-status']", placement: "bottom",
     title: "Released, and fixed", text: "A released version never changes. Corrections produce a new version." },
   { id: "t-record", route: "#/record", target: "[data-tour='timeline']", placement: "top",
     title: "The status report follows", text: "After the vote: each commitment's owner, due date, evidence and status, with an as-of date." },
   { id: "t-corrections", route: "#/record", target: "[data-tour='corrections']", placement: "top",
     title: "Every change is logged", text: "Each correction is dated and explained. Nothing is deleted." }
  ]
 },

 // UC-1 (prepare a brief), UC-2 (reject an untraceable claim), UC-5 (trace promises), UC-6 (dispute)
 analyst: {
  title: "For analysts",
  before: ["reset:wb", "reset:dispute"],
  steps: [
   { id: "a-queue", route: "#/workbench", target: "[data-tour='wb-queue']", placement: "right",
     title: "Low confidence first", text: "AI drafts are sorted so the least certain claims are reviewed first." },
   { id: "a-source", route: "#/workbench", target: "[data-tour='wb-source']", placement: "bottom",
     title: "Quote found on the page", text: "The validator checks the quote and the number against the stored page." },
   { id: "a-rejected", route: "#/workbench", target: "[data-tour='wb-rejected']", placement: "right",
     title: "Untraceable claims stop here", text: "A draft whose quote is not on the page is rejected and never reaches the brief." },
   { id: "a-label", route: "#/workbench", target: "[data-tour='wb-label-no-public-source']", action: "click", placement: "bottom",
     title: "Choose the label", text: "Click here to label this claim No public source yet." },
   { id: "a-sign", route: "#/workbench", target: "[data-tour='wb-sign']", action: "click", placement: "top",
     title: "Sign the claim", text: "Click here to sign. Gate G1: label, prepared by and question are set." },
   { id: "a-signed", route: "#/workbench", target: "[data-tour='wb-state']", placement: "bottom",
     title: "From Validated to Signed", text: "Only signed claims can appear in a brief. Any later edit makes a new version." },
   { id: "a-tracer", route: "#/tracer", target: "[data-tour='tracer-table']", placement: "bottom",
     title: "Before the binding vote", text: "Which claims became minimums or conditions in the draft, and which stayed estimates." },
   { id: "a-since", route: "#/tracer", target: "[data-tour='tracer-since']", placement: "top",
     title: "Since the last draft", text: "What moved between drafts, so council sees what changed before it votes." },
   { id: "a-dispute", route: "#/dispute", target: "[data-tour='dispute-status']", placement: "bottom",
     title: "A status can be challenged", text: "C2 shows Evidence missing. The developer can challenge it with a reason and evidence." },
   { id: "a-submit", route: "#/dispute", target: "[data-tour='dispute-submit']", action: "click", placement: "top",
     title: "Submit the challenge", text: "Click here to submit. The status shows Disputed until the reviewer decides." },
   { id: "a-history", route: "#/dispute", target: "[data-tour='dispute-status']", placement: "bottom",
     title: "Previous status kept", text: "Disputed is shown now; Evidence missing stays visible as history." }
  ]
 }
};

/* Hotspot mode ("Tips" in the menu): small pulsing dots outside the tour. route is a path without "#". */
window.FENCELINE_HOTSPOTS = [
 { route: "/", target: "[data-tour='journey']", text: "The brief comes before the vote; the status report follows after it." },
 { route: "/brief", target: "[data-tour='vote']", text: "The brief is written for the vote that sets binding terms." },
 { route: "/brief", target: "[data-tour='label-filter']", text: "Filter claims by label: documented, forecast or no public source yet." },
 { route: "/brief", target: "[data-tour='funding']", text: "Who paid for the brief is shown on page one." },
 { route: "/brief", target: "[data-tour='ask-open']", text: "Scripted answers from the brief's sources. An idea we are testing." },
 { route: "/record", target: "[data-tour='timeline']", text: "Statuses are simulated and set by a reviewer, with an as-of date." },
 { route: "/workbench", target: "[data-tour='wb-source']", text: "The validator checks that the quote is on the stored page." },
 { route: "/workbench", target: "[data-tour='wb-sign']", text: "Signing is gate G1. Only signed claims reach a brief." },
 { route: "/tracer", target: "[data-tour='tracer-table']", text: "Outcomes are simulated for this mockup." },
 { route: "/console", target: "[data-tour='console-audience']", text: "The town decides who sees each version." },
 { route: "/dispute", target: "[data-tour='dispute-status']", text: "While a dispute is open, the status shows Disputed and the previous status stays visible." },
 { route: "/questions", target: "[data-tour='questions-list']", text: "Questions are linked to claims. No names are shown." }
];
