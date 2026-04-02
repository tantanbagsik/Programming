/**
 * Additional Quiz Questions for Missing Lessons
 * Philippine CPA Board Exam FAR Course
 */

const ADDITIONAL_QUIZ_QUESTIONS = {
  // SECTION 2: ASSETS - MISSING LESSONS

  "Lesson 2.2: Trade and Other Receivables": [
    {
      question: "Under the expected credit loss model, when should an entity recognize a loss allowance?",
      options: [
        "Only when there is objective evidence of impairment",
        "At initial recognition and at each reporting date",
        "Only when the receivable is written off",
        "When management decides to create a provision"
      ],
      correctAnswer: "At initial recognition and at each reporting date",
      points: 1,
      explanation: "The expected credit loss model requires recognition of loss allowances at initial recognition and at each reporting date, not only when there is objective evidence of impairment."
    },
    {
      question: "When receivables are factored without recourse, the factor assumes:",
      options: [
        "No risk of uncollectibility",
        "Full risk of uncollectibility",
        "Partial risk of uncollectibility",
        "Risk only if the debtor files for bankruptcy"
      ],
      correctAnswer: "Full risk of uncollectibility",
      points: 1,
      explanation: "Without recourse means the factor assumes the full risk of uncollectibility. The selling entity has no further obligation."
    },
    {
      question: "Which method for estimating bad debts provides the best matching of expenses with revenues?",
      options: [
        "Direct write-off method",
        "Percentage of sales method",
        "Percentage of receivables method",
        "Aging of receivables method"
      ],
      correctAnswer: "Percentage of sales method",
      points: 1,
      explanation: "The percentage of sales method (income statement approach) focuses on bad debt expense and provides the best matching of expenses with the revenues they helped generate."
    },
    {
      question: "A note receivable with a face value of ₱100,000, term of 1 year, and stated interest rate of 10% has a present value of:",
      options: [
        "₱100,000",
        "₱90,909",
        "₱110,000",
        "₱90,000"
      ],
      correctAnswer: "₱100,000",
      points: 1,
      explanation: "When a note has a stated interest rate, its present value equals its face value because the interest is paid periodically or at maturity."
    },
    {
      question: "Pledging of receivables means:",
      options: [
        "Selling receivables to a factor",
        "Using receivables as collateral for a loan",
        "Transferring legal ownership of receivables",
        "Writing off uncollectible receivables"
      ],
      correctAnswer: "Using receivables as collateral for a loan",
      points: 1,
      explanation: "Pledging means using receivables as collateral for a loan. The entity retains ownership but assigns the receivables to secure the debt."
    }
  ],

  "Lesson 2.4: Biological Assets": [
    {
      question: "Under PFRS 41, biological assets are generally measured at:",
      options: [
        "Historical cost",
        "Net realizable value",
        "Fair value less costs to sell",
        "Replacement cost"
      ],
      correctAnswer: "Fair value less costs to sell",
      points: 1,
      explanation: "PFRS 41 requires biological assets to be measured at fair value less costs to sell at each reporting date, unless fair value cannot be measured reliably."
    },
    {
      question: "Bearer plants are accounted for under:",
      options: [
        "PFRS 41 (Agriculture)",
        "PFRS 16 (Property, Plant and Equipment)",
        "PFRS 15 (Revenue)",
        "PFRS 9 (Financial Instruments)"
      ],
      correctAnswer: "PFRS 16 (Property, Plant and Equipment)",
      points: 1,
      explanation: "Bearer plants (plants used to grow produce over several periods) are accounted for under PFRS 16 as PPE, not under PFRS 41."
    },
    {
      question: "Agricultural produce harvested from biological assets is measured at:",
      options: [
        "Historical cost",
        "Fair value less costs to sell at harvest",
        "Net realizable value",
        "Cost plus normal profit"
      ],
      correctAnswer: "Fair value less costs to sell at harvest",
      points: 1,
      explanation: "Agricultural produce harvested from biological assets is measured at fair value less costs to sell at the point of harvest."
    },
    {
      question: "Which of the following is NOT a biological asset?",
      options: [
        "Dairy cattle",
        "Bearer plants",
        "Sheep raised for wool",
        "Fish in an aquaculture farm"
      ],
      correctAnswer: "Bearer plants",
      points: 1,
      explanation: "Bearer plants are accounted for under PFRS 16 (PPE) rather than PFRS 41 because they are used in the production process over multiple periods."
    },
    {
      question: "Gains arising from changes in fair value less costs to sell of biological assets are recognized in:",
      options: [
        "Other comprehensive income",
        "Profit or loss",
        "Equity",
        "Revaluation surplus"
      ],
      correctAnswer: "Profit or loss",
      points: 1,
      explanation: "Gains or losses arising from changes in fair value less costs to sell of biological assets are recognized in profit or loss in the period they arise."
    }
  ],

  "Lesson 2.5: Investment Property": [
    {
      question: "Under PFRS 40, investment property is property held to:",
      options: [
        "Use in production or supply of goods",
        "Administrative purposes",
        "Earn rentals or for capital appreciation",
        "Sale in the ordinary course of business"
      ],
      correctAnswer: "Earn rentals or for capital appreciation",
      points: 1,
      explanation: "Investment property is held to earn rentals, for capital appreciation, or both, rather than for use in production, administration, or sale."
    },
    {
      question: "Under the fair value model, investment property is:",
      options: [
        "Depreciated over its useful life",
        "Carried at fair value with changes in profit or loss",
        "Carried at cost less accumulated depreciation",
        "Tested for impairment annually"
      ],
      correctAnswer: "Carried at fair value with changes in profit or loss",
      points: 1,
      explanation: "Under the fair value model, investment property is carried at fair value, and changes in fair value are recognized in profit or loss."
    },
    {
      question: "A transfer from investment property to property, plant and equipment occurs when:",
      options: [
        "Management decides to change the use",
        "There is evidence of a change in use",
        "The property is sold",
        "Fair value decreases significantly"
      ],
      correctAnswer: "There is evidence of a change in use",
      points: 1,
      explanation: "Transfers are made when there is evidence of a change in use, such as commencement of owner-occupation or development for sale."
    },
    {
      question: "Property under construction for future use as investment property is:",
      options: [
        "Classified as inventory",
        "Classified as investment property",
        "Classified as PPE",
        "Classified as a biological asset"
      ],
      correctAnswer: "Classified as investment property",
      points: 1,
      explanation: "Property under construction or development for future use as investment property is classified as investment property if the entity has chosen the fair value model."
    },
    {
      question: "An entity cannot use the fair value model for:",
      options: [
        "All investment properties",
        "Investment properties with reliable fair values",
        "Only properties held for capital appreciation",
        "Investment properties when fair value cannot be measured reliably"
      ],
      correctAnswer: "Investment properties when fair value cannot be measured reliably",
      points: 1,
      explanation: "If fair value cannot be measured reliably without undue cost or effort, the entity must use the cost model."
    }
  ],

  // SECTION 3: LIABILITIES - MISSING LESSONS

  "Lesson 3.2: Provisions, Contingent Liabilities and Contingent Assets": [
    {
      question: "A provision should be recognized when:",
      options: [
        "There is a present obligation from a past event",
        "An outflow of resources is probable",
        "The amount can be reliably estimated",
        "All of the above conditions are met"
      ],
      correctAnswer: "All of the above conditions are met",
      points: 1,
      explanation: "A provision is recognized only when there is a present obligation, outflow is probable, and the amount can be reliably estimated."
    },
    {
      question: "A contingent liability is:",
      options: [
        "A present obligation that can be measured reliably",
        "A possible obligation or present obligation that does not meet recognition criteria",
        "A liability that will arise in the future",
        "A provision with uncertain timing"
      ],
      correctAnswer: "A possible obligation or present obligation that does not meet recognition criteria",
      points: 1,
      explanation: "A contingent liability is either a possible obligation from past events, or a present obligation that does not meet the recognition criteria."
    },
    {
      question: "Contingent liabilities are:",
      options: [
        "Recognized in the financial statements",
        "Disclosed in the notes unless remote",
        "Never disclosed",
        "Recognized only when probable"
      ],
      correctAnswer: "Disclosed in the notes unless remote",
      points: 1,
      explanation: "Contingent liabilities are not recognized but are disclosed in the notes unless the possibility of outflow is remote."
    },
    {
      question: "Onerous contracts are accounted for as:",
      options: [
        "Contingent liabilities",
        "Provisions",
        "Contingent assets",
        "Not recognized"
      ],
      correctAnswer: "Provisions",
      points: 1,
      explanation: "Onerous contracts (where unavoidable costs exceed expected benefits) are recognized as provisions."
    },
    {
      question: "Provisions are measured at:",
      options: [
        "Best estimate of expenditure required",
        "Most likely amount",
        "Expected value (probability-weighted)",
        "Either best estimate or expected value, depending on the situation"
      ],
      correctAnswer: "Either best estimate or expected value, depending on the situation",
      points: 1,
      explanation: "Provisions are measured at the best estimate. If a large population of items is involved, expected value is used. For single items, the most likely amount may be the best estimate."
    }
  ],

  "Lesson 3.3: Employee Benefits": [
    {
      question: "Short-term employee benefits are benefits expected to be settled within:",
      options: [
        "3 months after the reporting date",
        "6 months after the reporting date",
        "12 months after the reporting date",
        "The normal operating cycle"
      ],
      correctAnswer: "12 months after the reporting date",
      points: 1,
      explanation: "Short-term employee benefits are those expected to be settled wholly before twelve months after the reporting date."
    },
    {
      question: "Under a defined contribution plan, the entity's obligation is:",
      options: [
        "To pay agreed contributions to the plan",
        "To pay agreed benefits to employees",
        "To ensure the plan has sufficient assets",
        "To guarantee investment returns"
      ],
      correctAnswer: "To pay agreed contributions to the plan",
      points: 1,
      explanation: "In a defined contribution plan, the entity pays fixed contributions and has no legal or constructive obligation to pay further amounts."
    },
    {
      question: "The net defined benefit liability (asset) is:",
      options: [
        "The present value of the defined benefit obligation minus the fair value of plan assets",
        "The fair value of plan assets minus the present value of the defined benefit obligation",
        "The total contributions made to the plan",
        "The expected benefit payments for the next year"
      ],
      correctAnswer: "The present value of the defined benefit obligation minus the fair value of plan assets",
      points: 1,
      explanation: "Net defined benefit liability = Present value of obligation - Fair value of plan assets. If negative, it's a net defined benefit asset (subject to ceiling)."
    },
    {
      question: "Remeasurements of net defined benefit liability are recognized in:",
      options: [
        "Profit or loss",
        "Other comprehensive income",
        "Retained earnings",
        "Deferred income"
      ],
      correctAnswer: "Other comprehensive income",
      points: 1,
      explanation: "Remeasurements (actuarial gains/losses, return on plan assets) are recognized in OCI and are not reclassified to profit or loss."
    },
    {
      question: "The discount rate used to measure the defined benefit obligation should reflect:",
      options: [
        "The entity's cost of borrowing",
        "High-quality corporate bond yields",
        "Government bond yields",
        "The expected return on plan assets"
      ],
      correctAnswer: "High-quality corporate bond yields",
      points: 1,
      explanation: "The discount rate should reflect the time value of money, using yields on high-quality corporate bonds at the reporting date."
    }
  ],

  // SECTION 4: SPECIAL TOPICS - MISSING LESSONS

  "Lesson 4.2: Leases": [
    {
      question: "Under PFRS 16, a lease is defined as a contract that:",
      options: [
        "Transfers ownership of an asset",
        "Conveys the right to use an asset for a period of time",
        "Is for a term of more than 12 months",
        "Involves only property"
      ],
      correctAnswer: "Conveys the right to use an asset for a period of time",
      points: 1,
      explanation: "A lease is a contract that conveys the right to control the use of an identified asset for a period of time in exchange for consideration."
    },
    {
      question: "Under PFRS 16, a lessee recognizes:",
      options: [
        "An operating lease expense",
        "A right-of-use asset and lease liability",
        "Only a lease liability",
        "An expense when lease payments are made"
      ],
      correctAnswer: "A right-of-use asset and lease liability",
      points: 1,
      explanation: "PFRS 16 requires lessees to recognize a right-of-use asset and a lease liability for virtually all leases."
    },
    {
      question: "The lease liability is initially measured at:",
      options: [
        "The total lease payments",
        "The present value of lease payments",
        "The fair value of the leased asset",
        "The total undiscounted lease payments"
      ],
      correctAnswer: "The present value of lease payments",
      points: 1,
      explanation: "The lease liability is initially measured at the present value of the lease payments payable over the lease term."
    },
    {
      question: "Short-term leases (12 months or less) with no purchase option:",
      options: [
        "Must always be recognized on the balance sheet",
        "May be expensed as incurred",
        "Are not covered by PFRS 16",
        "Must be capitalized"
      ],
      correctAnswer: "May be expensed as incurred",
      points: 1,
      explanation: "PFRS 16 allows a lessee to elect not to recognize right-of-use assets and lease liabilities for short-term leases, expensing payments as incurred."
    },
    {
      question: "Variable lease payments that depend on an index or rate are:",
      options: [
        "Included in the initial lease liability",
        "Recognized as an expense when incurred",
        "Never included in lease payments",
        "Added to the right-of-use asset"
      ],
      correctAnswer: "Recognized as an expense when incurred",
      points: 1,
      explanation: "Variable lease payments that depend on an index or rate are not included in the initial measurement but are recognized as expenses in the period they occur."
    }
  ],

  // SECTION 5: FINANCIAL STATEMENT ANALYSIS - MISSING LESSONS

  "Lesson 5.3: Ethical Considerations in Financial Reporting": [
    {
      question: "Which of the following is a fundamental principle of the Code of Ethics for Professional Accountants?",
      options: [
        "Professional competence and due care",
        "Maximizing shareholder wealth",
        "Minimizing tax liability",
        "Following management's instructions"
      ],
      correctAnswer: "Professional competence and due care",
      points: 1,
      explanation: "Professional competence and due care is one of the five fundamental principles: integrity, objectivity, professional competence, confidentiality, and professional behavior."
    },
    {
      question: "A self-review threat arises when:",
      options: [
        "The accountant reviews work done by another accountant",
        "The accountant reviews their own previous work",
        "The accountant has a financial interest in the client",
        "The accountant is threatened with litigation"
      ],
      correctAnswer: "The accountant reviews their own previous work",
      points: 1,
      explanation: "A self-review threat occurs when the accountant reviews work that they or their firm previously performed."
    },
    {
      question: "Creative accounting refers to:",
      options: [
        "Using accounting software effectively",
        "Exploiting loopholes in accounting standards to present favorable financial statements",
        "Following strict accounting principles",
        "Implementing new accounting systems"
      ],
      correctAnswer: "Exploiting loopholes in accounting standards to present favorable financial statements",
      points: 1,
      explanation: "Creative accounting involves using accounting techniques to present financial statements in a more favorable light, often by exploiting flexibility in standards."
    },
    {
      question: "Which of the following is an example of earnings management?",
      options: [
        "Accurate application of accounting policies",
        "Timing of revenue recognition to meet targets",
        "Proper disclosure of all material information",
        "Following the matching principle"
      ],
      correctAnswer: "Timing of revenue recognition to meet targets",
      points: 1,
      explanation: "Earnings management involves manipulating financial results, such as accelerating or delaying revenue recognition to achieve specific targets."
    },
    {
      question: "Professional skepticism means:",
      options: [
        "Doubting everything the client says",
        "An attitude that includes a questioning mind and critical assessment of evidence",
        "Refusing to accept management representations",
        "Assuming clients are dishonest"
      ],
      correctAnswer: "An attitude that includes a questioning mind and critical assessment of evidence",
      points: 1,
      explanation: "Professional skepticism is an attitude that includes a questioning mind, being alert to conditions that may indicate possible misstatement, and critical assessment of evidence."
    }
  ],

  // SECTION 6: BOARD EXAM PREPARATION - MISSING LESSONS

  "Lesson 6.1: Exam Strategies and Time Management": [
    {
      question: "For the FAR section of the CPA Board Exam, you have approximately how many minutes per question?",
      options: ["1.5 minutes", "2.0 minutes", "2.4 minutes", "3.0 minutes"],
      correctAnswer: "2.4 minutes",
      points: 1,
      explanation: "The FAR exam is 4 hours (240 minutes) for 100 questions, giving approximately 2.4 minutes per question."
    },
    {
      question: "Which of the following is the most effective exam strategy?",
      options: [
        "Answer questions in strict order",
        "Skip difficult questions and return to them later",
        "Spend equal time on all questions",
        "Guess immediately on difficult questions"
      ],
      correctAnswer: "Skip difficult questions and return to them later",
      points: 1,
      explanation: "Flagging difficult questions and returning to them ensures you maximize points on questions you know well first."
    },
    {
      question: "When eliminating answer choices, you should:",
      options: [
        "Eliminate only the obviously wrong answers",
        "Eliminate any answer you're unsure about",
        "Cross out each eliminated option and work with remaining choices",
        "Never eliminate more than two options"
      ],
      correctAnswer: "Cross out each eliminated option and work with remaining choices",
      points: 1,
      explanation: "Physically crossing out incorrect options helps focus on remaining choices and improves guessing accuracy."
    },
    {
      question: "Common calculation errors on the board exam include:",
      options: [
        "Using the wrong formula",
        "Misreading numbers",
        "Calculator entry errors",
        "All of the above"
      ],
      correctAnswer: "All of the above",
      points: 1,
      explanation: "Calculation errors from formula mistakes, misreading, and calculator errors are common causes of lost points."
    },
    {
      question: "The best approach to exam preparation in the final week is to:",
      options: [
        "Learn new topics",
        "Review and practice with past exams",
        "Read textbooks from cover to cover",
        "Take a complete break from studying"
      ],
      correctAnswer: "Review and practice with past exams",
      points: 1,
      explanation: "The final week should focus on reinforcing known material through review and practice rather than learning new topics."
    }
  ],

  "Lesson 6.4: Performance Analytics and Final Review": [
    {
      question: "After taking practice exams, the most effective next step is to:",
      options: [
        "Immediately take another exam",
        "Review incorrect answers and understand why they were wrong",
        "Calculate your overall score",
        "Take a break from studying"
      ],
      correctAnswer: "Review incorrect answers and understand why they were wrong",
      points: 1,
      explanation: "Reviewing mistakes is crucial for learning. Understanding why answers were wrong prevents repeating the same errors."
    },
    {
      question: "If you consistently score low on a specific topic, you should:",
      options: [
        "Skip that topic on the exam",
        "Spend additional study time on that topic",
        "Hope it doesn't appear on the exam",
        "Guess on all questions from that topic"
      ],
      correctAnswer: "Spend additional study time on that topic",
      points: 1,
      explanation: "Identifying weak areas through performance analytics allows targeted study to improve scores in those specific topics."
    },
    {
      question: "The formula for calculating your expected board exam score based on practice is:",
      options: [
        "Average practice score × 1.0",
        "Average practice score × 0.9 (accounting for exam stress)",
        "Highest practice score",
        "Average of all practice scores"
      ],
      correctAnswer: "Average practice score × 0.9 (accounting for exam stress)",
      points: 1,
      explanation: "It's prudent to estimate your actual performance at about 90% of your best practice scores to account for exam day stress and pressure."
    },
    {
      question: "A study plan should prioritize topics based on:",
      options: [
        "Personal preference",
        "Weight on the exam and personal weakness",
        "Alphabetical order",
        "Ease of learning"
      ],
      correctAnswer: "Weight on the exam and personal weakness",
      points: 1,
      explanation: "Effective study plans prioritize high-weight topics where you're weak, maximizing score improvement per study hour."
    },
    {
      question: "The last-minute formula sheet should include:",
      options: [
        "Everything from the textbooks",
        "Only formulas you've memorized",
        "Key formulas, ratios, and common adjustments",
        "Only new topics"
      ],
      correctAnswer: "Key formulas, ratios, and common adjustments",
      points: 1,
      explanation: "A last-minute reference should focus on high-yield formulas, financial ratios, and common adjustments that are frequently tested."
    }
  ]
};

module.exports = {
  ADDITIONAL_QUIZ_QUESTIONS
};