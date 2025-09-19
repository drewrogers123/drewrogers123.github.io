// Problem database structure
const problemBank = {
    // Difficulty levels (1-10, where 1 is easiest)
    difficultyLevels: 10,
    
    // Problem templates by subject and topic
    problems: {
        math: {
            algebra: [
                {
                    id: 'alg1',
                    difficulty: 1,
                    question: "Solve for x: $2x + 5 = 15$",
                    answer: "5",
                    solution: "Subtract 5 from both sides: $2x = 10$. Then divide both sides by 2: $x = 5$.",
                    tags: ["linear equations", "solving for x"]
                },
                {
                    id: 'alg2',
                    difficulty: 3,
                    question: "Factor the quadratic: $x^2 - 5x + 6$",
                    answer: "(x-2)(x-3)",
                    solution: "Find two numbers that multiply to 6 and add to -5. The numbers are -2 and -3, so the factored form is $(x-2)(x-3)$.",
                    tags: ["factoring", "quadratics"]
                }
            ],
            calculus: [
                {
                    id: 'calc1',
                    difficulty: 2,
                    question: "Find the derivative of $f(x) = 3x^2 + 2x - 5$",
                    answer: "6x + 2",
                    solution: "Apply the power rule to each term: $\\frac{d}{dx}(3x^2) = 6x$, $\\frac{d}{dx}(2x) = 2$, $\\frac{d}{dx}(-5) = 0$. So, $f'(x) = 6x + 2$.",
                    tags: ["derivatives", "power rule"]
                }
            ]
        },
        physics: {
            mechanics: [
                {
                    id: 'mech1',
                    difficulty: 2,
                    question: "A car accelerates from rest at $2 \\text{ m/s}^2$ for 5 seconds. What is its final velocity?",
                    answer: "10",
                    units: "m/s",
                    solution: "Using $v = u + at$ where $u=0$, $a=2\\text{ m/s}^2$, $t=5\\text{ s}$: $v = 0 + (2)(5) = 10\\text{ m/s}$.",
                    tags: ["kinematics", "constant acceleration"]
                }
            ]
        }
    },
    
    // User progress tracking
    userProgress: {
        currentDifficulty: 1,
        correctCount: 0,
        incorrectCount: 0,
        currentStreak: 0,
        bestStreak: 0,
        lastSubject: null,
        lastTopic: null,
        problemHistory: []
    },
    
    // Get a random problem based on current difficulty and topic
    getProblem: function(subject, topic) {
        // Filter problems by subject and topic
        let availableProblems = [];
        
        // First try to find problems in the exact topic
        if (this.problems[subject] && this.problems[subject][topic]) {
            availableProblems = this.problems[subject][topic];
        }
        
        // If no problems in exact topic, try to find in the same subject
        if (availableProblems.length === 0 && this.problems[subject]) {
            Object.values(this.problems[subject]).forEach(problems => {
                availableProblems = availableProblems.concat(problems);
            });
        }
        
        // If still no problems, get any problem
        if (availableProblems.length === 0) {
            Object.values(this.problems).forEach(subjectProblems => {
                Object.values(subjectProblems).forEach(problems => {
                    availableProblems = availableProblems.concat(problems);
                });
            });
        }
        
        // Filter problems within ±2 difficulty levels of current
        const minDifficulty = Math.max(1, this.userProgress.currentDifficulty - 2);
        const maxDifficulty = Math.min(this.difficultyLevels, this.userProgress.currentDifficulty + 2);
        
        const filteredProblems = availableProblems.filter(problem => 
            problem.difficulty >= minDifficulty && problem.difficulty <= maxDifficulty
        );
        
        // If we have filtered problems, use them, otherwise use all available
        const problemsToUse = filteredProblems.length > 0 ? filteredProblems : availableProblems;
        
        // Return a random problem
        if (problemsToUse.length > 0) {
            const randomIndex = Math.floor(Math.random() * problemsToUse.length);
            return problemsToUse[randomIndex];
        }
        
        // If no problems are available, return a default problem
        return {
            id: 'default',
            difficulty: 1,
            question: "No problems available for the selected topic. Please try another topic or check back later.",
            answer: "",
            solution: "",
            tags: []
        };
    },
    
    // Check if the answer is correct
    checkAnswer: function(problem, userAnswer) {
        // Normalize answers by removing all whitespace and converting to lower case
        const normalizedCorrectAnswer = problem.answer.replace(/\s+/g, '').toLowerCase();
        const normalizedUserAnswer = userAnswer.replace(/\s+/g, '').toLowerCase();

        // TODO: Add more sophisticated answer checking (e.g., numerical tolerance, symbolic equivalence)
        return normalizedCorrectAnswer === normalizedUserAnswer;
    },
    
    // Update difficulty based on user performance
    updateDifficulty: function(isCorrect) {
        if (isCorrect) {
            this.userProgress.correctCount++;
            this.userProgress.currentStreak++;
            this.userProgress.bestStreak = Math.max(this.userProgress.bestStreak, this.userProgress.currentStreak);
            
            // Increase difficulty, but cap at max level
            if (this.userProgress.currentDifficulty < this.difficultyLevels) {
                // Increase more if on a streak
                const increase = this.userProgress.currentStreak >= 3 ? 2 : 1;
                this.userProgress.currentDifficulty = Math.min(
                    this.difficultyLevels, 
                    this.userProgress.currentDifficulty + increase
                );
            }
        } else {
            this.userProgress.incorrectCount++;
            this.userProgress.currentStreak = 0;
            
            // Decrease difficulty, but don't go below 1
            this.userProgress.currentDifficulty = Math.max(1, this.userProgress.currentDifficulty - 1);
        }
        
        // Update the UI with new stats
        this.updateProgressUI();
    },
    
    // Update the progress UI elements
    updateProgressUI: function() {
        document.getElementById('correct-count').textContent = this.userProgress.correctCount;
        document.getElementById('incorrect-count').textContent = this.userProgress.incorrectCount;
        document.getElementById('streak-count').textContent = this.userProgress.currentStreak;
        
        // Update difficulty meter
        const difficultyPercent = (this.userProgress.currentDifficulty / this.difficultyLevels) * 100;
        document.getElementById('difficulty-level').style.width = `${difficultyPercent}%`;
    },
    
    // Add a new problem to the database
    addProblem: function(problemData) {
        const { subject, topic, question, answer, solution, difficulty, tags } = problemData;
        
        // Initialize subject and topic if they don't exist
        if (!this.problems[subject]) {
            this.problems[subject] = {};
        }
        if (!this.problems[subject][topic]) {
            this.problems[subject][topic] = [];
        }
        
        // Create a new problem ID
        const newId = `${subject.substring(0, 3)}${this.problems[subject][topic].length + 1}`;
        
        // Add the problem
        this.problems[subject][topic].push({
            id: newId,
            difficulty: difficulty || 1,
            question,
            answer,
            solution: solution || "",
            tags: tags || []
        });
        
        return newId;
    }
};

// Make problemBank globally available
window.problemBank = problemBank;
