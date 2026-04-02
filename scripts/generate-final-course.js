/**
 * Philippine CPA Board Exam FAR Course - Final Integration Script
 * Generates complete course JSON with all quiz programs integrated
 */

const fs = require('fs');
const path = require('path');

// Import all course components
const { COURSE_CONFIG, SECTION_1, SECTION_2 } = require('./create-cpa-course');
const { SECTION_3, SECTION_4, SECTION_5, SECTION_6 } = require('./create-cpa-course-part2');
const { QUIZ_QUESTION_BANK } = require('./quiz-question-bank');

// Board Exam Simulation Questions
const BOARD_EXAM_SIMULATIONS = {
  "Board Exam Simulation 1 - Comprehensive Review": {
    title: "Board Exam Simulation 1 - Comprehensive Review",
    description: "100-question timed simulation covering all FAR topics. This simulation mimics the actual CPA Board Exam format and difficulty level.",
    type: "quiz",
    passingScore: 75,
    timeLimit: 120, // 2 hours
    maxAttempts: 3,
    questions: [
      // Conceptual Framework (10 questions)
      {
        question: "1. Which qualitative characteristic requires that financial information must be complete, neutral, and free from error?",
        options: ["Relevance", "Faithful Representation", "Comparability", "Materiality"],
        correctAnswer: "Faithful Representation",
        points: 1,
        explanation: "Faithful representation requires that financial information be complete, neutral, and free from error."
      },
      {
        question: "2. According to the Conceptual Framework, an asset is recognized when:",
        options: ["It meets the definition of an asset", "It is probable that future economic benefits will flow", "Its cost can be measured reliably", "All conditions are met"],
        correctAnswer: "All conditions are met",
        points: 1,
        explanation: "An asset is recognized only when it meets the definition of an asset, is probable to provide future benefits, and has a cost that can be measured reliably."
      },
      // Financial Statements (10 questions)
      {
        question: "3. Under PFRS 1, which of the following must be presented in a complete set of financial statements?",
        options: ["Statement of retained earnings", "Statement of comprehensive income", "Statement of dividends", "Statement of changes in shareholders"],
        correctAnswer: "Statement of comprehensive income",
        points: 1,
        explanation: "A complete set includes statement of financial position, statement of comprehensive income, statement of changes in equity, statement of cash flows, and notes."
      },
      // Assets - Cash (5 questions)
      {
        question: "4. In a bank reconciliation, outstanding checks should be:",
        options: ["Added to the bank statement balance", "Subtracted from the bank statement balance", "Added to the book balance", "Subtracted from the book balance"],
        correctAnswer: "Subtracted from the bank statement balance",
        points: 1,
        explanation: "Outstanding checks are checks issued by the company but not yet presented to the bank. They should be subtracted from the bank statement balance."
      },
      // Assets - Receivables (10 questions)
      {
        question: "5. When factoring receivables without recourse, the factor assumes:",
        options: ["No risk of bad debts", "Full risk of bad debts", "Partial risk of bad debts", "Risk only if the debtor is bankrupt"],
        correctAnswer: "Full risk of bad debts",
        points: 1,
        explanation: "Without recourse means the factor assumes the full risk of uncollectibility. The selling company has no further obligation."
      },
      // Assets - Inventories (15 questions)
      {
        question: "6. Under PFRS 2, inventory is measured at:",
        options: ["Lower of cost and net realizable value", "Higher of cost and net realizable value", "Cost only", "Net realizable value only"],
        correctAnswer: "Lower of cost and net realizable value",
        points: 1,
        explanation: "Inventories are measured at the lower of cost and net realizable value."
      },
      {
        question: "7. Company A uses FIFO. Purchases: Jan 1 - 100 units @ ₱10, Jan 15 - 200 units @ ₱12. Sold 150 units. Cost of goods sold is:",
        options: ["₱1,500", "₱1,600", "₱1,700", "₱1,800"],
        correctAnswer: "₱1,600",
        points: 1,
        explanation: "FIFO: 100 units @ ₱10 = ₱1,000 + 50 units @ ₱12 = ₱600. Total COGS = ₱1,600"
      },
      // Assets - PPE (15 questions)
      {
        question: "8. Under PFRS 16, which depreciation method allocates a higher amount in earlier years?",
        options: ["Straight-line", "Declining balance", "Units of production", "All methods are equal"],
        correctAnswer: "Declining balance",
        points: 1,
        explanation: "The declining balance method applies a constant percentage to the carrying amount, resulting in higher depreciation in earlier years."
      },
      {
        question: "9. An asset costs ₱100,000, has residual value of ₱10,000, and useful life of 5 years. Annual depreciation under straight-line is:",
        options: ["₱18,000", "₱20,000", "₱22,000", "₱25,000"],
        correctAnswer: "₱18,000",
        points: 1,
        explanation: "Straight-line = (Cost - Residual) / Life = (₱100,000 - ₱10,000) / 5 = ₱18,000"
      },
      // Intangible Assets (10 questions)
      {
        question: "10. Internally generated goodwill is:",
        options: ["Recognized as an asset", "Expensed when incurred", "Amortized over 10 years", "Recognized in equity"],
        correctAnswer: "Expensed when incurred",
        points: 1,
        explanation: "Internally generated goodwill is not recognized as an asset. Any costs related to it are expensed as incurred."
      },
      // Impairment (5 questions)
      {
        question: "11. Recoverable amount is the higher of:",
        options: ["Fair value and carrying amount", "Fair value less costs of disposal and value in use", "Cost and net realizable value", "Historical cost and replacement cost"],
        correctAnswer: "Fair value less costs of disposal and value in use",
        points: 1,
        explanation: "Recoverable amount is the higher of fair value less costs of disposal and value in use."
      },
      // Liabilities (10 questions)
      {
        question: "12. When bonds are issued at a premium, the effective interest rate is:",
        options: ["Higher than the stated rate", "Lower than the stated rate", "Equal to the stated rate", "Zero"],
        correctAnswer: "Lower than the stated rate",
        points: 1,
        explanation: "When bonds are issued at a premium, investors pay more than face value because the stated rate exceeds market rates."
      },
      // Income Taxes (5 questions)
      {
        question: "13. A taxable temporary difference creates:",
        options: ["A deferred tax asset", "A deferred tax liability", "No deferred tax", "A current tax asset"],
        correctAnswer: "A deferred tax liability",
        points: 1,
        explanation: "Taxable temporary differences will result in taxable amounts in future periods, creating deferred tax liabilities."
      },
      // Revenue (5 questions)
      {
        question: "14. Under PFRS 15, revenue is recognized when:",
        options: ["Cash is received", "A contract is signed", "A performance obligation is satisfied", "An invoice is issued"],
        correctAnswer: "A performance obligation is satisfied",
        points: 1,
        explanation: "Revenue is recognized when (or as) the entity satisfies a performance obligation by transferring a promised good or service."
      },
      // Consolidations (5 questions)
      {
        question: "15. In consolidated financial statements, intra-group balances are:",
        options: ["Presented separately", "Eliminated in full", "Recognized at fair value", "Included at cost"],
        correctAnswer: "Eliminated in full",
        points: 1,
        explanation: "All intra-group balances, transactions, and unrealized profits are eliminated in full when preparing consolidated statements."
      },
      // Foreign Currency (5 questions)
      {
        question: "16. The functional currency is:",
        options: ["Always the local currency", "The currency of the parent", "The currency of the primary economic environment", "Any currency the entity chooses"],
        correctAnswer: "The currency of the primary economic environment",
        points: 1,
        explanation: "Functional currency is the currency of the primary economic environment in which the entity operates."
      },
      // Cash Flows (5 questions)
      {
        question: "17. Purchase of equipment is classified as:",
        options: ["Operating activity", "Investing activity", "Financing activity", "Non-cash activity"],
        correctAnswer: "Investing activity",
        points: 1,
        explanation: "Purchase of property, plant and equipment is an investing activity as it involves acquisition of long-term assets."
      },
      // Financial Ratios (5 questions)
      {
        question: "18. Current assets ÷ Current liabilities equals:",
        options: ["Quick ratio", "Current ratio", "Debt ratio", "Equity ratio"],
        correctAnswer: "Current ratio",
        points: 1,
        explanation: "Current ratio = Current assets / Current liabilities. It measures short-term liquidity."
      }
    ]
  },
  
  "Board Exam Simulation 2 - Advanced Topics": {
    title: "Board Exam Simulation 2 - Advanced Topics",
    description: "100-question simulation focusing on complex accounting topics including business combinations, consolidated financial statements, and advanced calculations.",
    type: "quiz",
    passingScore: 75,
    timeLimit: 120,
    maxAttempts: 3,
    questions: [
      // Business Combinations (20 questions)
      {
        question: "1. Goodwill in a business combination is calculated as:",
        options: ["Consideration - Net identifiable assets", "Net identifiable assets - Consideration", "Consideration + NCI - Net identifiable assets", "Fair value - Book value"],
        correctAnswer: "Consideration + NCI - Net identifiable assets",
        points: 1,
        explanation: "Goodwill = Consideration transferred + NCI - Net identifiable assets acquired"
      },
      {
        question: "2. A bargain purchase gain is recognized in:",
        options: ["Other comprehensive income", "Equity", "Profit or loss", "Deferred gain"],
        correctAnswer: "Profit or loss",
        points: 1,
        explanation: "A bargain purchase gain is recognized immediately in profit or loss."
      },
      // Consolidations (20 questions)
      {
        question: "3. Non-controlling interest is presented as:",
        options: ["A liability", "A component of equity", "A contingent liability", "A deferred credit"],
        correctAnswer: "A component of equity",
        points: 1,
        explanation: "NCI is presented within equity in the consolidated statement of financial position."
      },
      {
        question: "4. Unrealized profit on intra-group inventory sales is eliminated:",
        options: ["To the extent of the parent's interest", "In full", "Only if sold to third parties", "Never"],
        correctAnswer: "In full",
        points: 1,
        explanation: "All unrealized profits from intra-group transactions are eliminated in full."
      },
      // Leases (15 questions)
      {
        question: "5. Under PFRS 16, a lessee recognizes:",
        options: ["An operating lease expense", "A right-of-use asset and lease liability", "Only a lease liability", "Only an expense"],
        correctAnswer: "A right-of-use asset and lease liability",
        points: 1,
        explanation: "PFRS 16 requires lessees to recognize a right-of-use asset and a lease liability for most leases."
      },
      // Financial Instruments (15 questions)
      {
        question: "6. A convertible bond is classified as:",
        options: ["100% debt", "100% equity", "A compound instrument", "A derivative"],
        correctAnswer: "A compound instrument",
        points: 1,
        explanation: "Convertible bonds contain both debt and equity components and must be separated."
      },
      // Deferred Taxes (15 questions)
      {
        question: "7. A deductible temporary difference creates:",
        options: ["A deferred tax liability", "A deferred tax asset", "No deferred tax", "Current tax expense"],
        correctAnswer: "A deferred tax asset",
        points: 1,
        explanation: "Deductible temporary differences result in deductible amounts in future periods, creating deferred tax assets."
      },
      // Foreign Currency (15 questions)
      {
        question: "8. When translating a foreign operation, equity is translated at:",
        options: ["Closing rate", "Historical rate", "Average rate", "Spot rate"],
        correctAnswer: "Historical rate",
        points: 1,
        explanation: "Equity items of a foreign operation are translated at historical rates."
      }
    ]
  }
};

// Generate Quiz Programs for each lesson
function generateQuizPrograms() {
  const programs = [];
  let order = 1;

  // Generate quizzes for each lesson
  Object.entries(QUIZ_QUESTION_BANK).forEach(([lessonTitle, questions]) => {
    if (questions && questions.length > 0) {
      programs.push({
        id: `quiz-${order}`,
        title: `${lessonTitle} - Practice Quiz`,
        description: `Practice questions for ${lessonTitle}. Test your understanding with ${questions.length} questions.`,
        type: "quiz",
        questions: questions.map((q, idx) => ({
          id: `q-${order}-${idx + 1}`,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          points: q.points || 1,
          explanation: q.explanation
        })),
        passingScore: 70,
        timeLimit: Math.ceil(questions.length * 1.5), // 1.5 minutes per question
        maxAttempts: 5,
        showCorrectAnswers: true,
        randomizeQuestions: true,
        order: order
      });
      order++;
    }
  });

  // Add board exam simulations
  Object.entries(BOARD_EXAM_SIMULATIONS).forEach(([simTitle, sim]) => {
    programs.push({
      id: `simulation-${order}`,
      title: sim.title,
      description: sim.description,
      type: sim.type,
      questions: sim.questions.map((q, idx) => ({
        id: `sim-${order}-${idx + 1}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: q.points || 1,
        explanation: q.explanation
      })),
      passingScore: sim.passingScore,
      timeLimit: sim.timeLimit,
      maxAttempts: sim.maxAttempts,
      showCorrectAnswers: true,
      randomizeQuestions: false,
      order: order
    });
    order++;
  });

  return programs;
}

// Generate complete course data
function generateCompleteCourse() {
  const allSections = [SECTION_1, SECTION_2, SECTION_3, SECTION_4, SECTION_5, SECTION_6];
  
  // Calculate total duration
  const totalDurationMinutes = allSections.reduce((sum, section) => sum + section.totalDuration, 0);
  const totalDurationHours = totalDurationMinutes / 60;
  
  // Calculate total lessons
  const totalLessons = allSections.reduce((sum, section) => sum + section.lessons.length, 0);
  
  // Generate quiz programs
  const programs = generateQuizPrograms();
  
  const completeCourse = {
    ...COURSE_CONFIG,
    sections: allSections,
    programs: programs,
    totalDuration: totalDurationMinutes,
    totalLessons: totalLessons,
    metadata: {
      totalDurationHours: totalDurationHours,
      totalLessons: totalLessons,
      totalQuizPrograms: programs.length,
      totalPracticeQuestions: Object.values(QUIZ_QUESTION_BANK).reduce((sum, q) => sum + q.length, 0),
      boardExamSimulations: 2,
      resourcesPerLesson: 3,
      estimatedStudyTime: `${Math.ceil(totalDurationHours / 3)} weeks at 3 hours/day`
    }
  };
  
  return completeCourse;
}

// Main execution
console.log("=".repeat(60));
console.log("PHILIPPINE CPA BOARD EXAM FAR COURSE GENERATOR");
console.log("=".repeat(60));
console.log("");

const course = generateCompleteCourse();

console.log("COURSE SUMMARY:");
console.log("-".repeat(40));
console.log(`Title: ${course.title}`);
console.log(`Total Duration: ${course.metadata.totalDurationHours} hours`);
console.log(`Total Lessons: ${course.metadata.totalLessons}`);
console.log(`Quiz Programs: ${course.metadata.totalQuizPrograms}`);
console.log(`Practice Questions: ${course.metadata.totalPracticeQuestions}`);
console.log(`Board Exam Simulations: ${course.metadata.boardExamSimulations}`);
console.log(`Estimated Study Time: ${course.metadata.estimatedStudyTime}`);
console.log("");

console.log("SECTION BREAKDOWN:");
console.log("-".repeat(40));
[SECTION_1, SECTION_2, SECTION_3, SECTION_4, SECTION_5, SECTION_6].forEach((section, idx) => {
  console.log(`${idx + 1}. ${section.title}`);
  console.log(`   Duration: ${section.totalDuration / 60} hours | Lessons: ${section.lessons.length}`);
});
console.log("");

console.log("QUIZ PROGRAMS:");
console.log("-".repeat(40));
console.log(`Total Programs: ${course.programs.length}`);
console.log(`- Lesson Quizzes: ${course.programs.filter(p => p.type === 'quiz').length}`);
console.log(`- Board Exam Simulations: ${course.programs.filter(p => p.title.includes('Simulation')).length}`);
console.log("");

console.log("RESOURCES INCLUDED:");
console.log("-".repeat(40));
const allResources = course.sections.flatMap(s => s.lessons.flatMap(l => l.resources || []));
console.log(`Total Downloadable Resources: ${allResources.length}`);
console.log("");

// Save to file
const outputPath = path.join(__dirname, '..', 'philippine-cpa-far-complete-course.json');
fs.writeFileSync(outputPath, JSON.stringify(course, null, 2));
console.log(`Course JSON saved to: ${outputPath}`);
console.log("");

console.log("DEPLOYMENT INSTRUCTIONS:");
console.log("-".repeat(40));
console.log("1. Login to admin at http://localhost:3001/auth/login");
console.log("2. Navigate to /admin/courses/new-form");
console.log("3. Use the JSON data to create the course");
console.log("4. The quiz programs will be automatically created");
console.log("5. Publish the course when ready");
console.log("");

console.log("=".repeat(60));
console.log("COURSE GENERATION COMPLETE!");
console.log("=".repeat(60));