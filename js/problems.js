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
                    solution: "Subtract 5 from both sides to get $2x = 10$. Divide by 2 to get $x = 5$."
                },
                {
                    id: 'alg2',
                    difficulty: 3,
                    question: "Factor the quadratic expression: $x^2 - 5x + 6$",
                    answer: ["(x-2)(x-3)", "(x-3)(x-2)"],
                    solution: "We need two numbers that multiply to 6 and add to -5. These are -2 and -3. So the factored form is $(x-2)(x-3)$."
                },
                {
                    id: 'alg3',
                    difficulty: 5,
                    question: "Solve the inequality: $|2x - 1| \leq 5$",
                    answer: "-2<=x<=3",
                    solution: "The inequality $|2x - 1| \leq 5$ can be written as $-5 \leq 2x - 1 \leq 5$. Add 1 to all parts to get $-4 \leq 2x \leq 6$. Divide by 2 to get $-2 \leq x \leq 3$."
                }
            ],
            calculus: [
                {
                    id: 'calc1',
                    difficulty: 2,
                    question: "Find the derivative of $f(x) = 3x^2 + 2x - 5$",
                    answer: "6x+2",
                    solution: "Using the power rule, the derivative of $3x^2$ is $6x$, the derivative of $2x$ is $2$, and the derivative of a constant is 0. So, $f'(x) = 6x + 2$."
                },
                {
                    id: 'calc2',
                    difficulty: 4,
                    question: "Evaluate the definite integral: $$\int_{0}^{1} (x^2 + 1) dx$$",
                    answer: "4/3",
                    solution: "The integral of $x^2$ is $\frac{x^3}{3}$ and the integral of 1 is $x$. Evaluating from 0 to 1 gives $(\frac{1^3}{3} + 1) - (\frac{0^3}{3} + 0) = \frac{1}{3} + 1 = \frac{4}{3}$."
                },
                {
                    id: 'calc3',
                    difficulty: 6,
                    question: "Find the limit: $\lim_{x \to 0} \frac{\sin(x)}{x}$",
                    answer: "1",
                    solution: "This is a standard limit that evaluates to 1. It can be proven using L'Hôpital's Rule or the Squeeze Theorem."
                }
            ]
        },
        physics: {
            mechanics: [
                {
                    id: 'mech1',
                    difficulty: 2,
                    question: "A ball of mass 0.5 kg is dropped from a height of 10 m. What is its potential energy at the start? (Use $g = 9.8 \\text{ m/s}^2$)",
                    answer: "49 J",
                    solution: "Potential Energy is given by $PE = mgh$. So, $PE = (0.5 \\text{ kg})(9.8 \\text{ m/s}^2)(10 \\text{ m}) = 49 \\text{ Joules}$."
                },
                {
                    id: 'mech2',
                    difficulty: 4,
                    question: "A force of 20 N is applied to a 5 kg object. What is the acceleration of the object?",
                    answer: "4 m/s^2",
                    solution: "Using Newton's second law, $F=ma$. Rearranging for acceleration gives $a = F/m$. So, $a = 20 \\text{ N} / 5 \\text{ kg} = 4 \\text{ m/s}^2$."
                }
            ],
            quantum: [
                {
                    id: 'quant1',
                    difficulty: 3,
                    question: "What is the energy of a photon with a frequency of $1.5 \\times 10^{15}$ Hz? (Use Planck's constant $h = 6.626 \\times 10^{-34} \\text{ J·s}$)",
                    answer: "9.939e-19 J",
                    solution: "The energy of a photon is given by $E = hf$. So, $E = (6.626 \\times 10^{-34} \\text{ J·s}) (1.5 \\times 10^{15} \\text{ Hz}) \\approx 9.939 \\times 10^{-19} \\text{ J}$."
                },
                {
                    id: 'quant2',
                    difficulty: 5,
                    question: "An electron is confined to a 1D box of length 1 nm. What is the ground state energy of the electron? (Use the formula $E_n = \frac{n^2h^2}{8mL^2}$)",
                    answer: "6.02e-20 J",
                    solution: "For the ground state, n=1. Given $m_e \\approx 9.109 \\times 10^{-31}$ kg and L = $1 \\times 10^{-9}$ m, the energy is $E_1 = \frac{1^2(6.626 \\times 10^{-34})^2}{8(9.109 \\times 10^{-31})(1 \\times 10^{-9})^2} \\approx 6.02 \\times 10^{-20} \\text{ J}$."
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
        const normalizedUserAnswer = userAnswer.replace(/\s+/g, '').toLowerCase();

        if (Array.isArray(problem.answer)) {
            // If the answer is an array, check if the user's answer is one of the valid options
            return problem.answer.some(ans => ans.replace(/\s+/g, '').toLowerCase() === normalizedUserAnswer);
        } else {
            // Otherwise, perform a direct string comparison
            const normalizedCorrectAnswer = problem.answer.replace(/\s+/g, '').toLowerCase();
            return normalizedCorrectAnswer === normalizedUserAnswer;
        }
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
