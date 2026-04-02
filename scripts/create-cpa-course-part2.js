/**
 * Philippine CPA Board Exam FAR Course - Part 2
 * Continuing with Sections 3-6 and Quiz System Integration
 */

// Section 3: Liabilities and Equity (16 hours)
const SECTION_3 = {
  title: "Section 3: Liabilities and Equity",
  description: "Comprehensive coverage of financial liabilities, provisions, employee benefits, equity components, and revenue recognition",
  order: 3,
  totalDuration: 960, // 16 hours in minutes
  lessons: [
    {
      title: "Lesson 3.1: Financial Liabilities - Basic and Compound",
      description: `**Learning Objectives:**
• Classify financial liabilities as FVTPL or amortized cost
• Account for bonds payable
• Account for compound financial instruments
• Apply the effective interest rate method

**Key Topics:**
1. Classification of Financial Liabilities
   - Amortized Cost
   - Fair Value Through Profit or Loss
2. Bonds Payable
   - Issuance at Face Value
   - Issuance at Premium
   - Issuance at Discount
   - Effective Interest Rate Method
   - Straight-line Method (if not materially different)
3. Bond Retirement
   - Before Maturity
   - Conversion
   - Exercise of Warrants
4. Compound Financial Instruments
   - Convertible Bonds
   - Bonds with Warrants
   - Separation of Debt and Equity Components
5. Disclosure Requirements
6. Worked Examples and Practice Problems`,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 240, // 4 hours
      order: 1,
      isFree: false,
      resources: [
        { title: "Bonds Payable Calculation Workbook", url: "/resources/cpa-far/bonds-payable-calc.xlsx" },
        { title: "Effective Interest Rate Method Guide", url: "/resources/cpa-far/effective-interest-guide.pdf" },
        { title: "Convertible Bonds Separation Example", url: "/resources/cpa-far/convertible-bonds.pdf" },
        { title: "Financial Liabilities Practice Problems (50 Questions)", url: "/resources/cpa-far/financial-liabilities-practice.pdf" }
      ]
    },
    {
      title: "Lesson 3.2: Provisions, Contingent Liabilities and Contingent Assets",
      description: `**Learning Objectives:**
• Distinguish between provisions, contingent liabilities, and contingent assets
• Recognize and measure provisions
• Apply the best estimate and expected value methods
• Account for onerous contracts

**Key Topics:**
1. Scope of PFRS 37/IAS 37
2. Definitions
   - Provisions
   - Other Liabilities
   - Contingent Liabilities
3. Recognition of Provisions
   - Present Obligation
   - Probable Outflow
   - Reliable Estimate
4. Measurement
   - Best Estimate
   - Risks and Uncertainties
   - Present Value
   - Expected Value
5. Specific Applications
   - Future Operating Losses
   - Onerous Contracts
   - Restructuring
6. Contingent Assets
7. Disclosure Requirements
8. Philippine Setting Examples
   - Warranty Provisions
   - Legal Claims
   - Environmental Provisions`,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 180, // 3 hours
      order: 2,
      isFree: false,
      resources: [
        { title: "Provision Recognition Decision Tree", url: "/resources/cpa-far/provision-decision-tree.pdf" },
        { title: "Contingent Liability Classification Guide", url: "/resources/cpa-far/contingent-liability-guide.pdf" },
        { title: "Provisions Practice Problems (35 Questions)", url: "/resources/cpa-far/provisions-practice.pdf" }
      ]
    },
    {
      title: "Lesson 3.3: Employee Benefits",
      description: `**Learning Objectives:**
• Classify employee benefits as short-term or post-employment
• Account for defined contribution plans
• Account for defined benefit plans
• Apply the projected unit credit method

**Key Topics:**
1. Scope of PFRS 19/IAS 19
2. Short-term Employee Benefits
   - Wages, Salaries, Social Security Contributions
   - Short-term Compensated Absences
   - Profit-sharing and Bonus Plans
3. Post-employment Benefits
   - Defined Contribution Plans
   - Defined Benefit Plans
     * Present Value of Defined Benefit Obligation
     * Fair Value of Plan Assets
     * Net Defined Benefit Liability/Asset
     * Service Cost
     * Net Interest
     * Remeasurements
4. Other Long-term Employee Benefits
5. Termination Benefits
6. Disclosure Requirements
7. Philippine SSS, PhilHealth, Pag-IBIG Contributions
8. Worked Examples with Calculations`,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 240, // 4 hours
      order: 3,
      isFree: false,
      resources: [
        { title: "Defined Benefit Plan Calculation Worksheet", url: "/resources/cpa-far/defined-benefit-calc.xlsx" },
        { title: "Projected Unit Credit Method Guide", url: "/resources/cpa-far/projected-unit-credit.pdf" },
        { title: "Employee Benefits Practice Problems (40 Questions)", url: "/resources/cpa-far/employee-benefits-practice.pdf" },
        { title: "Philippine Government Contributions Reference", url: "/resources/cpa-far/ph-contributions.pdf" }
      ]
    },
    {
      title: "Lesson 3.4: Income Taxes",
      description: `**Learning Objectives:**
• Distinguish between current and deferred tax
• Identify temporary differences
• Account for deferred tax assets and liabilities
• Apply the balance sheet liability method

**Key Topics:**
1. Current Tax
   - Taxable Income Calculation
   - Current Tax Assets and Liabilities
2. Deferred Tax
   - Temporary Differences
     * Taxable Temporary Differences
     * Deductible Temporary Differences
   - Deferred Tax Liabilities
   - Deferred Tax Assets
     * Recognition Criteria
     * Recoverability Assessment
3. Tax Base
   - Assets
   - Liabilities
4. Exceptions to Recognition
   - Goodwill
   - Initial Recognition of Assets/Liabilities
5. Measurement
6. Presentation and Disclosure
7. Philippine Income Tax Rate (30% Corporate Rate)
8. Detailed Worked Examples
9. Board Exam Problem Solving Techniques`,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 300, // 5 hours
      order: 4,
      isFree: false,
      resources: [
        { title: "Deferred Tax Calculation Workbook", url: "/resources/cpa-far/deferred-tax-calc.xlsx" },
        { title: "Temporary Differences Identification Guide", url: "/resources/cpa-far/temporary-differences.pdf" },
        { title: "Tax Base Determination Checklist", url: "/resources/cpa-far/tax-base-checklist.pdf" },
        { title: "Income Taxes Practice Problems (60 Questions)", url: "/resources/cpa-far/income-taxes-practice.pdf" }
      ]
    },
    {
      title: "Lesson 3.5: Revenue from Contracts with Customers",
      description: `**Learning Objectives:**
• Apply the five-step revenue recognition model
• Identify performance obligations
• Determine transaction price
• Allocate transaction price to performance obligations
• Recognize revenue when obligations are satisfied

**Key Topics:**
1. Five-Step Model (PFRS 15/IFRS 15)
   - Step 1: Identify the Contract
   - Step 2: Identify Performance Obligations
   - Step 3: Determine Transaction Price
     * Variable Consideration
     * Constraining Estimates
     * Significant Financing Component
     * Non-cash Consideration
     * Consideration Payable to Customer
   - Step 4: Allocate Transaction Price
     * Standalone Selling Price
     * Allocation Methods
   - Step 5: Recognize Revenue
     * Point in Time
     * Over Time
2. Contract Modifications
3. Contract Costs
   - Costs to Obtain a Contract
   - Costs to Fulfill a Contract
4. Disclosure Requirements
5. Philippine Industry Examples
   - Real Estate Sales
   - Construction Contracts
   - Software Licensing
   - Service Agreements`,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 300, // 5 hours
      order: 5,
      isFree: false,
      resources: [
        { title: "PFRS 15 Five-Step Model Summary", url: "/resources/cpa-far/pfrs15-five-step.pdf" },
        { title: "Revenue Recognition Decision Tree", url: "/resources/cpa-far/revenue-decision-tree.pdf" },
        { title: "Transaction Price Calculation Worksheet", url: "/resources/cpa-far/transaction-price-calc.xlsx" },
        { title: "Revenue Recognition Practice Problems (55 Questions)", url: "/resources/cpa-far/revenue-practice.pdf" },
        { title: "Philippine Revenue Recognition Examples", url: "/resources/cpa-far/ph-revenue-examples.pdf" }
      ]
    }
  ]
};

// Section 4: Special Topics (16 hours)
const SECTION_4 = {
  title: "Section 4: Special Topics and Business Combinations",
  description: "Advanced topics including foreign currency, leases, business combinations, and consolidated financial statements",
  order: 4,
  totalDuration: 960, // 16 hours in minutes
  lessons: [
    {
      title: "Lesson 4.1: Effects of Changes in Foreign Exchange Rates",
      description: `**Learning Objectives:**
• Account for foreign currency transactions
• Translate foreign operations' financial statements
• Apply the functional currency concept
• Account for net investment in a foreign operation

**Key Topics:**
1. Scope of PFRS 21/IAS 21
2. Functional Currency
   - Determination
   - Change in Functional Currency
3. Foreign Currency Transactions
   - Initial Recognition
   - Subsequent Measurement
   - Exchange Differences
4. Translation of Foreign Operations
   - Assets and Liabilities
   - Income and Expenses
   - Goodwill and Fair Value Adjustments
   - Exchange Differences in OCI
5. Net Investment in a Foreign Operation
6. Disposal of Foreign Operation
7. Disclosure Requirements
8. Philippine Peso as Functional Currency
9. Worked Examples with Multiple Currencies`,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 180, // 3 hours
      order: 1,
      isFree: false,
      resources: [
        { title: "Foreign Exchange Calculation Workbook", url: "/resources/cpa-far/forex-calc.xlsx" },
        { title: "Functional Currency Determination Guide", url: "/resources/cpa-far/functional-currency.pdf" },
        { title: "Foreign Exchange Practice Problems (45 Questions)", url: "/resources/cpa-far/forex-practice.pdf" }
      ]
    },
    {
      title: "Lesson 4.2: Leases",
      description: `**Learning Objectives:**
• Identify lease contracts
• Account for leases as lessee
• Account for leases as lessor
• Apply the right-of-use model

**Key Topics:**
1. Definition and Identification (PFRS 16/IFRS 16)
   - Identified Asset
   - Right to Control Use
2. Lessee Accounting
   - Recognition Exemptions
   - Initial Measurement
     * Right-of-use Asset
     * Lease Liability
   - Subsequent Measurement
     * Depreciation
     * Interest Expense
     * Variable Lease Payments
3. Lessor Accounting
   - Finance Lease
   - Operating Lease
   - Manufacturer or Dealer Lessor
4. Sale and Leaseback Transactions
5. Disclosure Requirements
6. Philippine Setting Examples
   - Property Leases
   - Vehicle Leases
   - Equipment Leases`,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 240, // 4 hours
      order: 2,
      isFree: false,
      resources: [
        { title: "Lease Calculation Workbook", url: "/resources/cpa-far/lease-calc.xlsx" },
        { title: "Lessee vs Lessor Accounting Comparison", url: "/resources/cpa-far/lessee-lessor.pdf" },
        { title: "Lease Practice Problems (50 Questions)", url: "/resources/cpa-far/lease-practice.pdf" }
      ]
    },
    {
      title: "Lesson 4.3: Business Combinations",
      description: `**Learning Objectives:**
• Identify business combinations
• Apply the acquisition method
• Calculate goodwill or bargain purchase
• Account for step acquisitions and loss of control

**Key Topics:**
1. Scope of PFRS 3/IFRS 3
2. Identifying a Business Combination
   - Definition of a Business
   - Identifying the Acquirer
3. Acquisition Method
   - Determining the Acquisition Date
   - Recognizing and Measuring Assets and Liabilities
     * Fair Value Measurement
     * Exceptions to Fair Value
   - Recognizing and Measuring Non-controlling Interest
   - Recognizing and Measuring Goodwill or Bargain Purchase
4. Measurement Period
5. Presentation and Disclosure
6. Step Acquisitions and Disposals
7. Business Combinations Under Common Control
8. Philippine Setting Examples
9. Detailed Worked Examples`,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 300, // 5 hours
      order: 3,
      isFree: false,
      resources: [
        { title: "Purchase Price Allocation Worksheet", url: "/resources/cpa-far/ppa-worksheet.xlsx" },
        { title: "Goodwill Calculation Guide", url: "/resources/cpa-far/goodwill-calculation.pdf" },
        { title: "Business Combinations Practice Problems (60 Questions)", url: "/resources/cpa-far/business-combinations-practice.pdf" }
      ]
    },
    {
      title: "Lesson 4.4: Consolidated Financial Statements",
      description: `**Learning Objectives:**
• Determine control and identify subsidiaries
• Prepare consolidated statement of financial position
• Prepare consolidated statement of comprehensive income
• Account for non-controlling interests
• Account for intra-group transactions

**Key Topics:**
1. Control (PFRS 10/IFRS 10)
   - Power over the Investee
   - Exposure to Variable Returns
   - Ability to Use Power
2. Consolidation Procedures
   - Combined Financial Statements
   - Elimination of Intra-group Balances
   - Elimination of Intra-group Transactions
     * Unrealized Profits
     * Dividends
3. Non-controlling Interests
   - Full Goodwill Method
   - Partial Goodwill Method
4. Changes in Ownership Interests
   - Loss of Control
   - Retained Interest
5. Separate Financial Statements (PFRS 27)
6. Disclosure Requirements
7. Consolidation Workpaper Examples
8. Complex Group Structures`,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 360, // 6 hours
      order: 4,
      isFree: false,
      resources: [
        { title: "Consolidation Workpaper Template", url: "/resources/cpa-far/consolidation-workpaper.xlsx" },
        { title: "Elimination Entries Guide", url: "/resources/cpa-far/elimination-entries.pdf" },
        { title: "NCI Calculation Worksheet", url: "/resources/cpa-far/nci-calc.xlsx" },
        { title: "Consolidation Practice Problems (70 Questions)", url: "/resources/cpa-far/consolidation-practice.pdf" },
        { title: "Complex Group Structure Examples", url: "/resources/cpa-far/complex-groups.pdf" }
      ]
    }
  ]
};

// Section 5: Financial Statement Analysis (10 hours)
const SECTION_5 = {
  title: "Section 5: Financial Statement Analysis and Interpretation",
  description: "Comprehensive analysis of financial statements including ratio analysis, trend analysis, and statement of cash flows",
  order: 5,
  totalDuration: 600, // 10 hours in minutes
  lessons: [
    {
      title: "Lesson 5.1: Statement of Cash Flows",
      description: `**Learning Objectives:**
• Classify cash flows into operating, investing, and financing activities
• Prepare statement of cash flows using direct method
• Prepare statement of cash flows using indirect method
• Analyze and interpret cash flow information

**Key Topics:**
1. Objective and Usefulness (PFRS 7/IAS 7)
2. Classification of Cash Flows
   - Operating Activities
   - Investing Activities
   - Financing Activities
3. Direct Method
   - Receipts from Customers
   - Payments to Suppliers
   - Payments to Employees
   - Interest and Dividends
   - Income Tax Paid
4. Indirect Method
   - Starting with Profit Before Tax
   - Adjustments for Non-cash Items
   - Changes in Working Capital
5. Disclosures
   - Cash and Cash Equivalents
   - Restricted Cash
   - Non-cash Transactions
6. Analysis of Cash Flow Information
7. Detailed Worked Examples
8. Board Exam Problem Solving Techniques`,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 300, // 5 hours
      order: 1,
      isFree: false,
      resources: [
        { title: "Cash Flow Classification Guide", url: "/resources/cpa-far/cash-flow-classification.pdf" },
        { title: "Direct vs Indirect Method Comparison", url: "/resources/cpa-far/direct-indirect-method.pdf" },
        { title: "Cash Flow Statement Template", url: "/resources/cpa-far/cash-flow-template.xlsx" },
        { title: "Cash Flow Practice Problems (50 Questions)", url: "/resources/cpa-far/cash-flow-practice.pdf" }
      ]
    },
    {
      title: "Lesson 5.2: Financial Ratios and Analysis",
      description: `**Learning Objectives:**
• Calculate and interpret key financial ratios
• Perform horizontal and vertical analysis
• Analyze profitability, liquidity, and solvency
• Identify limitations of financial statement analysis

**Key Topics:**
1. Horizontal Analysis
   - Trend Analysis
   - Year-over-Year Changes
2. Vertical Analysis
   - Common Size Statements
   - Industry Comparisons
3. Ratio Analysis
   - Liquidity Ratios
     * Current Ratio
     * Quick Ratio
     * Cash Ratio
   - Solvency Ratios
     * Debt to Equity
     * Debt to Assets
     * Interest Coverage
   - Profitability Ratios
     * Gross Profit Margin
     * Net Profit Margin
     * Return on Assets
     * Return on Equity
   - Efficiency Ratios
     * Asset Turnover
     * Inventory Turnover
     * Receivables Turnover
   - Market Ratios
     * Earnings per Share
     * Price-Earnings Ratio
     * Dividend Yield
4. DuPont Analysis
5. Limitations of Financial Analysis
6. Industry Benchmarks
7. Philippine Setting Examples`,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 240, // 4 hours
      order: 2,
      isFree: false,
      resources: [
        { title: "Financial Ratios Formula Sheet", url: "/resources/cpa-far/ratios-formula.pdf" },
        { title: "Ratio Analysis Workbook", url: "/resources/cpa-far/ratio-analysis.xlsx" },
        { title: "Financial Analysis Practice Problems (45 Questions)", url: "/resources/cpa-far/financial-analysis-practice.pdf" },
        { title: "Industry Benchmark Data 2024", url: "/resources/cpa-far/industry-benchmarks.pdf" }
      ]
    },
    {
      title: "Lesson 5.3: Ethical Considerations in Financial Reporting",
      description: `**Learning Objectives:**
• Understand the role of ethics in accounting
• Identify ethical dilemmas in financial reporting
• Apply the Code of Ethics for Professional Accountants
• Recognize common financial reporting frauds

**Key Topics:**
1. Philippine Code of Ethics for Professional Accountants
   - Fundamental Principles
     * Integrity
     * Objectivity
     * Professional Competence
     * Confidentiality
     * Professional Behavior
   - Threats and Safeguards
2. Ethical Dilemmas in Financial Reporting
   - Revenue Recognition Manipulation
   - Expense Deferral
   - Off-balance Sheet Financing
   - Creative Accounting
3. Professional Skepticism
4. Whistleblowing
5. Corporate Governance
   - Board Responsibilities
   - Audit Committee
6. Anti-fraud Controls
7. Case Studies
   - Philippine Corporate Scandals
   - International Accounting Scandals
8. Exam Ethics Questions`,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 60, // 1 hour
      order: 3,
      isFree: false,
      resources: [
        { title: "Code of Ethics Summary", url: "/resources/cpa-far/code-of-ethics.pdf" },
        { title: "Ethical Dilemma Case Studies", url: "/resources/cpa-far/ethical-dilemmas.pdf" }
      ]
    }
  ]
};

// Section 6: Board Exam Preparation (10 hours)
const SECTION_6 = {
  title: "Section 6: Board Exam Preparation and Simulation",
  description: "Intensive preparation for the CPA Board Exam including exam strategies, timed simulations, and performance analytics",
  order: 6,
  totalDuration: 600, // 10 hours in minutes
  lessons: [
    {
      title: "Lesson 6.1: Exam Strategies and Time Management",
      description: `**Learning Objectives:**
• Understand the CPA Board Exam format and structure
• Develop effective time management strategies
• Learn problem-solving techniques
• Avoid common exam mistakes

**Key Topics:**
1. CPA Board Exam Format
   - FAR Section Overview
   - Question Types and Scoring
   - Passing Score Requirements
2. Time Management
   - 4-hour Exam Strategy
   - Question Pacing
   - Flagging and Reviewing
3. Problem-Solving Techniques
   - Reading Questions Effectively
   - Identifying Key Information
   - Elimination Method
   - Calculator Tips and Tricks
4. Common Mistakes to Avoid
   - Calculation Errors
   - Misreading Questions
   - Time Pressure Mistakes
5. Exam Day Preparation
   - What to Bring
   - What to Expect
   - Mental Preparation
6. Post-Exam Analysis
7. Success Stories from Topnotchers`,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 120, // 2 hours
      order: 1,
      isFree: false,
      resources: [
        { title: "Exam Strategy Guide", url: "/resources/cpa-far/exam-strategy.pdf" },
        { title: "Time Management Calculator", url: "/resources/cpa-far/time-management.xlsx" },
        { title: "Common Mistakes Checklist", url: "/resources/cpa-far/common-mistakes.pdf" }
      ]
    },
    {
      title: "Lesson 6.2: Board Exam Simulation 1 - Comprehensive Review",
      description: `**Learning Objectives:**
• Complete a timed 100-question board exam simulation
• Apply time management under exam conditions
• Analyze performance and identify weak areas
• Review detailed explanations for each question

**Simulation Details:**
• Duration: 2 hours
• Questions: 100 multiple choice
• Coverage: All FAR topics
• Difficulty: Mixed (Easy, Medium, Hard)
• Passing Score: 75%

**Topics Covered:**
• Conceptual Framework and PFRS
• Assets (Current and Non-Current)
• Liabilities and Provisions
• Equity and Revenue
• Financial Statement Analysis`,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 180, // 3 hours (including review)
      order: 2,
      isFree: false,
      resources: [
        { title: "Board Exam Simulation 1 Questions", url: "/resources/cpa-far/simulation1-questions.pdf" },
        { title: "Board Exam Simulation 1 Answer Key", url: "/resources/cpa-far/simulation1-answers.pdf" },
        { title: "Board Exam Simulation 1 Explanations", url: "/resources/cpa-far/simulation1-explanations.pdf" }
      ]
    },
    {
      title: "Lesson 6.3: Board Exam Simulation 2 - Advanced Topics",
      description: `**Learning Objectives:**
• Complete a challenging 100-question simulation
• Focus on advanced and complex topics
• Master multi-step calculations
• Build confidence for the actual exam

**Simulation Details:**
• Duration: 2 hours
• Questions: 100 multiple choice
• Coverage: Advanced FAR topics
• Difficulty: Medium to Hard
• Passing Score: 75%

**Topics Covered:**
• Business Combinations and Consolidations
• Financial Instruments
• Leases and Revenue Recognition
• Foreign Currency Transactions
• Deferred Taxes`,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 180, // 3 hours (including review)
      order: 3,
      isFree: false,
      resources: [
        { title: "Board Exam Simulation 2 Questions", url: "/resources/cpa-far/simulation2-questions.pdf" },
        { title: "Board Exam Simulation 2 Answer Key", url: "/resources/cpa-far/simulation2-answers.pdf" },
        { title: "Board Exam Simulation 2 Explanations", url: "/resources/cpa-far/simulation2-explanations.pdf" }
      ]
    },
    {
      title: "Lesson 6.4: Performance Analytics and Final Review",
      description: `**Learning Objectives:**
• Analyze performance across all simulations
• Identify personal strengths and weaknesses
• Create a final study plan
• Build confidence for exam day

**Topics Covered:**
1. Performance Dashboard
   - Overall Score Analysis
   - Topic-by-Topic Breakdown
   - Time Management Analysis
   - Question Type Performance
2. Weak Area Identification
   - Most Missed Topics
   - Common Error Patterns
   - Calculation vs Theory Performance
3. Final Study Plan
   - Priority Topics
   - Time Allocation
   - Practice Strategies
4. Confidence Building
   - Positive Mindset
   - Stress Management
   - Exam Day Visualization
5. Last-Minute Tips
   - Formula Sheet Review
   - Key Definitions
   - Common Board Exam Questions
6. Q&A Session
   - Addressing Student Concerns
   - Clarifying Difficult Concepts
   - Final Motivation`,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 120, // 2 hours
      order: 4,
      isFree: false,
      resources: [
        { title: "Performance Analytics Template", url: "/resources/cpa-far/performance-analytics.xlsx" },
        { title: "Final Study Plan Template", url: "/resources/cpa-far/final-study-plan.pdf" },
        { title: "Last-Minute Formula Sheet", url: "/resources/cpa-far/last-minute-formulas.pdf" },
        { title: "Top 100 Most Common Board Exam Questions", url: "/resources/cpa-far/top100-questions.pdf" }
      ]
    }
  ]
};

// Quiz Questions Generator for each lesson
const QUIZ_QUESTIONS = {
  "Lesson 1.1": [
    {
      question: "Which of the following is NOT a fundamental qualitative characteristic of useful financial information according to the Conceptual Framework?",
      options: ["Relevance", "Faithful Representation", "Comparability", "Materiality"],
      correctAnswer: "Comparability",
      points: 1,
      explanation: "Comparability is an enhancing qualitative characteristic, not a fundamental one. The fundamental qualitative characteristics are Relevance and Faithful Representation."
    },
    {
      question: "Under the Conceptual Framework, an item is recognized in the financial statements when:",
      options: [
        "It meets the definition of an element",
        "It is probable that future economic benefits will flow",
        "It has a cost or value that can be measured reliably",
        "All of the above"
      ],
      correctAnswer: "All of the above",
      points: 1,
      explanation: "Recognition criteria require that an item meets the definition of an element, is probable to provide future economic benefits, and has a cost or value that can be measured reliably."
    }
  ],
  "Lesson 1.2": [
    {
      question: "Which body is responsible for the formulation of accounting standards in the Philippines?",
      options: ["BOA", "FRSC", "SEC", "BIR"],
      correctAnswer: "FRSC",
      points: 1,
      explanation: "The Financial Reporting Standards Council (FRSC) is the standard-setting body for accounting standards in the Philippines."
    }
  ],
  "Lesson 2.3": [
    {
      question: "Under PFRS 2, which inventory cost formula is NOT acceptable?",
      options: ["FIFO", "Weighted Average", "LIFO", "Specific Identification"],
      correctAnswer: "LIFO",
      points: 1,
      explanation: "LIFO (Last-In, First-Out) is not permitted under PFRS 2/IAS 2. Only FIFO, Weighted Average, and Specific Identification are acceptable."
    }
  ]
};

// Export all sections and questions
module.exports = {
  SECTION_3,
  SECTION_4,
  SECTION_5,
  SECTION_6,
  QUIZ_QUESTIONS
};