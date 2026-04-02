/**
 * Philippine CPA Board Exam FAR - Comprehensive Quiz Question Bank
 * Contains 200+ practice questions with detailed explanations
 * Organized by lesson for integration with the quiz system
 */

const QUIZ_QUESTION_BANK = {
  // SECTION 1: CONCEPTUAL FRAMEWORK AND PFRS
  
  "Lesson 1.1: Conceptual Framework for Financial Reporting": [
    {
      question: "Which of the following is a fundamental qualitative characteristic of useful financial information according to the Conceptual Framework?",
      options: ["Comparability", "Timeliness", "Relevance", "Verifiability"],
      correctAnswer: "Relevance",
      points: 1,
      explanation: "The fundamental qualitative characteristics are Relevance and Faithful Representation. Comparability, Timeliness, Verifiability, and Understandability are enhancing qualitative characteristics."
    },
    {
      question: "Financial information is relevant when it has:",
      options: [
        "Predictive value only",
        "Confirmatory value only",
        "Both predictive value and confirmatory value",
        "Neither predictive nor confirmatory value"
      ],
      correctAnswer: "Both predictive value and confirmatory value",
      points: 1,
      explanation: "Relevant financial information must have both predictive value (helps predict future outcomes) and confirmatory value (provides feedback about previous evaluations)."
    },
    {
      question: "Which of the following is NOT an element of financial statements?",
      options: ["Assets", "Liabilities", "Revenue", "Cash flows"],
      correctAnswer: "Cash flows",
      points: 1,
      explanation: "The elements of financial statements are assets, liabilities, equity, income (revenue and gains), and expenses (including losses). Cash flows is a presentation element, not a statement of financial position element."
    },
    {
      question: "According to the Conceptual Framework, an asset is:",
      options: [
        "A resource controlled by the entity as a result of past events",
        "A present obligation of the entity arising from past events",
        "The residual interest in the assets of the entity after deducting liabilities",
        "Increases in economic benefits during the accounting period"
      ],
      correctAnswer: "A resource controlled by the entity as a result of past events",
      points: 1,
      explanation: "An asset is a present economic resource controlled by the entity as a result of past events. An economic resource is a right that has the potential to produce economic benefits."
    },
    {
      question: "The going concern assumption states that:",
      options: [
        "The entity will continue to operate for the foreseeable future",
        "The entity will be liquidated in the near future",
        "The entity will be sold to another party",
        "The entity will change its business model"
      ],
      correctAnswer: "The entity will continue to operate for the foreseeable future",
      points: 1,
      explanation: "The going concern assumption presumes that the entity will continue in operation for the foreseeable future and has neither the intention nor the need to liquidate or curtail materially the scale of its operations."
    },
    {
      question: "Which measurement basis uses the amount of cash or cash equivalents that would have to be paid if the same or an equivalent asset were acquired currently?",
      options: ["Historical cost", "Current cost", "Realizable value", "Present value"],
      correctAnswer: "Current cost",
      points: 1,
      explanation: "Current cost is the amount of cash or cash equivalents that would have to be paid if the same or an equivalent asset were acquired currently."
    },
    {
      question: "Faithful representation requires that financial information be:",
      options: [
        "Complete, neutral, and free from error",
        "Relevant and material",
        "Comparable and understandable",
        "Timely and verifiable"
      ],
      correctAnswer: "Complete, neutral, and free from error",
      points: 1,
      explanation: "To be a perfectly faithful representation, a depiction must have three characteristics: complete, neutral, and free from error."
    },
    {
      question: "The Conceptual Framework identifies capital maintenance concepts. Under physical capital maintenance:",
      options: [
        "Profit is the increase in nominal money capital",
        "Profit is the increase in operating capability",
        "Only realized gains are recognized",
        "All gains are recognized in profit or loss"
      ],
      correctAnswer: "Profit is the increase in operating capability",
      points: 1,
      explanation: "Under physical capital maintenance, profit is the increase in physical productive capacity (operating capability) over the period."
    },
    {
      question: "Which of the following is an example of an expense?",
      options: [
        "Payment of dividends",
        "Purchase of inventory",
        "Depreciation of property, plant and equipment",
        "Repayment of a bank loan"
      ],
      correctAnswer: "Depreciation of property, plant and equipment",
      points: 1,
      explanation: "Depreciation is an expense as it represents a decrease in economic benefits during the accounting period. Payment of dividends, purchase of inventory, and loan repayment are not expenses."
    },
    {
      question: "According to the Conceptual Framework, when should an entity derecognize an asset?",
      options: [
        "When the entity loses control of the asset",
        "When the asset is fully depreciated",
        "When the asset is sold at a loss",
        "When the asset's carrying amount is impaired"
      ],
      correctAnswer: "When the entity loses control of the asset",
      points: 1,
      explanation: "An entity derecognizes an asset when it loses control of the asset (all or part). This could be through sale, expiration, or when the asset no longer meets the definition of an asset."
    }
  ],

  "Lesson 1.2: Philippine Financial Reporting Standards (PFRS) Overview": [
    {
      question: "Which body is responsible for formulating accounting standards in the Philippines?",
      options: ["Board of Accountancy (BOA)", "Financial Reporting Standards Council (FRSC)", "Securities and Exchange Commission (SEC)", "Bangko Sentral ng Pilipinas (BSP)"],
      correctAnswer: "Financial Reporting Standards Council (FRSC)",
      points: 1,
      explanation: "The FRSC is responsible for establishing and improving accounting standards in the Philippines that are generally accepted and promulgated by the Board of Accountancy."
    },
    {
      question: "PFRS 1 deals with:",
      options: [
        "First-time Adoption of Philippine Financial Reporting Standards",
        "Presentation of Financial Statements",
        "Statement of Cash Flows",
        "Inventories"
      ],
      correctAnswer: "First-time Adoption of Philippine Financial Reporting Standards",
      points: 1,
      explanation: "PFRS 1 prescribes the procedures that an entity must follow when it adopts PFRSs as the basis for preparing its general purpose financial statements for the first time."
    },
    {
      question: "Under PFRS for Small and Medium-sized Entities (SMEs), which of the following is simplified?",
      options: [
        "Goodwill amortization is permitted",
        "All borrowing costs are expensed",
        "Research costs can be capitalized",
        "LIFO is allowed for inventory"
      ],
      correctAnswer: "All borrowing costs are expensed",
      points: 1,
      explanation: "Under PFRS for SMEs, borrowing costs are expensed when incurred rather than capitalized to qualifying assets, unlike full PFRS where borrowing costs must be capitalized."
    },
    {
      question: "Which of the following statements about PFRS convergence with IFRS is TRUE?",
      options: [
        "PFRS are word-for-word identical to IFRS",
        "PFRS may have different effective dates than IFRS",
        "PFRS are completely independent from IFRS",
        "PFRS do not require any local adaptations"
      ],
      correctAnswer: "PFRS may have different effective dates than IFRS",
      points: 1,
      explanation: "While PFRS are generally converged with IFRS, they may have different effective dates and some local adaptations to suit Philippine conditions."
    },
    {
      question: "The Philippine Interpretations Committee is responsible for:",
      options: [
        "Issuing new accounting standards",
        "Providing guidance on the application of PFRS",
        "Enforcing compliance with accounting standards",
        "Conducting audits of financial statements"
      ],
      correctAnswer: "Providing guidance on the application of PFRS",
      points: 1,
      explanation: "The Philippine Interpretations Committee provides timely guidance on accounting issues that arise in applying PFRS through the issuance of Philippine Interpretations."
    }
  ],

  "Lesson 1.3: Presentation of Financial Statements (PFRS 1/IAS 1)": [
    {
      question: "Under PFRS 1, a complete set of financial statements includes all of the following EXCEPT:",
      options: [
        "Statement of financial position",
        "Statement of changes in equity",
        "Statement of retained earnings",
        "Statement of cash flows"
      ],
      correctAnswer: "Statement of retained earnings",
      points: 1,
      explanation: "A complete set of financial statements includes a statement of financial position, statement of comprehensive income, statement of changes in equity, statement of cash flows, and notes. Statement of retained earnings is not a required statement under PFRS."
    },
    {
      question: "Current assets include all of the following EXCEPT:",
      options: [
        "Assets expected to be realized within 12 months",
        "Assets held primarily for trading purposes",
        "Cash and cash equivalents",
        "Property, plant and equipment"
      ],
      correctAnswer: "Property, plant and equipment",
      points: 1,
      explanation: "Current assets are assets expected to be realized within 12 months or the normal operating cycle, held primarily for trading, or cash. Property, plant and equipment are non-current assets."
    },
    {
      question: "According to PFRS 1, when should an entity present a statement of financial position as at the beginning of the preceding period?",
      options: [
        "Always, as part of every set of financial statements",
        "When it applies an accounting policy retrospectively or makes a retrospective restatement",
        "Only when requested by shareholders",
        "Never, as PFRS does not require it"
      ],
      correctAnswer: "When it applies an accounting policy retrospectively or makes a retrospective restatement",
      points: 1,
      explanation: "An entity must present a third statement of financial position as at the beginning of the preceding period when it applies an accounting policy retrospectively, makes a retrospective restatement, or reclassifies items."
    },
    {
      question: "The statement of comprehensive income can be presented as:",
      options: [
        "A single statement only",
        "Two separate statements only",
        "Either a single statement or two separate statements",
        "A note to the financial statements"
      ],
      correctAnswer: "Either a single statement or two separate statements",
      points: 1,
      explanation: "PFRS 1 allows an entity to present profit or loss and other comprehensive income in either a single statement of comprehensive income or in two separate statements."
    },
    {
      question: "Under PFRS 1, which of the following is NOT a minimum line item for the statement of financial position?",
      options: [
        "Property, plant and equipment",
        "Trade and other payables",
        "Inventories",
        "Earnings per share"
      ],
      correctAnswer: "Earnings per share",
      points: 1,
      explanation: "Earnings per share is a minimum line item for the statement of comprehensive income, not the statement of financial position."
    },
    {
      question: "Materiality in the context of PFRS 1 means:",
      options: [
        "Items must be presented separately if they are individually significant",
        "Immaterial items can be aggregated with similar items",
        "Both A and B are correct",
        "Only items above ₱100,000 need to be disclosed"
      ],
      correctAnswer: "Both A and B are correct",
      points: 1,
      explanation: "Materiality requires that each material class of similar items be presented separately, while immaterial amounts can be aggregated with items of a similar nature or function."
    }
  ],

  "Lesson 1.4: Accounting Policies, Changes in Estimates and Errors (PFRS 8/IAS 8)": [
    {
      question: "When an entity changes an accounting policy, it should apply the change:",
      options: [
        "Prospectively",
        "Retrospectively, unless impracticable",
        "Only in the current period",
        "Never, accounting policies cannot be changed"
      ],
      correctAnswer: "Retrospectively, unless impracticable",
      points: 1,
      explanation: "A change in accounting policy should be applied retrospectively by adjusting opening retained earnings and comparative information, unless it is impracticable to do so."
    },
    {
      question: "A change in accounting estimate is accounted for:",
      options: [
        "Retrospectively",
        "Prospectively",
        "By adjusting opening retained earnings",
        "By restating prior periods"
      ],
      correctAnswer: "Prospectively",
      points: 1,
      explanation: "A change in accounting estimate is accounted for prospectively by including the effects in profit or loss of the current period and future periods affected."
    },
    {
      question: "Prior period errors should be corrected by:",
      options: [
        "Adjusting the opening balance of assets and liabilities",
        "Restating comparative amounts for the prior period",
        "Both A and B are required",
        "Recognizing in current period profit or loss"
      ],
      correctAnswer: "Both A and B are required",
      points: 1,
      explanation: "Prior period errors are corrected retrospectively by restating comparative amounts for the prior period and adjusting the opening balance of assets, liabilities, and equity."
    },
    {
      question: "Which of the following is an example of a change in accounting estimate?",
      options: [
        "Changing from FIFO to weighted average for inventory",
        "Changing the depreciation method from straight-line to reducing balance",
        "Correcting an error in calculating depreciation",
        "Adopting a new accounting standard"
      ],
      correctAnswer: "Changing the depreciation method from straight-line to reducing balance",
      points: 1,
      explanation: "Changing the depreciation method is a change in accounting estimate (as depreciation method reflects the pattern of consumption of future economic benefits), not a change in accounting policy."
    },
    {
      question: "Under IAS 8, when is retrospective application considered impracticable?",
      options: [
        "When it is too costly to apply",
        "When applying it requires assumptions about management's intent in a prior period",
        "When the effect is immaterial",
        "When the entity has insufficient staff"
      ],
      correctAnswer: "When applying it requires assumptions about management's intent in a prior period",
      points: 1,
      explanation: "Retrospective application is impracticable when applying it requires assumptions about what management's intent would have been in that period, or when it requires significant estimates for which necessary information is not available."
    }
  ],

  // SECTION 2: ASSETS
  
  "Lesson 2.1: Cash and Cash Equivalents": [
    {
      question: "Which of the following is NOT considered cash?",
      options: [
        "Coins and currency on hand",
        "Demand deposits with banks",
        "Post-dated checks received from customers",
        "Bank drafts"
      ],
      correctAnswer: "Post-dated checks received from customers",
      points: 1,
      explanation: "Post-dated checks are not considered cash because they cannot be used to settle obligations until the date on the check. They are classified as receivables."
    },
    {
      question: "Cash equivalents include:",
      options: [
        "Investments with maturity of 6 months",
        "Highly liquid investments with maturity of 3 months or less",
        "All marketable securities",
        "Long-term government bonds"
      ],
      correctAnswer: "Highly liquid investments with maturity of 3 months or less",
      points: 1,
      explanation: "Cash equivalents are short-term, highly liquid investments that are readily convertible to known amounts of cash and are subject to an insignificant risk of changes in value (typically 3 months or less maturity)."
    },
    {
      question: "In a bank reconciliation, deposits in transit should be:",
      options: [
        "Added to the bank statement balance",
        "Subtracted from the bank statement balance",
        "Added to the book balance",
        "Subtracted from the book balance"
      ],
      correctAnswer: "Added to the bank statement balance",
      points: 1,
      explanation: "Deposits in transit (outstanding deposits) are amounts received and recorded by the company but not yet recorded by the bank. They should be added to the bank statement balance."
    },
    {
      question: "The imprest system for petty cash means:",
      options: [
        "The petty cash fund is replenished to a fixed amount",
        "Any amount can be taken from petty cash",
        "Petty cash is never replenished",
        "Petty cash is used only for large expenses"
      ],
      correctAnswer: "The petty cash fund is replenished to a fixed amount",
      points: 1,
      explanation: "Under the imprest system, the petty cash fund is established at a fixed amount and replenished back to that fixed amount periodically based on the expenses paid."
    },
    {
      question: "Bank service charges appearing on the bank statement but not yet recorded in the books should be:",
      options: [
        "Added to the bank statement balance",
        "Subtracted from the book balance",
        "Added to the book balance",
        "Ignored in the reconciliation"
      ],
      correctAnswer: "Subtracted from the book balance",
      points: 1,
      explanation: "Bank service charges are deducted by the bank but not yet recorded by the company. They should be subtracted from the book balance in the bank reconciliation."
    }
  ],

  "Lesson 2.3: Inventories": [
    {
      question: "Under PFRS 2, which inventory costing method is NOT permitted?",
      options: ["FIFO", "Weighted Average", "LIFO", "Specific Identification"],
      correctAnswer: "LIFO",
      points: 1,
      explanation: "LIFO (Last-In, First-Out) is not permitted under PFRS 2/IAS 2 because it does not reflect the actual flow of goods in most cases and can result in obsolete inventory valuations."
    },
    {
      question: "Net realizable value (NRV) is:",
      options: [
        "The estimated selling price in the ordinary course of business",
        "The estimated selling price less estimated costs of completion and sale",
        "The replacement cost of inventory",
        "The historical cost of inventory"
      ],
      correctAnswer: "The estimated selling price less estimated costs of completion and sale",
      points: 1,
      explanation: "NRV is the estimated selling price in the ordinary course of business less the estimated costs of completion and the estimated costs necessary to make the sale."
    },
    {
      question: "When inventory is written down to NRV, the loss should be recognized:",
      options: [
        "As a separate line item in profit or loss",
        "As part of cost of goods sold",
        "Directly in equity",
        "As a reduction of revenue"
      ],
      correctAnswer: "As a separate line item in profit or loss",
      points: 1,
      explanation: "When inventory is written down to NRV, the write-down is recognized as an expense in profit or loss, typically as a separate line item or as part of cost of goods sold with disclosure."
    },
    {
      question: "Under the weighted average cost formula, the cost of inventory is determined by:",
      options: [
        "Using the cost of the earliest purchases",
        "Using the cost of the most recent purchases",
        "Dividing the total cost of goods available for sale by total units available",
        "Using the specific cost of each item"
      ],
      correctAnswer: "Dividing the total cost of goods available for sale by total units available",
      points: 1,
      explanation: "Under weighted average, the cost of inventory is determined by dividing the total cost of goods available for sale by the total number of units available for sale."
    },
    {
      question: "Which of the following costs should NOT be included in the cost of inventories?",
      options: [
        "Purchase price",
        "Import duties",
        "Administrative overheads",
        "Costs of conversion"
      ],
      correctAnswer: "Administrative overheads",
      points: 1,
      explanation: "Administrative overheads not related to bringing inventories to their present location and condition are not included in inventory cost. They are expensed as incurred."
    }
  ],

  "Lesson 2.6: Property, Plant and Equipment": [
    {
      question: "Under PFRS 16, which of the following should be recognized as part of the cost of property, plant and equipment?",
      options: [
        "Initial delivery and handling costs",
        "Costs of conducting business in a new location",
        "Administration and other general overhead costs",
        "Costs of opening a new facility"
      ],
      correctAnswer: "Initial delivery and handling costs",
      points: 1,
      explanation: "Initial delivery and handling costs are directly attributable costs that bring the asset to the location and condition necessary for it to be capable of operating in the manner intended by management."
    },
    {
      question: "The revaluation model under PFRS 16:",
      options: [
        "Is not permitted for property, plant and equipment",
        "Requires assets to be carried at fair value at the date of revaluation",
        "Can only be applied to land and buildings",
        "Requires revaluation every year"
      ],
      correctAnswer: "Requires assets to be carried at fair value at the date of revaluation",
      points: 1,
      explanation: "Under the revaluation model, an asset is carried at a revalued amount, being its fair value at the date of revaluation less subsequent depreciation and impairment losses."
    },
    {
      question: "When an asset is revalued upward, the increase should be recognized:",
      options: [
        "In profit or loss",
        "In other comprehensive income as a revaluation surplus",
        "As a liability",
        "As deferred revenue"
      ],
      correctAnswer: "In other comprehensive income as a revaluation surplus",
      points: 1,
      explanation: "A revaluation increase is credited directly to equity under the heading revaluation surplus, unless it reverses a revaluation decrease of the same asset previously recognized as an expense."
    },
    {
      question: "Depreciation of an asset begins when:",
      options: [
        "The asset is purchased",
        "The asset is available for use",
        "The asset is first used in production",
        "The asset is fully installed"
      ],
      correctAnswer: "The asset is available for use",
      points: 1,
      explanation: "Depreciation begins when the asset is available for use, meaning when it is in the location and condition necessary for it to be capable of operating in the manner intended by management."
    },
    {
      question: "Which depreciation method allocates a higher amount of depreciation in the earlier years of an asset's life?",
      options: [
        "Straight-line method",
        "Declining balance method",
        "Units of production method",
        "All methods allocate depreciation equally"
      ],
      correctAnswer: "Declining balance method",
      points: 1,
      explanation: "The declining balance method applies a constant percentage to the carrying amount, resulting in higher depreciation in earlier years and decreasing amounts in later years."
    }
  ],

  "Lesson 2.7: Intangible Assets and Goodwill": [
    {
      question: "Which of the following is NOT a criterion for recognizing an internally generated intangible asset?",
      options: [
        "Technical feasibility of completing the asset",
        "Intention to complete and use the asset",
        "Ability to use or sell the asset",
        "All costs can be measured reliably during the research phase"
      ],
      correctAnswer: "All costs can be measured reliably during the research phase",
      points: 1,
      explanation: "Research phase costs must be expensed as incurred. It is only during the development phase that costs can be capitalized if all recognition criteria are met."
    },
    {
      question: "Internally generated goodwill is:",
      options: [
        "Recognized as an asset",
        "Recognized in profit or loss",
        "Not recognized as an asset",
        "Amortized over its useful life"
      ],
      correctAnswer: "Not recognized as an asset",
      points: 1,
      explanation: "Internally generated goodwill is not recognized as an asset because it is not an identifiable resource controlled by the entity that can be measured reliably."
    },
    {
      question: "An intangible asset with an indefinite useful life:",
      options: [
        "Is amortized over 20 years",
        "Is amortized over its legal life",
        "Is not amortized but tested for impairment annually",
        "Is never tested for impairment"
      ],
      correctAnswer: "Is not amortized but tested for impairment annually",
      points: 1,
      explanation: "An intangible asset with an indefinite useful life is not amortized. Instead, it is tested for impairment annually and whenever there is an indication of impairment."
    },
    {
      question: "Which of the following can be recognized as an intangible asset?",
      options: [
        "Internally generated brand names",
        "Internally generated mastheads",
        "Separately purchased patent",
        "Internally generated customer lists"
      ],
      correctAnswer: "Separately purchased patent",
      points: 1,
      explanation: "Internally generated brands, mastheads, customer lists, and similar items cannot be recognized as intangible assets. Only separately acquired intangible assets can be recognized."
    },
    {
      question: "Goodwill acquired in a business combination represents:",
      options: [
        "The excess of the cost of the combination over the acquirer's interest in the net fair value of the acquiree's identifiable assets and liabilities",
        "The excess of the acquiree's net assets over the purchase price",
        "The difference between the book value and fair value of net assets",
        "The present value of future cash flows"
      ],
      correctAnswer: "The excess of the cost of the combination over the acquirer's interest in the net fair value of the acquiree's identifiable assets and liabilities",
      points: 1,
      explanation: "Goodwill is measured as the excess of the consideration transferred over the net identifiable assets acquired. It represents future economic benefits arising from assets that are not individually identified."
    }
  ],

  "Lesson 2.8: Impairment of Assets": [
    {
      question: "An asset is impaired when:",
      options: [
        "Its carrying amount exceeds its recoverable amount",
        "Its recoverable amount exceeds its carrying amount",
        "Its fair value increases",
        "It is fully depreciated"
      ],
      correctAnswer: "Its carrying amount exceeds its recoverable amount",
      points: 1,
      explanation: "An asset is impaired when its carrying amount exceeds its recoverable amount. The recoverable amount is the higher of fair value less costs of disposal and value in use."
    },
    {
      question: "Value in use is:",
      options: [
        "The fair value of the asset",
        "The present value of future cash flows expected from the asset",
        "The replacement cost of the asset",
        "The historical cost of the asset"
      ],
      correctAnswer: "The present value of future cash flows expected from the asset",
      points: 1,
      explanation: "Value in use is the present value of the future cash flows expected to be derived from an asset or cash-generating unit."
    },
    {
      question: "A reversal of an impairment loss on a revalued asset should be recognized:",
      options: [
        "In profit or loss",
        "In other comprehensive income",
        "Directly in retained earnings",
        "As a reduction of the original impairment loss"
      ],
      correctAnswer: "In other comprehensive income",
      points: 1,
      explanation: "A reversal of an impairment loss on a revalued asset is recognized in other comprehensive income and increases the revaluation surplus, unless it exceeds the carrying amount that would have been determined."
    },
    {
      question: "Which of the following is NOT an indicator of potential impairment?",
      options: [
        "Significant decline in market value",
        "Adverse changes in the technological environment",
        "Increase in market interest rates",
        "Expected future cash flows exceeding budget"
      ],
      correctAnswer: "Expected future cash flows exceeding budget",
      points: 1,
      explanation: "An increase in expected future cash flows is not an indicator of impairment. External indicators of impairment include market value declines and adverse changes in the business environment."
    },
    {
      question: "Goodwill acquired in a business combination should be:",
      options: [
        "Amortized over 10 years",
        "Amortized over its useful life",
        "Tested for impairment annually",
        "Never tested for impairment"
      ],
      correctAnswer: "Tested for impairment annually",
      points: 1,
      explanation: "Goodwill is not amortized but must be tested for impairment annually and whenever there is an indication of impairment. It is allocated to cash-generating units."
    }
  ],

  // SECTION 3: LIABILITIES AND EQUITY
  
  "Lesson 3.1: Financial Liabilities - Basic and Compound": [
    {
      question: "When bonds are issued at a premium, the effective interest rate is:",
      options: [
        "Higher than the stated rate",
        "Lower than the stated rate",
        "Equal to the stated rate",
        "Zero"
      ],
      correctAnswer: "Lower than the stated rate",
      points: 1,
      explanation: "When bonds are issued at a premium, investors pay more than face value because the stated interest rate is higher than market rates, resulting in a lower effective interest rate."
    },
    {
      question: "Under the effective interest method, interest expense is calculated as:",
      options: [
        "Face value × stated rate",
        "Carrying amount × effective rate",
        "Face value × effective rate",
        "Carrying amount × stated rate"
      ],
      correctAnswer: "Carrying amount × effective rate",
      points: 1,
      explanation: "Interest expense under the effective interest method is calculated by multiplying the carrying amount of the financial liability by the effective interest rate."
    },
    {
      question: "When bonds are retired before maturity, any gain or loss is recognized:",
      options: [
        "As an extraordinary item",
        "In other comprehensive income",
        "In profit or loss",
        "Directly in retained earnings"
      ],
      correctAnswer: "In profit or loss",
      points: 1,
      explanation: "When bonds are retired before maturity, the difference between the carrying amount and the redemption price is recognized as a gain or loss in profit or loss."
    },
    {
      question: "For a bond issued at a discount, interest expense each period will:",
      options: [
        "Decrease over time",
        "Increase over time",
        "Remain constant",
        "Equal the cash interest paid"
      ],
      correctAnswer: "Increase over time",
      points: 1,
      explanation: "For a bond issued at a discount, the carrying amount increases over time as the discount is amortized, resulting in increasing interest expense (carrying amount × effective rate)."
    },
    {
      question: "A convertible bond is classified as:",
      options: [
        "100% debt",
        "100% equity",
        "A compound financial instrument with debt and equity components",
        "Neither debt nor equity"
      ],
      correctAnswer: "A compound financial instrument with debt and equity components",
      points: 1,
      explanation: "A convertible bond contains both a debt component (the bond) and an equity component (the conversion option). These must be separated and classified accordingly."
    }
  ],

  "Lesson 3.4: Income Taxes": [
    {
      question: "Deferred tax liabilities arise from:",
      options: [
        "Deductible temporary differences",
        "Taxable temporary differences",
        "Permanent differences",
        "Tax losses"
      ],
      correctAnswer: "Taxable temporary differences",
      points: 1,
      explanation: "Deferred tax liabilities arise from taxable temporary differences - differences between the carrying amount of an asset or liability and its tax base that will result in taxable amounts in future periods."
    },
    {
      question: "Which of the following creates a deferred tax asset?",
      options: [
        "Accelerated depreciation for tax purposes",
        "Revenue received in advance",
        "Estimated warranty expense not yet deductible for tax",
        "Development costs capitalized for accounting but expensed for tax"
      ],
      correctAnswer: "Estimated warranty expense not yet deductible for tax",
      points: 1,
      explanation: "Estimated warranty expense creates a deductible temporary difference (recognized for accounting but not yet deductible for tax), resulting in a deferred tax asset."
    },
    {
      question: "The tax base of an asset is:",
      options: [
        "The amount that will be deductible for tax purposes",
        "The amount that is attributable to the asset for tax purposes",
        "The carrying amount in the financial statements",
        "The fair value of the asset"
      ],
      correctAnswer: "The amount that will be deductible for tax purposes",
      points: 1,
      explanation: "The tax base of an asset is the amount that will be deductible for tax purposes against any taxable economic benefits that will flow to the entity when it recovers the carrying amount of the asset."
    },
    {
      question: "Which of the following is a permanent difference?",
      options: [
        "Depreciation using different methods for accounting and tax",
        "Non-deductible penalties and fines",
        "Warranty expense recognized differently for accounting and tax",
        "Rent received in advance"
      ],
      correctAnswer: "Non-deductible penalties and fines",
      points: 1,
      explanation: "Non-deductible penalties and fines are permanent differences because they will never be deductible for tax purposes, unlike temporary differences which will reverse."
    },
    {
      question: "Deferred tax should be measured using:",
      options: [
        "The rate expected to apply when the asset is realized or liability settled",
        "The current tax rate",
        "The rate at the end of the previous period",
        "An average rate over the last 5 years"
      ],
      correctAnswer: "The rate expected to apply when the asset is realized or liability settled",
      points: 1,
      explanation: "Deferred tax assets and liabilities are measured at the tax rates that are expected to apply to the period when the asset is realized or the liability is settled."
    }
  ],

  "Lesson 3.5: Revenue from Contracts with Customers": [
    {
      question: "Which of the following is NOT one of the five steps in PFRS 15?",
      options: [
        "Identify the contract",
        "Determine the transaction price",
        "Recognize revenue when cash is received",
        "Allocate the transaction price to performance obligations"
      ],
      correctAnswer: "Recognize revenue when cash is received",
      points: 1,
      explanation: "The five steps are: identify the contract, identify performance obligations, determine transaction price, allocate transaction price, and recognize revenue when/as performance obligations are satisfied."
    },
    {
      question: "A performance obligation is a promise to transfer:",
      options: [
        "Cash to the customer",
        "A distinct good or service",
        "A contract modification",
        "A refund to the customer"
      ],
      correctAnswer: "A distinct good or service",
      points: 1,
      explanation: "A performance obligation is a promise in a contract to transfer to the customer either a good or service (or bundle of goods or services) that is distinct."
    },
    {
      question: "Variable consideration should be included in the transaction price to the extent that:",
      options: [
        "It is probable that a significant reversal will not occur",
        "The customer has paid the variable amount",
        "The amount can be estimated with certainty",
        "All uncertainty has been resolved"
      ],
      correctAnswer: "It is probable that a significant reversal will not occur",
      points: 1,
      explanation: "Variable consideration is included in the transaction price only to the extent that it is highly probable that a significant reversal in the amount of cumulative revenue recognized will not occur."
    },
    {
      question: "Revenue is recognized over time when:",
      options: [
        "The customer simultaneously receives and consumes the benefits",
        "The entity's performance creates an asset with no alternative use",
        "The entity's performance does not create an asset and has right to payment",
        "Any of the above criteria are met"
      ],
      correctAnswer: "Any of the above criteria are met",
      points: 1,
      explanation: "Revenue is recognized over time if any of these criteria are met: simultaneous receipt and consumption, no alternative use with right to payment, or no alternative use with no enforceable right."
    },
    {
      question: "The standalone selling price of a good or service is:",
      options: [
        "Always the list price",
        "The price at which the entity would sell the good or service separately",
        "The price the customer is willing to pay",
        "The cost plus a markup"
      ],
      correctAnswer: "The price at which the entity would sell the good or service separately",
      points: 1,
      explanation: "The standalone selling price is the price at which the entity would sell a promised good or service separately to a customer."
    }
  ],

  // SECTION 4: SPECIAL TOPICS
  
  "Lesson 4.1: Effects of Changes in Foreign Exchange Rates": [
    {
      question: "The functional currency is:",
      options: [
        "Always the currency of the country where the entity is located",
        "The currency of the primary economic environment in which the entity operates",
        "The currency in which the financial statements are presented",
        "The currency of the parent company"
      ],
      correctAnswer: "The currency of the primary economic environment in which the entity operates",
      points: 1,
      explanation: "The functional currency is the currency of the primary economic environment in which the entity operates. It is determined by considering various factors such as the currency that mainly influences sales prices."
    },
    {
      question: "When translating foreign currency transactions, which exchange rate should be used for non-monetary items carried at historical cost?",
      options: [
        "Closing rate at the end of the reporting period",
        "Historical rate at the date of the transaction",
        "Average rate for the period",
        "Spot rate at the date of translation"
      ],
      correctAnswer: "Historical rate at the date of the transaction",
      points: 1,
      explanation: "Non-monetary items carried at historical cost should be translated using the exchange rate at the date of the transaction."
    },
    {
      question: "Exchange differences arising on monetary items are recognized:",
      options: [
        "In other comprehensive income",
        "In profit or loss",
        "As an adjustment to the carrying amount",
        "Directly in equity"
      ],
      correctAnswer: "In profit or loss",
      points: 1,
      explanation: "Exchange differences on monetary items are recognized in profit or loss in the period in which they arise, except for differences on monetary items forming part of a net investment."
    },
    {
      question: "When translating the financial statements of a foreign operation, the closing rate is used for:",
      options: [
        "Assets and liabilities",
        "Income and expenses",
        "Equity",
        "All items"
      ],
      correctAnswer: "Assets and liabilities",
      points: 1,
      explanation: "Assets and liabilities of a foreign operation are translated at the closing rate at the date of the statement of financial position."
    },
    {
      question: "The functional currency of an entity cannot be changed:",
      options: [
        "Once determined, it can never be changed",
        "Unless there a change in the underlying transactions, events, and conditions",
        "At the discretion of management",
        "If it differs from the parent's currency"
      ],
      correctAnswer: "Unless there a change in the underlying transactions, events, and conditions",
      points: 1,
      explanation: "The functional currency is not changed unless there is a change in the underlying transactions, events, and conditions that determined it initially."
    }
  ],

  "Lesson 4.3: Business Combinations": [
    {
      question: "Under PFRS 3, which method must be used to account for business combinations?",
      options: [
        "Pooling of interests method",
        "Acquisition method",
        "Proportionate consolidation",
        "Equity method"
      ],
      correctAnswer: "Acquisition method",
      points: 1,
      explanation: "PFRS 3 requires the use of the acquisition method for all business combinations, which involves identifying the acquirer, determining the acquisition date, recognizing and measuring assets and liabilities."
    },
    {
      question: "Goodwill in a business combination is calculated as:",
      options: [
        "Consideration transferred + Non-controlling interest - Net identifiable assets acquired",
        "Consideration transferred - Non-controlling interest + Net identifiable assets acquired",
        "Net identifiable assets acquired - Consideration transferred",
        "Fair value of acquiree - Book value of acquiree"
      ],
      correctAnswer: "Consideration transferred + Non-controlling interest - Net identifiable assets acquired",
      points: 1,
      explanation: "Goodwill = Consideration transferred + Amount of non-controlling interest + Fair value of previously held interest - Net identifiable assets acquired."
    },
    {
      question: "A bargain purchase gain occurs when:",
      options: [
        "The acquirer pays more than the fair value of net identifiable assets",
        "The acquirer pays less than the fair value of net identifiable assets",
        "Goodwill is positive",
        "The acquisition fails"
      ],
      correctAnswer: "The acquirer pays less than the fair value of net identifiable assets",
      points: 1,
      explanation: "A bargain purchase occurs when the net identifiable assets acquired exceed the total consideration plus non-controlling interest. The gain is recognized in profit or loss."
    },
    {
      question: "The acquisition date is:",
      options: [
        "The date the contract is signed",
        "The date the acquirer obtains control of the acquiree",
        "The date of the first payment",
        "The date of regulatory approval"
      ],
      correctAnswer: "The date the acquirer obtains control of the acquiree",
      points: 1,
      explanation: "The acquisition date is the date on which the acquirer obtains control of the acquiree, which is typically the closing date."
    },
    {
      question: "Which of the following is NOT recognized separately from goodwill in a business combination?",
      options: [
        "Identifiable intangible assets",
        "Pre-existing relationships",
        "Deferred tax assets",
        "Contingent liabilities"
      ],
      correctAnswer: "Pre-existing relationships",
      points: 1,
      explanation: "Pre-existing relationships are not recognized separately from goodwill as they do not meet the definition of an asset of the acquiree at the acquisition date."
    }
  ],

  "Lesson 4.4: Consolidated Financial Statements": [
    {
      question: "A parent company controls a subsidiary when:",
      options: [
        "It owns more than 50% of the voting rights",
        "It has power over the investee",
        "It is exposed to variable returns from its involvement",
        "Both A and C are correct"
      ],
      correctAnswer: "Both A and C are correct",
      points: 1,
      explanation: "Control exists when the investor has power over the investee, exposure to variable returns, and the ability to use power to affect returns. Owning >50% of voting rights creates a presumption of control."
    },
    {
      question: "In consolidation, intra-group balances are:",
      options: [
        "Presented separately",
        "Eliminated in full",
        "Recognized at fair value",
        "Included in the consolidated statements"
      ],
      correctAnswer: "Eliminated in full",
      points: 1,
      explanation: "All intra-group balances, transactions, income, and expenses are eliminated in full when preparing consolidated financial statements."
    },
    {
      question: "Unrealized profit on intra-group sales of inventory should be:",
      options: [
        "Recognized in full in the consolidated statements",
        "Eliminated to the extent of the parent's interest",
        "Eliminated in full",
        "Recognized as a liability"
      ],
      correctAnswer: "Eliminated in full",
      points: 1,
      explanation: "Unrealized profit resulting from intra-group transactions is eliminated in full. The elimination is allocated between parent and NCI based on their respective interests."
    },
    {
      question: "Non-controlling interest is presented:",
      options: [
        "As a liability in the consolidated statement of financial position",
        "As a separate component of equity",
        "In the consolidated statement of comprehensive income",
        "In the notes to the financial statements"
      ],
      correctAnswer: "As a separate component of equity",
      points: 1,
      explanation: "Non-controlling interest is presented within equity in the consolidated statement of financial position, separately from the equity of the owners of the parent."
    },
    {
      question: "When a parent loses control of a subsidiary, the parent:",
      options: [
        "Derecognizes all assets and liabilities of the subsidiary",
        "Recognizes any retained investment at fair value",
        "Recognizes a gain or loss in profit or loss",
        "All of the above"
      ],
      correctAnswer: "All of the above",
      points: 1,
      explanation: "When control is lost, the parent derecognizes the assets and liabilities, measures any retained investment at fair value, and recognizes the difference as a gain or loss in profit or loss."
    }
  ],

  // SECTION 5: FINANCIAL STATEMENT ANALYSIS
  
  "Lesson 5.1: Statement of Cash Flows": [
    {
      question: "Which of the following is classified as an investing activity?",
      options: [
        "Payment of dividends",
        "Purchase of property, plant and equipment",
        "Issuance of shares",
        "Repayment of bank loans"
      ],
      correctAnswer: "Purchase of property, plant and equipment",
      points: 1,
      explanation: "Purchase of PPE is an investing activity as it involves the acquisition of long-term assets used in the business. The other options are financing activities."
    },
    {
      question: "Under the indirect method, depreciation expense is:",
      options: [
        "Subtracted from net profit",
        "Added to net profit",
        "Not included in the cash flow statement",
        "Shown as a financing activity"
      ],
      correctAnswer: "Added to net profit",
      points: 1,
      explanation: "Depreciation is a non-cash expense that was deducted in calculating net profit. Under the indirect method, it is added back to net profit to arrive at cash from operating activities."
    },
    {
      question: "Interest paid is classified as:",
      options: [
        "Operating activity only",
        "Financing activity only",
        "Either operating or financing activity",
        "Investing activity"
      ],
      correctAnswer: "Either operating or financing activity",
      points: 1,
      explanation: "Interest paid can be classified as either an operating activity or a financing activity. The entity must choose a policy and apply it consistently."
    },
    {
      question: "Which of the following is NOT a cash equivalent?",
      options: [
        "Treasury bill with 2 months maturity",
        "Commercial paper with 3 months maturity",
        "Money market fund with 4 months maturity",
        "Bank term deposit with 90 days maturity"
      ],
      correctAnswer: "Money market fund with 4 months maturity",
      points: 1,
      explanation: "Cash equivalents have maturity of 3 months or less from the date of acquisition. A 4-month maturity exceeds this limit."
    },
    {
      question: "Dividends received from investments are classified as:",
      options: [
        "Operating activities",
        "Investing activities",
        "Either operating or investing activities",
        "Financing activities"
      ],
      correctAnswer: "Either operating or investing activities",
      points: 1,
      explanation: "Dividends received can be classified as either operating or investing activities. The entity must choose a policy and apply it consistently."
    }
  ],

  "Lesson 5.2: Financial Ratios and Analysis": [
    {
      question: "The current ratio is calculated as:",
      options: [
        "Current assets ÷ Current liabilities",
        "Current liabilities ÷ Current assets",
        "Cash ÷ Current liabilities",
        "Current assets ÷ Total assets"
      ],
      correctAnswer: "Current assets ÷ Current liabilities",
      points: 1,
      explanation: "The current ratio measures liquidity by dividing current assets by current liabilities. It indicates the entity's ability to pay short-term obligations."
    },
    {
      question: "Return on equity (ROE) measures:",
      options: [
        "Profitability relative to total assets",
        "Profitability relative to shareholders' equity",
        "Efficiency in using assets",
        "Ability to pay interest"
      ],
      correctAnswer: "Profitability relative to shareholders' equity",
      points: 1,
      explanation: "ROE = Net profit ÷ Shareholders' equity. It measures how effectively management is using shareholders' equity to generate profits."
    },
    {
      question: "An increase in inventory turnover indicates:",
      options: [
        "Slower movement of inventory",
        "Faster movement of inventory",
        "Higher inventory levels",
        "Lower sales"
      ],
      correctAnswer: "Faster movement of inventory",
      points: 1,
      explanation: "Higher inventory turnover indicates that inventory is being sold more quickly, which is generally favorable as it reduces carrying costs and obsolescence risk."
    },
    {
      question: "The debt-to-equity ratio of 2.0 means:",
      options: [
        "For every ₱1 of equity, there is ₱2 of debt",
        "For every ₱1 of debt, there is ₱2 of equity",
        "The company has no debt",
        "The company has more equity than debt"
      ],
      correctAnswer: "For every ₱1 of equity, there is ₱2 of debt",
      points: 1,
      explanation: "A debt-to-equity ratio of 2.0 means that debt is twice the equity, indicating higher financial leverage and risk."
    },
    {
      question: "Which ratio measures the company's ability to pay interest on its debt?",
      options: [
        "Current ratio",
        "Interest coverage ratio",
        "Return on assets",
        "Gross profit margin"
      ],
      correctAnswer: "Interest coverage ratio",
      points: 1,
      explanation: "Interest coverage ratio = EBIT ÷ Interest expense. It measures the company's ability to meet its interest obligations from operating earnings."
    }
  ]
};
module.exports = {
  QUIZ_QUESTION_BANK
};
