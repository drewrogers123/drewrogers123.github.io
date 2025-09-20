// Problem database structure
const problemBank = {
    // Skill difficulty levels (1-100, where 1 is easiest)
    difficultyLevels: 100,
    
    // Educational level mappings for skill difficulty
    educationalLevels: {
        elementary: { min: 1, max: 10, name: "Elementary" },
        middleSchool: { min: 11, max: 20, name: "Middle School" },
        highSchool: { min: 21, max: 30, name: "High School" },
        advancedHighSchool: { min: 31, max: 40, name: "Advanced High School" },
        earlyCollege: { min: 41, max: 50, name: "Early College" },
        middleCollege: { min: 51, max: 60, name: "Middle College" },
        lateCollege: { min: 61, max: 70, name: "Late College/Early Graduate" },
        graduate: { min: 71, max: 80, name: "Graduate Level" },
        phdQualifying: { min: 81, max: 90, name: "PhD Qualifying Exam" },
        research: { min: 91, max: 100, name: "Research Level" }
    },
    
    // Predefined tags for problems
    availableTags: {
        math: {
            algebra: [
                "linear equations", "quadratic equations", "polynomial equations", "systems of equations",
                "inequalities", "absolute value", "factoring", "quadratics", "solving for x",
                "distributive property", "algebraic expressions", "rational expressions",
                "exponential equations", "logarithms", "inverse functions", "domain and range"
            ],
            calculus: [
                "derivatives", "power rule", "product rule", "quotient rule", "chain rule",
                "implicit differentiation", "related rates", "optimization", "integrals",
                "definite integrals", "indefinite integrals", "integration by parts",
                "substitution method", "limits", "continuity", "trigonometric derivatives",
                "exponential derivatives", "logarithmic derivatives", "fundamental theorem",
                "taylor series", "infinite series", "convergence", "divergence"
            ],
            geometry: [
                "area", "perimeter", "volume", "surface area", "triangles", "rectangles",
                "circles", "polygons", "coordinate geometry", "distance formula",
                "midpoint formula", "slope", "parallel lines", "perpendicular lines",
                "angles", "similar triangles", "congruent triangles", "pythagorean theorem",
                "trigonometry", "sine", "cosine", "tangent", "proofs"
            ],
            trigonometry: [
                "special angles", "unit circle", "trigonometric identities", "sine rule",
                "cosine rule", "trigonometric equations", "inverse trigonometric functions",
                "amplitude", "period", "phase shift", "graphing", "radians", "degrees"
            ],
            "linear-algebra": [
                "matrices", "determinant", "eigenvalues", "eigenvectors", "matrix operations",
                "matrix multiplication", "inverse matrix", "linear transformations",
                "vector spaces", "basis", "dimension", "linear independence",
                "systems of linear equations", "gaussian elimination", "rank"
            ],
            probability: [
                "basic probability", "conditional probability", "independent events",
                "mutually exclusive events", "combinations", "permutations",
                "probability distributions", "normal distribution", "binomial distribution",
                "expected value", "variance", "standard deviation", "bayes theorem"
            ],
            statistics: [
                "mean", "median", "mode", "range", "variance", "standard deviation",
                "descriptive statistics", "inferential statistics", "hypothesis testing",
                "confidence intervals", "correlation", "regression", "sampling",
                "population", "sample", "z-score", "t-test", "chi-square"
            ],
            "discrete-math": [
                "combinatorics", "permutations", "combinations", "graph theory",
                "mathematical induction", "recursion", "sequences", "series",
                "logic", "set theory", "relations", "functions", "proof techniques",
                "number theory", "modular arithmetic", "algorithms"
            ]
        },
        physics: {
            mechanics: [
                "kinematics", "dynamics", "force", "acceleration", "velocity", "displacement",
                "newton's laws", "friction", "circular motion", "projectile motion",
                "work", "energy", "kinetic energy", "potential energy", "momentum",
                "impulse", "conservation laws", "collisions", "rotational motion",
                "torque", "angular momentum", "simple harmonic motion", "oscillations"
            ],
            electromagnetism: [
                "electric field", "electric potential", "capacitance", "current",
                "resistance", "ohm's law", "circuits", "magnetic field",
                "electromagnetic induction", "faraday's law", "lenz's law",
                "maxwell's equations", "electromagnetic waves", "ac circuits",
                "dc circuits", "transformers", "generators", "motors"
            ],
            thermodynamics: [
                "temperature", "heat", "thermal equilibrium", "first law",
                "second law", "entropy", "enthalpy", "heat engines", "refrigerators",
                "carnot cycle", "ideal gas", "kinetic theory", "phase transitions",
                "specific heat", "thermal expansion", "heat transfer"
            ],
            optics: [
                "reflection", "refraction", "snell's law", "total internal reflection",
                "lenses", "mirrors", "ray optics", "wave optics", "interference",
                "diffraction", "polarization", "optical instruments", "dispersion",
                "electromagnetic spectrum", "photons", "wave-particle duality"
            ],
            quantum: [
                "quantum mechanics", "wave function", "schrödinger equation",
                "uncertainty principle", "quantum states", "observables",
                "measurement", "superposition", "entanglement", "particle in a box",
                "harmonic oscillator", "hydrogen atom", "spin", "angular momentum",
                "photon energy", "photoelectric effect", "compton scattering"
            ],
            relativity: [
                "special relativity", "general relativity", "time dilation",
                "length contraction", "mass-energy equivalence", "lorentz transformation",
                "spacetime", "four-vectors", "gravitational waves", "black holes",
                "cosmology", "reference frames", "simultaneity"
            ],
            waves: [
                "wave equation", "frequency", "wavelength", "amplitude", "phase",
                "interference", "standing waves", "resonance", "doppler effect",
                "sound waves", "electromagnetic waves", "wave speed",
                "mechanical waves", "transverse waves", "longitudinal waves"
            ]
        }
    },
    
    // Problem templates by subject and topic
    problems: {
        math: {
            algebra: [
                {
                    id: 'alg1-mc',
                    difficulty: 15,
                    type: 'multiple-choice',
                    question: "Solve for x: $2x + 5 = 15$",
                    answer1: "3",
                    answer2: "4",
                    answer3: "5",
                    answer4: "6",
                    correct: "answer3",
                    solution: "Subtract 5 from both sides to get $2x = 10$. Divide by 2 to get $x = 5$.",
                    tags: ["linear equations"]
                },
                {
                    id: 'alg2',
                    difficulty: 25,
                    type: 'multiple-choice',
                    question: "Factor the quadratic: $x^2 - 5x + 6$",
                    answer1: "(x+2)(x+3)",
                    answer2: "(x-1)(x-6)",
                    answer3: "(x-2)(x-3)",
                    answer4: "(x+1)(x+6)",
                    correct: "answer3",
                    solution: "Find two numbers that multiply to 6 and add to -5. The numbers are -2 and -3, so the factored form is $(x-2)(x-3)$.",
                    tags: ["factoring", "quadratics"]
                },
                {
                    id: 'alg3',
                    difficulty: 35,
                    type: 'multiple-choice',
                    question: "Solve the inequality: $|2x - 1| \leq 5$",
                    answer1: "-3<=x<=2",
                    answer2: "-2<=x<=3",
                    answer3: "x<=-2 or x>=3",
                    answer4: "x<=-3 or x>=2",
                    correct: "answer2",
                    solution: "The inequality $|2x - 1| \leq 5$ can be written as $-5 \leq 2x - 1 \leq 5$. Add 1 to all parts to get $-4 \leq 2x \leq 6$. Divide by 2 to get $-2 \leq x \leq 3$.",
                    tags: ["absolute value", "inequalities"]
                }
            ],
            calculus: [
                {
                    id: 'calc1',
                    difficulty: 45,
                    type: 'multiple-choice',
                    question: "Find the derivative of $f(x) = 3x^2 + 2x - 5$",
                    answer1: "6x + 2",
                    answer2: "3x + 2",
                    answer3: "6x^2 + 2x",
                    answer4: "3x^2 + 2",
                    correct: "answer1",
                    solution: "Using the power rule, the derivative of $3x^2$ is $6x$, the derivative of $2x$ is $2$, and the derivative of a constant is 0. So, $f'(x) = 6x + 2$.",
                    tags: ["derivatives", "calculus"]
                },
                {
                    id: 'calc2',
                    difficulty: 48,
                    type: 'multiple-choice',
                    question: "Evaluate the definite integral: $$\int_{0}^{1} (x^2 + 1) dx$$",
                    answer1: "2/3",
                    answer2: "4/3",
                    answer3: "5/3",
                    answer4: "2",
                    correct: "answer2",
                    solution: "The integral of $x^2$ is $\frac{x^3}{3}$ and the integral of 1 is $x$. Evaluating from 0 to 1 gives $(\frac{1^3}{3} + 1) - (\frac{0^3}{3} + 0) = \frac{1}{3} + 1 = \frac{4}{3}$.",
                    tags: ["definite integrals", "early college"]
                },
                {
                    id: 'calc3',
                    difficulty: 52,
                    type: 'multiple-choice',
                    question: "Find the limit: $\lim_{x \to 0} \frac{\sin(x)}{x}$",
                    answer1: "0",
                    answer2: "1",
                    answer3: "Undefined",
                    answer4: "Infinity",
                    correct: "answer2",
                    solution: "This is a standard limit that evaluates to 1. It can be proven using L'Hôpital's Rule or the Squeeze Theorem.",
                    tags: ["limits", "trigonometric limits", "middle college"]
                }
            ]
        },
        physics: {
            mechanics: [
                {
                    id: 'mech1',
                    difficulty: 25,
                    type: 'multiple-choice',
                    question: "A car accelerates from rest at $2 \\text{ m/s}^2$ for 5 seconds. What is its final velocity?",
                    answer1: "5 m/s",
                    answer2: "7.5 m/s",
                    answer3: "10 m/s",
                    answer4: "12.5 m/s",
                    correct: "answer3",
                    units: "m/s",
                    solution: "Using $v = u + at$ where $u=0$, $a=2\\text{ m/s}^2$, $t=5\\text{ s}$: $v = 0 + (2)(5) = 10\\text{ m/s}$.",
                    tags: ["kinematics", "constant acceleration"]
                },
                {
                    id: 'mech2',
                    difficulty: 22,
                    question: "A ball of mass 0.5 kg is dropped from a height of 10 m. What is its potential energy at the start? (Use $g = 9.8 \\text{ m/s}^2$)",
                    answer: "49 J",
                    solution: "Potential Energy is given by $PE = mgh$. So, $PE = (0.5 \\text{ kg})(9.8 \\text{ m/s}^2)(10 \\text{ m}) = 49 \\text{ Joules}$.",
                    tags: ["potential energy", "high school"]
                },
                {
                    id: 'mech3',
                    difficulty: 26,
                    question: "A force of 20 N is applied to a 5 kg object. What is the acceleration of the object?",
                    answer: "4 m/s^2",
                    solution: "Using Newton's second law, $F=ma$. Rearranging for acceleration gives $a = F/m$. So, $a = 20 \\text{ N} / 5 \\text{ kg} = 4 \\text{ m/s}^2$.",
                    tags: ["Newton's laws", "force", "high school"]
                }
            ],
            quantum: [
                {
                    id: 'quant1',
                    difficulty: 65,
                    question: "What is the energy of a photon with a frequency of $1.5 \\times 10^{15}$ Hz? (Use Planck's constant $h = 6.626 \\times 10^{-34} \\text{ J·s}$)",
                    answer: "9.939e-19 J",
                    solution: "The energy of a photon is given by $E = hf$. So, $E = (6.626 \\times 10^{-34} \\text{ J·s}) (1.5 \\times 10^{15} \\text{ Hz}) \\approx 9.939 \\times 10^{-19} \\text{ J}$.",
                    tags: ["photon energy", "quantum mechanics", "late college"]
                },
                {
                    id: 'quant2',
                    difficulty: 72,
                    question: "An electron is confined to a 1D box of length 1 nm. What is the ground state energy of the electron? (Use the formula $E_n = \frac{n^2h^2}{8mL^2}$)",
                    answer: "6.02e-20 J",
                    solution: "For the ground state, n=1. Given $m_e \\approx 9.109 \\times 10^{-31}$ kg and L = $1 \\times 10^{-9}$ m, the energy is $E_1 = \frac{1^2(6.626 \\times 10^{-34})^2}{8(9.109 \\times 10^{-31})(1 \\times 10^{-9})^2} \\approx 6.02 \\times 10^{-20} \\text{ J}$.",
                    tags: ["particle in a box", "quantum mechanics", "graduate level"]
                }
            ]
        }
    },
    
    // User progress tracking
    userProgress: {
        currentDifficulty: 15,
        correctCount: 0,
        incorrectCount: 0,
        currentStreak: 0,
        bestStreak: 0,
        lastSubject: null,
        lastTopic: null,
        problemHistory: []
    },
    
    // Get educational level name for a given difficulty
    getEducationalLevel: function(difficulty) {
        for (const [key, level] of Object.entries(this.educationalLevels)) {
            if (difficulty >= level.min && difficulty <= level.max) {
                return level.name;
            }
        }
        return "Unknown Level";
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
        
        // Filter problems within ±10 difficulty levels of current (adjusted for 1-100 scale)
        const minDifficulty = Math.max(1, this.userProgress.currentDifficulty - 10);
        const maxDifficulty = Math.min(this.difficultyLevels, this.userProgress.currentDifficulty + 10);
        
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
        // Handle multiple choice questions
        if (problem.type === 'multiple-choice' && problem.correct) {
            return userAnswer === problem.correct;
        }
        // Handle short answer questions
        return problem.answer.toLowerCase().trim() === String(userAnswer).toLowerCase().trim();
    },
    
    // Update difficulty based on user performance
    updateDifficulty: function(isCorrect) {
        if (isCorrect) {
            this.userProgress.correctCount++;
            this.userProgress.currentStreak++;
            this.userProgress.bestStreak = Math.max(this.userProgress.bestStreak, this.userProgress.currentStreak);
            
            // Increase difficulty, but cap at max level
            if (this.userProgress.currentDifficulty < this.difficultyLevels) {
                // Increase more if on a streak (adjusted for 1-100 scale)
                const increase = this.userProgress.currentStreak >= 3 ? 5 : 2;
                this.userProgress.currentDifficulty = Math.min(
                    this.difficultyLevels, 
                    this.userProgress.currentDifficulty + increase
                );
            }
        } else {
            this.userProgress.incorrectCount++;
            this.userProgress.currentStreak = 0;
            
            // Decrease difficulty, but don't go below 1 (adjusted for 1-100 scale)
            this.userProgress.currentDifficulty = Math.max(1, this.userProgress.currentDifficulty - 3);
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
