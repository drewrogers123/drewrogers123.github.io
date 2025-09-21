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
            "statistics": [
                "descriptive statistics", "probability", "distributions", "hypothesis testing",
                "confidence intervals", "regression", "ANOVA", "chi-square tests",
                "normal distribution", "binomial distribution", "poisson distribution",
                "sampling", "central limit theorem", "p-values", "correlation",
                "standard deviation", "variance", "mean", "median", "mode"
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
                    question: "Solve for x: $$2x + 5 = 15$$",
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
                    question: "Factor the quadratic: $$x^2 - 5x + 6$$",
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
                    question: "Solve the inequality: $$|2x - 1| \\leq 5$$",
                    answer1: "$$-3\\leqx\\leq 2$$",
                    answer2: "$$-2\\leq x\\leq 3$$",
                    answer3: "$$x\\leq-2$$ or $$x\\geq 3$$",
                    answer4: "$$x\\leq -3$$ or $$x\\geq 2$$",
                    correct: "answer2",
                    solution: "The inequality $$|2x - 1| \\leq 5$$ can be written as $$-5 \\leq 2x - 1 \\leq 5$$. Add 1 to all parts to get $$-4 \\leq 2x \\leq 6$$. Divide by 2 to get $$-2 \\leq x \\leq 3$.",
                    tags: ["absolute value", "inequalities"]
                },
                {
                    id: "mit430-mid-1a",
                    difficulty: 45,
                    type: "multiple-choice",
                    question: "Define the term group.",
                    answer1: "A set with a binary operation that is commutative, has an identity, and inverses for each element.",
                    answer2: "A set with a binary operation such that the operation is closed and associative, there is an identity element, and each element has an inverse.",
                    answer3: "A set with a binary operation that is closed, has cancellation law, and finite.",
                    answer4: "A set with an operation where each element squares to the identity.",
                    correct: "answer2",
                    solution: "A group is a set $$G$$ with an operation $$\\cdot: G\\times G\\to G$$ so that (i) there is an identity element $$1\\in G$$ with $$1\\cdot g = g\\cdot 1 = g$$ for all $$g\\in G$$; (ii) for each $$g\\in G$$ there is an inverse $$g^{-1}$$ with $$g\\cdot g^{-1} = g^{-1}\\cdot g = 1$$; (iii) for all $$x,y,z\\in G$$, $$(x\\cdot y)\\cdot z = x\\cdot(y\\cdot z)$$. (From official solution.)",
                    tags: ["group theory", "definition"]
                },
                {
                    id: "mit430-mid-1b",
                    difficulty: 50,
                    type: "multiple-choice",
                    question: "State and prove the Cancellation Law for groups. Which is the correct statement of the law?",
                    answer1: "If $$ab = cb$$ then $$a = c$$; if $$ba = bc$$ then $$a = c$$.",
                    answer2: "If $$ab = ac$$ then $$b = c$$; if $$ba = ca$$ then $$b = c$$.",
                    answer3: "If $$ab = a$$ then $$b = e$$; if $$ba = a$$ then $$b = e$$.",
                    answer4: "If $$ab = cd$$ then $$a = c$$ and $$b = d$$.",
                    correct: "answer2",
                    solution: "The Cancellation Law in a group says: if $$a, b, c\\in G$$ and $$ab = ac$$, then $$b = c$$; similarly, if $$ba = ca$$ then $$b = c$$. The proof uses multiplying both sides on left (or right) by the inverse of $$a$$. (From official solution.)",
                    tags: ["group theory", "properties"]
                },
                {
                    id: "mit430-mid-2a",
                    difficulty: 45,
                    type: "multiple-choice",
                    question: "Is the set of non‐negative integers $$\\{0,1,2,\\dots\\}$$ a subgroup of $$(\\mathbb{Z},+)$$?",
                    answer1: "Yes, because it contains 0 and is closed under addition and inverses.",
                    answer2: "No, because it lacks additive inverses for non‐zero elements.",
                    answer3: "Yes, because every non‐negative integer has a negative which is also in the set.",
                    answer4: "No, because it does not contain 1.",
                    correct: "answer2",
                    solution: "To be a subgroup, every element must have its inverse in the subset. The non‐negative integers do not include negatives, so e.g. 1 has no inverse in the set. Official solution: not a subgroup because inverse fails.",
                    tags: ["subgroup", "integers"]
                },
                {
                    id: "mit430-mid-2b",
                    difficulty: 50,
                    type: "multiple-choice",
                    question: "Is the set of even permutations in $$S_n$$ a subgroup?",
                    answer1: "Yes, because the product of even permutations is even, inverses of even are even.",
                    answer2: "No, because the identity permutation is odd.",
                    answer3: "Yes, only if $$n$$ is even.",
                    answer4: "No, because combining even and odd can produce odd.",
                    correct: "answer1",
                    solution: "Even permutations form a subgroup: identity is even, product of two even permutations is even, inverse of an even permutation is even. (From official solution.)",
                    tags: ["permutations", "subgroup"]
                },
                {
                    id: "mit430-mid-2c",
                    difficulty: 50,
                    type: "multiple-choice",
                    question: "Is the set of odd permutations in $$S_n$$ a subgroup?",
                    answer1: "Yes, because it contains inverses and identity.",
                    answer2: "No, because identity is not odd.",
                    answer3: "Yes, because odd * odd = even which is in the set.",
                    answer4: "No, because inverses of odd permutations are not odd.",
                    correct: "answer2",
                    solution: "Identity permutation is even, so the set of odd permutations does not contain the identity and thus is not a subgroup. (Official solution: same.)",
                    tags: ["permutations", "subgroup"]
                },
                {
                    id: "mit430-mid-2d",
                    difficulty: 45,
                    type: "multiple-choice",
                    question: "Is the set of positive rational numbers a subgroup of $$(\\mathbb{R}, +, \\cdot)$$?",
                    answer1: "Yes, under multiplication since product and inverse of positives is positive.",
                    answer2: "No, under addition since sum of positives might be positive but inverse (negatives) not included.",
                    answer3: "Yes, under addition since closure holds and inverses exist.",
                    answer4: "No, under multiplication because positive numbers don't include zero.",
                    correct: "answer1",
                    solution: "As a subset of $$(\\mathbb{R}, \\cdot)$$, the positive rational numbers are closed under multiplication, inverses, identity 1 is positive; thus form a subgroup under multiplication. Official solution: is a subgroup (of the multiplicative group).",
                    tags: ["subgroup", "rationals"]
                },
                {
                    id: "mit430-mid-2e",
                    difficulty: 45,
                    type: "multiple-choice",
                    question: "Is the set of positive irrational numbers a subgroup of $$(\\mathbb{R}, +, \\cdot)$$?",
                    answer1: "Yes, under addition because sum of irrationals is irrational.",
                    answer2: "No, under addition because inverse of an irrational may be irrational but could be rational.",
                    answer3: "No, because does not contain identity under addition or multiplication properly.",
                    answer4: "Yes, under multiplication because product of irrationals is irrational and inverse of irrational is irrational.",
                    correct: "answer3",
                    solution: "The set fails to be a subgroup because it does not contain the identity element of addition (0), and many other subgroup requirements fail. Official solution: not a subgroup since identity (0 or 1 depending which operation) is absent.",
                    tags: ["subgroup", "irrationals"]
                },
                {
                    id: "mit430-mid-3a",
                    difficulty: 50,
                    type: "multiple-choice",
                    question: "Is $$(\\mathbb{R}, +)$$ isomorphic to $$(\\mathbb{R}^+, \\cdot)$$?",
                    answer1: "Yes, via the exponential function: $$\\exp$$ gives an isomorphism.",
                    answer2: "No, because one is additive and one multiplicative.",
                    answer3: "Yes, via log but only in positive rationals.",
                    answer4: "No, because multiplicative identity differs from additive identity.",
                    correct: "answer1",
                    solution: "Define $$\\exp: \\mathbb{R}\\to\\mathbb{R}^+$$ and $$\\log: \\mathbb{R}^+\\to\\mathbb{R}$$; these are inverses, and satisfy $$\\exp(x+y)=\\exp(x)\\exp(y)$$, etc. Official solution: these maps show an isomorphism.",
                    tags: ["isomorphism", "real numbers"]
                },
                {
                    id: "mit430-mid-3b",
                    difficulty: 50,
                    type: "multiple-choice",
                    question: "Is $$(\\mathbb{Z}, +)$$ isomorphic to $$(\\mathbb{R}^+, \\cdot)$$?",
                    answer1: "Yes, because both are groups with infinite order.",
                    answer2: "No, because one is uncountable while the other is countable.",
                    answer3: "Yes, because there is a bijection between $$\\mathbb{Z}$$ and $$\\mathbb{R}^+$$.",
                    answer4: "No, because identity elements differ in structure.",
                    correct: "answer2",
                    solution: "Countability: $$(\\mathbb{Z},+)$$ is countable; $$(\\mathbb{R}^+, \\cdot)$$ is uncountable, so cannot be isomorphic. Official solution: uses cardinality argument.",
                    tags: ["isomorphism", "cardinality"]
                },
                {
                    id: "mit430-mid-3c",
                    difficulty: 50,
                    type: "multiple-choice",
                    question: "Is the circle group $$(U, \\cdot)$$ isomorphic to $$(\\mathbb{R}^+, \\cdot)$$?",
                    answer1: "Yes, because both are multiplicative groups.",
                    answer2: "No, because $$(U, \\cdot)$$ has elements of finite order while $$(\\mathbb{R}^+, \\cdot)$$ does not.",
                    answer3: "Yes, via the function sending angle to radius.",
                    answer4: "No, because $$(\\mathbb{R}^+, \\cdot)$$ has torsion elements which $$(U, \\cdot)$$ lacks.",
                    correct: "answer2",
                    solution: "The circle group has elements of finite order (e.g. roots of unity), while $$(\\mathbb{R}^+,\\cdot)$$ is torsion‐free (no element of finite order besides identity). Therefore they are not isomorphic. Official solution: same argument.",
                    tags: ["isomorphism", "torsion"]
                },
                {
                    id: "mit430-mid-4a",
                    difficulty: 45,
                    type: "multiple-choice",
                    question: "Find the subgroup of $$S_3$$ generated by the transposition $$(1,2)$$.",
                    answer1: "$$\\{e,(12)\\}$$",
                    answer2: "$$\\{ (1,2), (1,3), (2,3)\\}$$",
                    answer3: "$$S_3$$",
                    answer4: "$$\\{e,(13)\\}$$",
                    correct: "answer1",
                    solution: "The subgroup generated by a single transposition $$(1,2)$$ is $$\\{ e, (1,2)\\}$$, since $$(1,2)^2 = e$$. Official solution: same.",
                    tags: ["subgroup", "symmetric group"]
                },
                {
                    id: "mit430-mid-4b",
                    difficulty: 50,
                    type: "multiple-choice",
                    question: "List all left cosets of the subgroup generated by $$(1,2)$$ in $$S_3$$.",
                    answer1: "$$\\{ e,(12)\\},\\;\\{(13),(123)\\},\\;\\{(23),(132)\\}$$",
                    answer2: "$$\\{ e,(12)\\},\\;\\{(12),(13)\\},\\;\\{(12),(23)\\}$$",
                    answer3: "$$\\{ e,(12)\\},\\;\\{ (1,3),(2,3)\\},\\;\\{ (1,3),(1,2)\\}$$",
                    answer4: "$$\\{ e,(12)\\},\\;\\{ (2,3),(1,3)\\},\\;\\{ (123),(132)\\}$$",
                    correct: "answer1",
                    solution: "Left cosets: the subgroup is $$\\{e,(12)\\}$$. The left cosets are $$\\{e,(12)\\},\\; (13)\\{e,(12)\\} = \\{(13),(123)\\},\\; (23)\\{e,(12)\\} = \\{(23),(132)\\}$$. (Official solution: same.)",
                    tags: ["cosets", "subgroup", "S3"]
                },
                {
                    id: "mit430-mid-4c",
                    difficulty: 55,
                    type: "multiple-choice",
                    question: "Find the subgroup of $$S_3$$ generated by $$(1,2)$$ and $$(2,3)$$.",
                    answer1: "$$\\{e,(1,2),(2,3),(1,2)(2,3),(2,3)(1,2),(1,2,3)\\}$$",
                    answer2: "$$\\{e,(1,2),(2,3),(1,3),(1,2,3),(2,3,1)\\}$$ which is all of $$S_3$$",
                    answer3: "$$\\{e,(1,2),(2,3)\\}$$",
                    answer4: "$$\\{e,(1,2,3),(1,3,2)\\}$$",
                    correct: "answer2",
                    solution: "The subgroup generated by transpositions (1,2) and (2,3) in $$S_3$$ is actually all of $$S_3$$. Official solution: same (they produce all elements).",
                    tags: ["subgroup", "generation", "symmetric group"]
                },
                {
                    id: "mit430-mid-5a",
                    difficulty: 50,
                    type: "multiple-choice",
                    question: "Let $$\\sigma\\in S_6$$ be $$\\begin{pmatrix}1&2&3&4&5&6\\\\3&6&4&1&5&2\\end{pmatrix}$$. Find $$\\sigma^{-1}$$.",
                    answer1: "$$\\begin{pmatrix}1&2&3&4&5&6\\\\3&6&4&1&5&2\\end{pmatrix}$$",
                    answer2: "$$\\begin{pmatrix}1&2&3&4&5&6\\\\4&6&1&3&5&2\\end{pmatrix}$$",
                    answer3: "$$\\begin{pmatrix}1&2&3&4&5&6\\\\2&5&6&3&1&4\\end{pmatrix}$$",
                    answer4: "$$\\begin{pmatrix}1&2&3&4&5&6\\\\5&4&3&2&1&6\\end{pmatrix}$$",
                    correct: "answer2",
                    solution: "Invert by solving where each element comes from: official solution gives $$\\sigma^{-1} = \\begin{pmatrix}1&2&3&4&5&6\\\\4&6&1&3&5&2\\end{pmatrix}$$.",
                    tags: ["permutations", "inverse"]
                },
                {
                    id: "mit430-mid-5b",
                    difficulty: 45,
                    type: "multiple-choice",
                    question: "Express the same $$\\sigma$$ as a product of disjoint cycles.",
                    answer1: "$$(1\\;3\\;4)(2\\;6)$$",
                    answer2: "$$(1\\;4\\;3)(2\\;6)$$",
                    answer3: "$$(1\\;3)(4\\;2)(5\\;6)$$",
                    answer4: "$$(1\\;2\\;3\\;4\\;5\\;6)$$",
                    correct: "answer1",
                    solution: "Official: $$\\sigma=(1\\;3\\;4)(2\\;6)$$. (Same as final solution.)",
                    tags: ["cycle decomposition"]
                },
                {
                    id: "mit430-mid-5c",
                    difficulty: 45,
                    type: "multiple-choice",
                    question: "Express the same $\\sigma$ as a product of transpositions.",
                    answer1: "$(1\\;4)(1\\;3)(2\\;6)$",
                    answer2: "$(1\\;3)(3\\;4)(2\\;6)$",
                    answer3: "$(1\\;4)(3\\;1)(6\\;2)$",
                    answer4: "$(1\\;2)(2\\;3)(3\\;4)(4\\;5)(5\\;6)$",
                    correct: "answer1",
                    solution: "Official solution: $\\sigma=(14)(13)(26)$. (Matches answer1.)",
                    tags: ["transpositions", "permutations"]
                },
                {
                    id: "mit430-mid-6",
                    difficulty: 55,
                    type: "multiple-choice",
                    question: "Let $$G$$ be a group and $$H$$ a subgroup of $$G$$. Prove that every left coset of $$H$$ has the same cardinality as $$H$$ by exhibiting a bijection between the two sets. What is the bijection?",
                    answer1: "Map $$h\\mapsto gh$$ from $$H$$ to the coset $$gH$$, with inverse $$a\\mapsto g^{-1}a$$.",
                    answer2: "Map $$h\\mapsto hg$$ from $$H$$ to $$Hg$$, with inverse multiplying by inverse of $$g$$ on right.",
                    answer3: "Map each element of $$H$$ to itself; the sets are equal so identity works.",
                    answer4: "Use the map sending each coset to the subgroup by left‐multiplying by $$g^{-1}$$ everywhere.",
                    correct: "answer1",
                    solution: "Define $$\\lambda_g: H\\to gH$$ by $$\\lambda_g(h)=gh$$; its inverse is $$\\lambda_{g}^{-1}(a)=g^{-1}a$$. These are well‐defined and inverses, so there is a bijection. Official solution: same.",
                    tags: ["cosets", "bijection", "cardinality"]
                },
                {
                    id: "mit430-mid-7a",
                    difficulty: 60,
                    type: "multiple-choice",
                    question: "Prove that the groups $$(\\mathbb{Q}, +)$$ and $$(\\mathbb{Q}^+, \\cdot)$$ are not isomorphic. Which statement captures the key argument?",
                    answer1: "Every positive rational has a rational square root, so the groups are isomorphic.",
                    answer2: "Assume there is an isomorphism $$\\phi: \\mathbb{Q}\\to\\mathbb{Q}^+$$, then show that $$\\phi(r/2)^2 = \\phi(r)$$ and deduce any positive rational has a rational square root, which is false.",
                    answer3: "Because $$\\mathbb{Q}^+$$ is not countable but $$\\mathbb{Q}$$ is.",
                    answer4: "Because addition in $$\\mathbb{Q}$$ has characteristic 0 but multiplication in $$\\mathbb{Q}^+$$ has characteristic 2.",
                    correct: "answer2",
                    solution: "From the definition of isomorphism: $$\\phi(r/2)^2 = \\phi(2(r/2)) = \\phi(r)$$. Surjectivity gives some $$r$$ with $$\\phi(r)=2$$, so $$\\phi(r/2)$$ is a rational whose square is 2. But 2 has no rational square root, contradiction. Official solution: this argument.",
                    tags: ["isomorphism", "rationals", "proof"]
                },
                {
                    id: "mit430-1a",
                    difficulty: 45,
                    type: "multiple-choice",
                    question: "Define the term cyclic group.",
                    answer1: "A finite group in which every non-identity element has order 2.",
                    answer2: "A group that can be generated by a single element.",
                    answer3: "A group of permutations on a cycle graph.",
                    answer4: "An abelian group with prime order.",
                    correct: "answer2",
                    solution: "A cyclic group is a group $$G$$ that is generated by a single element: there exists $$g\\in G$$ such that every $$h\\in G$$ can be written as $$g^m$$ for some $$m\\in\\mathbb{Z}$$. (Official solution paraphrased.)",
                    tags: ["group theory", "definitions"]
                },
                {
                    id: "mit430-1b",
                    difficulty: 50,
                    type: "multiple-choice",
                    question: "Show that every group of prime order is cyclic. (Pick the correct justification.)",
                    answer1: "Because every non-identity element must have infinite order.",
                    answer2: "Because groups of prime order are isomorphic to the additive group of integers mod the prime, by definition.",
                    answer3: "By Lagrange's theorem, any element has order 1 or p; some element has order p, so its powers generate the group.",
                    answer4: "Because groups of prime order are always abelian, and every abelian group is cyclic.",
                    correct: "answer3",
                    solution: "By Lagrange's theorem every element's order divides the group order $$p$$. Since $$p$$ is prime, the only possibilities are 1 or $$p$$; thus some element has order $$p$$ (not the identity), and its $$p$$ distinct powers exhaust the group, so the group is cyclic. (Official solution paraphrased.)",
                    tags: ["group theory", "Lagrange"]
                },
                {
                    id: "mit430-2a",
                    difficulty: 45,
                    type: "multiple-choice",
                    question: "Let $$\\sigma\\in S_6$$ be given by the two-line notation $$\\begin{pmatrix}1&2&3&4&5&6\\\\3&6&4&1&5&2\\end{pmatrix}$$. Find $$\\sigma^{-1}$$.",
                    answer1: "$$\\begin{pmatrix}1&2&3&4&5&6\\\\3&6&4&1&5&2\\end{pmatrix}$$",
                    answer2: "$$\\begin{pmatrix}1&2&3&4&5&6\\\\4&6&1&3&5&2\\end{pmatrix}$$",
                    answer3: "$$\\begin{pmatrix}1&2&3&4&5&6\\\\2&5&6&3&1&4\\end{pmatrix}$$",
                    answer4: "$$\\begin{pmatrix}1&2&3&4&5&6\\\\4&2&1&6&5&3\\end{pmatrix}$$",
                    correct: "answer2",
                    solution: "Invert the mapping by swapping rows: solve for preimages. The inverse is $$\\begin{pmatrix}1&2&3&4&5&6\\\\4&6&1&3&5&2\\end{pmatrix}$$. (Official solution: same.)",
                    tags: ["permutations", "symmetric group"]
                },
                {
                    id: "mit430-2b",
                    difficulty: 45,
                    type: "multiple-choice",
                    question: "Express $\\sigma$ as a product of transpositions.",
                    answer1: "$(1\\;4)(1\\;3)(2\\;6)$",
                    answer2: "$(1\\;3)(3\\;4)(2\\;6)$",
                    answer3: "$(1\\;4)(3\\;1)(6\\;2)$",
                    answer4: "$(1\\;2)(2\\;3)(3\\;4)(4\\;5)(5\\;6)$",
                    correct: "answer1",
                    solution: "Write each cycle as transpositions: $(1\\;3\\;4)=(1\\;4)(1\\;3)$ and $(2\\;6)=(2\\;6)$, so one product is $(1\\;4)(1\\;3)(2\\;6)$. (Official solution lists equivalent transposition product.)",
                    tags: ["permutations", "transpositions"]
                },
                {
                    id: "mit430-2d",
                    difficulty: 45,
                    type: "multiple-choice",
                    question: "Is $\\sigma$ even or odd?",
                    answer1: "Even, because it is a product of two disjoint cycles of even lengths.",
                    answer2: "Odd, because it is a product of three transpositions.",
                    answer3: "Even, because its cycle decomposition has even length.",
                    answer4: "Odd, because it has order 6.",
                    correct: "answer2",
                    solution: "Parity equals parity of number of transpositions; above decomposition uses three transpositions (or in any transposition decomposition an odd number), so $\\sigma$ is odd. (Official solution: odd.)",
                    tags: ["parity", "permutations"]
                },
                {
                    id: "mit430-2e",
                    difficulty: 45,
                    type: "multiple-choice",
                    question: "What is the order of $\\sigma$?",
                    answer1: "2",
                    answer2: "3",
                    answer3: "6",
                    answer4: "4",
                    correct: "answer3",
                    solution: "Order is the least common multiple of the cycle lengths in the disjoint cycle decomposition (3 and 2), so order is 6. Official solution: 6.",
                    tags: ["permutations", "order"]
                },
                {
                    id: "mit430-3",
                    difficulty: 45,
                    type: "multiple-choice",
                    question: "Find all subgroups of $$S_3$$ and state which are normal.",
                    answer1: "Only the trivial group and $$S_3$$; both are normal.",
                    answer2: "$$\\{e\\},\\;\\{e,(12)\\},\\;\\{e,(13)\\},\\;\\{e,(23)\\},\\;\\{e,(123),(132)\\},\\;S_3$$; the trivial, the 3-cycle subgroup and the whole group are normal; the order-2 ones are not.",
                    answer3: "All subgroups are normal since $$S_3$$ is solvable.",
                    answer4: "$$\\{e\\},\\;S_3$$ only; no other subgroups exist.",
                    correct: "answer2",
                    solution: "By Lagrange the subgroup sizes are 1,2,3,6. Subgroups of order 2 are generated by transpositions (three such) and are not normal; the unique subgroup of order 3 $$\\{e,(123),(132)\\}$$ is normal (index 2). Trivial and whole group are normal. (Official solution: lists these and normality.)",
                    tags: ["group theory", "subgroups", "normal"]
                },
                {
                    id: "mit430-4a",
                    difficulty: 45,
                    type: "multiple-choice",
                    question: "Define the term zero divisor in a ring.",
                    answer1: "An element that divides zero only in fields.",
                    answer2: "A nonzero element $$a$$ such that there exists nonzero $$b$$ with $$ab=0$$.",
                    answer3: "An element whose additive inverse is zero.",
                    answer4: "A unit in the ring that multiplies to zero with some other element.",
                    correct: "answer2",
                    solution: "A zero divisor is a nonzero element $$a$$ for which there exists a nonzero $$b$$ with $$ab=0$$. (Official solution: same.)",
                    tags: ["ring theory", "definitions"]
                },
                {
                    id: "mit430-4b",
                    difficulty: 45,
                    type: "multiple-choice",
                    question: "Define the term unit in a ring with unity.",
                    answer1: "An element with no additive inverse.",
                    answer2: "An element that generates the whole ring as an ideal.",
                    answer3: "An element $$u$$ for which there exists $$v$$ with $$uv=1$$.",
                    answer4: "Any nonzero idempotent element.",
                    correct: "answer3",
                    solution: "A unit is an element $$u$$ that has a multiplicative inverse $$v$$ so that $$uv=1$$. (Official solution: same.)",
                    tags: ["ring theory", "definitions"]
                },
                {
                    id: "mit430-4c",
                    difficulty: 50,
                    type: "multiple-choice",
                    question: "List the units and zero divisors in the ring $$\\mathbb{Z}_{10}$$.",
                    answer1: "Units: 1,3,7,9. Zero divisors: 2,4,5,6,8. (0 is not a zero divisor.)",
                    answer2: "Units: 1,9 only. Zero divisors: 2,4,6,8 only.",
                    answer3: "Units: all odd numbers. Zero divisors: none.",
                    answer4: "Units: 1,3,7. Zero divisors: 2,5,10.",
                    correct: "answer1",
                    solution: "Compute gcd with 10: units are classes coprime to 10, i.e., 1,3,7,9. Zero divisors: nonzero classes that multiply to 0 mod 10: 2,4,5,6,8. (Official solution: same, and notes 0 is not called a zero divisor.)",
                    tags: ["rings", "modular arithmetic"]
                },
                {
                    id: "mit430-5a",
                    difficulty: 50,
                    type: "multiple-choice",
                    question: "Which of the following polynomials is irreducible in $$\\mathbb{Q}[x]$: $$x^2-2$$ ?",
                    answer1: "Reducible because $$\\sqrt{2}\\in\\mathbb{Q}$$.",
                    answer2: "Irreducible because $$\\sqrt{2}\\notin\\mathbb{Q}$$ (or by Eisenstein with p=2).",
                    answer3: "Reducible because it factors over $$\\mathbb{R}$$.",
                    answer4: "Irreducible because it has no integer roots.",
                    correct: "answer2",
                    solution: "Over $$\\mathbb{Q}$$ the polynomial $$x^2-2$$ is irreducible since $$\\sqrt{2}\\notin\\mathbb{Q}$$. (Eisenstein with $$p=2$$ also justifies irreducibility.) (Official solution: same.)",
                    tags: ["polynomial irreducibility", "Eisenstein"]
                },
                {
                    id: "mit430-5b",
                    difficulty: 45,
                    type: "multiple-choice",
                    question: "Is $$x^2-2$$ reducible in $$\\mathbb{R}[x]$$?",
                    answer1: "Yes, because $$\\sqrt{2}\\in\\mathbb{R}$$, so $$x^2-2=(x-\\sqrt{2})(x+\\sqrt{2})$$.",
                    answer2: "No, because it has no rational roots.",
                    answer3: "No, because it is degree 2 and irreducible over any field.",
                    answer4: "Yes, because it factors as a product of linear factors over $$\\mathbb{Q}$$.",
                    correct: "answer1",
                    solution: "Over $$\\mathbb{R}$$ it has real roots $$\\pm\\sqrt{2}$$, so it factors as $$(x-\\sqrt{2})(x+\\sqrt{2})$$ and is reducible. (Official solution: same.)",
                    tags: ["polynomials", "fields"]
                },
                {
                    id: "mit430-5c",
                    difficulty: 50,
                    type: "multiple-choice",
                    question: "Is $$x^2-2$$ reducible in $$\\mathbb{Z}_7[x]$$?",
                    answer1: "Yes, because $$3^2\\equiv 2\\pmod 7$$ so it has a root mod 7.",
                    answer2: "No, because 2 is not a quadratic residue mod 7.",
                    answer3: "Yes, because 5 is a root mod 7.",
                    answer4: "No, because Eisenstein fails.",
                    correct: "answer1",
                    solution: "Check: $$3^2=9\\equiv2\\pmod7$$, so $$x^2-2$$ has a root mod 7 and hence factors in $$\\mathbb{Z}_7[x]$$. (Official solution: reducible since $$3^2-2\\equiv0$$.)",
                    tags: ["finite fields", "quadratic residues"]
                },
                {
                    id: "mit430-5d",
                    difficulty: 55,
                    type: "multiple-choice",
                    question: "Decide whether $$x^4+x^2+1$$ is irreducible in $$\\mathbb{R}[x]$$.",
                    answer1: "Irreducible because it has no real roots and cannot factor into quadratics with real coefficients.",
                    answer2: "Reducible: $$x^4+x^2+1=(x^2-x+1)(x^2+x+1)$$.",
                    answer3: "Irreducible because its discriminant is negative.",
                    answer4: "Reducible only over complex numbers.",
                    correct: "answer2",
                    solution: "One can factor: $$x^4+x^2+1=(x^2-x+1)(x^2+x+1)$$ (verify by expansion). Thus it is reducible over $$\\mathbb{R}$$. (Official solution: gives same factorization.)",
                    tags: ["polynomial factorization"]
                },
                {
                    id: "mit430-5e",
                    difficulty: 50,
                    type: "multiple-choice",
                    question: "Is $$x^4+x^2+1$$ reducible in $$\\mathbb{Z}_2[x]$$?",
                    answer1: "Irreducible because coefficients reduce modulo 2.",
                    answer2: "Reducible: in $$\\mathbb{Z}_2[x]$$ it equals $$(x^2+x+1)^2$$.",
                    answer3: "Irreducible because it has no root in $$\\mathbb{Z}_2$$.",
                    answer4: "Reducible: it factors as product of two distinct quadratics over $$\\mathbb{Z}_2$$.",
                    correct: "answer2",
                    solution: "Reducing the integer-coefficient factorization modulo 2 yields $$(x^2+x+1)^2$$ in $$\\mathbb{Z}_2[x]$$, so it is reducible (a square). (Official solution: same.)",
                    tags: ["finite fields", "factorization"]
                },
                {
                    id: "mit430-5f",
                    difficulty: 45,
                    type: "multiple-choice",
                    question: "Is $$x^{100}+x^{11}+x+1$$ reducible in $$\\mathbb{Z}_2[x]$$?",
                    answer1: "Reducible because evaluating at $$x=1$$ gives 0, so $$x+1$$ is a factor.",
                    answer2: "Irreducible because degree is too large.",
                    answer3: "Reducible only because it equals $$x^{50}+1$$ in $$\\mathbb{Z}_2[x]$$.",
                    answer4: "Irreducible because it has no linear factor.",
                    correct: "answer1",
                    solution: "Plugging in $$x=1$$: $$1^{100}+1^{11}+1+1=0$$ in $$\\mathbb{Z}_2$$, so $$x+1$$ divides the polynomial, hence it is reducible. (Official solution: same.)",
                    tags: ["polynomials", "finite fields"]
                },
                {
                    id: "mit430-6a",
                    difficulty: 55,
                    type: "multiple-choice",
                    question: "Let $$S=\\{a+b\\sqrt{2}:a,b\\in\\mathbb{Q}\\}$$. Which statement correctly describes $$S$$?",
                    answer1: "$$S$$ is not closed under multiplication, so not a subfield.",
                    answer2: "$$S$$ is a subfield of $$\\mathbb{R}$$ (closed under +, -, *, and inverses).",
                    answer3: "$$S$$ is a subring but not a field because some inverses are irrational.",
                    answer4: "$$S$$ is isomorphic to $$\\mathbb{Q}\\times\\mathbb{Q}$$ as rings.",
                    correct: "answer2",
                    solution: "Check closure: sums and products of elements $$a+b\\sqrt2$$ stay in the set; additive inverses are in the set. Inverses of nonzero elements $$a+b\\sqrt2$$ can be computed and lie in the set, hence $$S$$ is a subfield of $$\\mathbb{R}$$. (Official solution: provides explicit inverse formula.)",
                    tags: ["field extensions", "algebraic numbers"]
                },
                {
                    id: "mit430-6b",
                    difficulty: 55,
                    type: "multiple-choice",
                    question: "Let $$I=\\{f(x)\\in\\mathbb{Q}[x]:f(\\sqrt2)=0\\}$$. Which ideal is $$I$$ equal to?",
                    answer1: "$$I=\\langle x-\\sqrt2\\rangle$$ in $$\\mathbb{Q}[x]$$.",
                    answer2: "$$I=\\langle x^2-2\\rangle$$, the principal ideal generated by $$x^2-2$$.",
                    answer3: "$$I=\\{0\\}$$ because only the zero polynomial has irrational root.",
                    answer4: "$$I=\\mathbb{Q}[x]$$ since every polynomial takes value 0 somewhere.",
                    correct: "answer2",
                    solution: "If a polynomial vanishes at $$\\sqrt2$$ then $$x^2-2$$ divides it in $$\\mathbb{Q}[x]$$, so $$I=\\langle x^2-2\\rangle$$. (Official solution: shows inclusion both ways and uses factor theorem.)",
                    tags: ["ideals", "polynomial rings"]
                },
                {
                    id: "mit430-6c",
                    difficulty: 55,
                    type: "multiple-choice",
                    question: "Which ring is $$S$$ isomorphic to?",
                    answer1: "$$\\mathbb{Q}[x]/\\langle x^2-2\\rangle$$.",
                    answer2: "$$\\mathbb{Q}\\times\\mathbb{Q}$$.",
                    answer3: "$$\\mathbb{Q}[x]/\\langle x-\\sqrt2\\rangle$$ (not a valid ideal).",
                    answer4: "$$\\mathbb{R}\\,$ (as rings).",
                    correct: "answer1",
                    solution: "The evaluation map $$\\mathbb{Q}[x]\\to\\mathbb{R}$$ at $$x=\\sqrt2$$ has kernel $$\\langle x^2-2\\rangle$$, so by the First Isomorphism Theorem $$\\mathbb{Q}[x]/\\langle x^2-2\\rangle\\cong S$$. (Official solution: same.)",
                    tags: ["ring homomorphism", "isomorphism"]
                },
                {
                    id: "mit430-7a",
                    difficulty: 45,
                    type: "multiple-choice",
                    question: "Define the term principal ideal.",
                    answer1: "An ideal generated by a single element of the ring.",
                    answer2: "An ideal that is maximal but not prime.",
                    answer3: "An ideal that contains only units.",
                    answer4: "An ideal equal to the entire ring.",
                    correct: "answer1",
                    solution: "A principal ideal is one of the form $$\\langle a\\rangle=\\{ra:r\\in R\\}$$ for some element $$a$$ of the ring. (Official solution: same.)",
                    tags: ["ideals", "definitions"]
                },
                {
                    id: "mit430-7b",
                    difficulty: 55,
                    type: "multiple-choice",
                    question: "Prove that every ideal in $$\\mathbb{Z}$$ is principal. Which statement captures the proof idea?",
                    answer1: "Because $$\\mathbb{Z}$$ is a field, every ideal is generated by 1.",
                    answer2: "Take the smallest positive integer in the nonzero ideal; its multiples are exactly the ideal, so the ideal is principal.",
                    answer3: "Because every element of $$\\mathbb{Z}$$ is prime, ideals are principal.",
                    answer4: "Because $$\\mathbb{Z}$$ is finite, all ideals are principal.",
                    correct: "answer2",
                    solution: "If $$I\\subset\\mathbb{Z}$$ is a nonzero ideal, choose smallest positive $$d\\in I$$. Show every element of $$I$$ is a multiple of $$d$$ via division algorithm, so $$I=\\langle d\\rangle$$. (Official solution: same classical argument.)",
                    tags: ["PID", "integers"]
                },
                {
                    id: "mit430-8a",
                    difficulty: 50,
                    type: "multiple-choice",
                    question: "Define greatest common divisor in an integral domain.",
                    answer1: "An element that divides all elements of the domain.",
                    answer2: "A greatest common divisor of $$a,b$$ is an element $$d$$ that divides both, and any common divisor divides $$d$$.",
                    answer3: "The gcd is the smallest positive linear combination of $$a$$ and $$b$$ only in fields.",
                    answer4: "An element which is prime to both $$a$$ and $$b$$.",
                    correct: "answer2",
                    solution: "A greatest common divisor $$d$$ of $$a,b$$ divides both, and for any other common divisor $$c$$, we have $$c\\mid d$$. (Official solution: gives this definition.)",
                    tags: ["gcd", "definitions"]
                },
                {
                    id: "mit430-8b",
                    difficulty: 55,
                    type: "multiple-choice",
                    question: "In a principal ideal domain $$R$$, if $$a,b\\in R$$ are not both zero, which statement is true?",
                    answer1: "They might not have a gcd in general rings, but in a PID they always do: the generator of the ideal $$\\langle a,b\\rangle$$ is a gcd.",
                    answer2: "GCD exists only if $$a$$ and $$b$$ are coprime.",
                    answer3: "GCD equals their product in a PID.",
                    answer4: "A PID cannot guarantee gcd existence without unique factorization.",
                    correct: "answer1",
                    solution: "In a PID the ideal $$\\langle a,b\\rangle$$ is principal, say generated by $$d$$. Then $$d$$ divides both $$a$$ and $$b$$ and any common divisor divides $$d$$, so $$d$$ is a gcd. (Official solution: same.)",
                    tags: ["PIDs", "gcd"]
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
            ],
            statistics: [
                {
                    id: 'stats1',
                    difficulty: 25,
                    type: 'multiple-choice',
                    question: 'What is the mean of the following dataset? $\\{2, 4, 6, 8, 10\\}$',
                    answer1: '5',
                    answer2: '6',
                    answer3: '7',
                    answer4: '8',
                    correct: 'answer2',
                    solution: 'The mean is calculated by summing all the numbers and dividing by the count. $(2+4+6+8+10)/5 = 30/5 = 6$',
                    tags: ['descriptive statistics', 'mean']
                },
                {
                    id: 'stats2',
                    difficulty: 30,
                    type: 'multiple-choice',
                    question: 'If a fair six-sided die is rolled, what is the probability of rolling a 3 or a 5?',
                    answer1: '$$\\frac{1}{6}$$',
                    answer2: '$$\\frac{1}{3}$$',
                    answer3: '$$\\frac{1}{2}$$',
                    answer4: '$$\\frac{2}{3}$$',
                    correct: 'answer2',
                    solution: 'There are 2 favorable outcomes (3 and 5) out of 6 possible outcomes. The probability is $2/6 = 1/3$',
                    tags: ['probability', 'basic probability']
                },
                {
                    id: 'stats3',
                    difficulty: 40,
                    type: 'multiple-choice',
                    question: 'In a normal distribution with mean $$\\mu = 50$$ and standard deviation $$\\sigma = 10$$, approximately what percentage of the data falls between 40 and 60?',
                    answer1: '50%',
                    answer2: '68%',
                    answer3: '95%',
                    answer4: '99.7%',
                    correct: 'answer2',
                    solution: 'In a normal distribution, about 68% of the data falls within one standard deviation of the mean. Here, 40 to 60 is $\\mu \\pm \\sigma$.'
                },
                {
                    id: 'stats4',
                    difficulty: 35,
                    type: 'multiple-choice',
                    question: 'What is the median of the following dataset? $$\\{3, 1, 7, 4, 9, 5, 2\\}$$',
                    answer1: '3',
                    answer2: '4',
                    answer3: '5',
                    answer4: '7',
                    correct: 'answer2',
                    solution: 'First, sort the data: $$\\{1, 2, 3, 4, 5, 7, 9\\}$$. The median is the middle value, which is 4.'
                },
                {
                    id: 'stats5',
                    difficulty: 45,
                    type: 'multiple-choice',
                    question: 'If the correlation coefficient between two variables is 0.85, this indicates:',
                    answer1: 'No relationship between the variables',
                    answer2: 'A strong positive linear relationship',
                    answer3: 'A strong negative linear relationship',
                    answer4: 'A perfect linear relationship',
                    correct: 'answer2',
                    solution: 'A correlation coefficient of 0.85 indicates a strong positive linear relationship. The value is close to 1, which would indicate a perfect positive linear relationship.'
                },
                {
                    id: 'stats6',
                    difficulty: 45,
                    type: 'multiple-choice',
                    question: 'In a class of 30 students, 18 play football, 15 play basketball, and 7 play both. How many students play neither sport?',
                    answer1: '1',
                    answer2: '4',
                    answer3: '7',
                    answer4: '0',
                    correct: 'answer2',
                    solution: '18 play football, 7 of whom also play basketball. So 11 play only football, 8 play only basketball, and 7 play both. So 18 + 8 = 26 play at least one sport. So 30 - 26 = 4 play neither sport.'
                },
                {
                    id: 'stats7',
                    difficulty: 55,
                    type: 'multiple-choice',
                    question: 'The basic form of a general linear model is $$y_i = \\beta_0 + \\beta_1 x_{1i} + \\beta_2 x_{2i} + ... + \\beta_p x_{pi} + \\epsilon_i$$. What is the response variable?',
                    answer1: 'a constant',
                    answer2: '$$\\y_i$$',
                    answer3: 'The set of $$x_{pi}$$ variables',
                    answer4: '$$\\epsilon_i$$',
                    correct: 'answer2',
                    solution: 'The response variable represents the outcome being predicted'
                },
                {
                    id: "stats8",
                    difficulty: 35,
                    type: "multiple-choice",
                    question: "In a simple linear regression model $$y_i = \\beta_0 + \\beta_1 x_i + \\epsilon_i$$, what is assumed about the error term $$\\epsilon_i$$?",
                    answer1: "It has mean zero and constant variance",
                    answer2: "It is always positive",
                    answer3: "It is perfectly correlated with $$x_i$$",
                    answer4: "It grows with $$x_i$$",
                    correct: "answer1",
                    solution: "Linear regression assumes errors have mean zero, constant variance, and are independent of the predictors."
                },
                {
                    id: "stats9",
                    difficulty: 45,
                    type: "multiple-choice",
                    question: "Which type of outcome is appropriate for a logistic regression model?",
                    answer1: "Continuous measurement like height",
                    answer2: "Count data like number of visits",
                    answer3: "Binary outcome like success/failure",
                    answer4: "Time-to-event outcome",
                    correct: "answer3",
                    solution: "Logistic regression is used for binary outcomes, linking predictors to the probability of success."
                },
                {
                    id: "stats10",
                    difficulty: 50,
                    type: "multiple-choice",
                    question: "In a generalized linear model (GLM), what replaces the assumption of normally distributed errors?",
                    answer1: "Any distribution from the exponential family",
                    answer2: "Only Poisson-distributed errors",
                    answer3: "Heavy-tailed error distributions",
                    answer4: "No distributional assumption at all",
                    correct: "answer1",
                    solution: "GLMs allow response variables to follow distributions from the exponential family, such as binomial, Poisson, or normal."
                },
                {
                    id: "stats11",
                    difficulty: 55,
                    type: "multiple-choice",
                    question: "What is the purpose of a link function in a GLM?",
                    answer1: "It removes random effects",
                    answer2: "It maps the mean of the response to a linear predictor",
                    answer3: "It standardizes the predictors",
                    answer4: "It ensures the response variable is normally distributed",
                    correct: "answer2",
                    solution: "The link function connects the expected value of the response variable to the linear predictor of covariates."
                },
                {
                    id: "stats12",
                    difficulty: 55,
                    type: "multiple-choice",
                    question: "Which model is most appropriate when outcomes are counts with overdispersion (variance > mean)?",
                    answer1: "Simple linear regression",
                    answer2: "Poisson regression",
                    answer3: "Negative binomial regression",
                    answer4: "ANOVA",
                    correct: "answer3",
                    solution: "Negative binomial regression extends Poisson regression to handle overdispersed count data."
                },
                {
                    id: "stats13",
                    difficulty: 60,
                    type: "multiple-choice",
                    question: "Why might we add random effects to a model?",
                    answer1: "To reduce computation time",
                    answer2: "To account for non-independence of observations within groups",
                    answer3: "To eliminate the need for predictors",
                    answer4: "To guarantee a better fit",
                    correct: "answer2",
                    solution: "Random effects capture variation across clusters (e.g., schools, individuals) when observations are not independent."
                },
                {
                    id: "stats14",
                    difficulty: 65,
                    type: "multiple-choice",
                    question: "A mixed-effects model combines what two types of effects?",
                    answer1: "Fixed effects and random effects",
                    answer2: "Independent effects and dependent effects",
                    answer3: "Correlated effects and uncorrelated effects",
                    answer4: "Main effects and interaction effects",
                    correct: "answer1",
                    solution: "Mixed-effects models include fixed effects (population-level) and random effects (group- or subject-level)."
                },
                {
                    id: "stats15",
                    difficulty: 70,
                    type: "multiple-choice",
                    question: "In a GLMM with a binary outcome and random intercepts for subjects, what does the random intercept capture?",
                    answer1: "The fixed effect of a predictor",
                    answer2: "Individual-level variation in baseline probability",
                    answer3: "Measurement error",
                    answer4: "Overdispersion in the data",
                    correct: "answer2",
                    solution: "Random intercepts allow each subject to have their own baseline probability, accounting for subject-specific differences."
                },
                {
                    id: "stats16",
                    difficulty: 75,
                    type: "multiple-choice",
                    question: "What advantage do GLMMs have over standard GLMs?",
                    answer1: "They require fewer assumptions about link functions",
                    answer2: "They can model correlated data by including random effects",
                    answer3: "They always guarantee smaller residuals",
                    answer4: "They eliminate the need for a distributional family",
                    correct: "answer2",
                    solution: "GLMMs extend GLMs by including random effects, allowing analysis of correlated or clustered data."
                },
                {
                    id: "stats17",
                    difficulty: 80,
                    type: "multiple-choice",
                    question: "Suppose we model bat activity at multiple sites, with counts per night as the response, and include site as a random effect. Why is this a GLMM?",
                    answer1: "Because the outcome is binary",
                    answer2: "Because the predictors are random",
                    answer3: "Because the response is count data with a log link and random effects",
                    answer4: "Because the errors are normally distributed",
                    correct: "answer3",
                    solution: "This is a GLMM: it models a Poisson response (count data), uses a log link, and includes site-level random effects."
                },
                {
                    id: "stats18",
                    difficulty: 10,
                    type: "multiple-choice",
                    question: "Which of the following is an example of a categorical variable?",
                    answer1: "Height of a person in centimeters",
                    answer2: "The number of books on a shelf",
                    answer3: "Type of fruit: apple, banana, orange",
                    answer4: "Temperature in degrees Celsius",
                    correct: "answer3",
                    solution: "Categorical variables represent groupings, such as fruit type, rather than continuous measurements."
                },
                {
                    id: "stats19",
                    difficulty: 20,
                    type: "multiple-choice",
                    question: "If two variables have a correlation of +1, what does that mean?",
                    answer1: "They are unrelated",
                    answer2: "They increase together perfectly",
                    answer3: "They decrease together perfectly",
                    answer4: "They have no linear relationship",
                    correct: "answer2",
                    solution: "A correlation of +1 means the two variables increase in exact proportion."
                },
                {
                    id: "stats20",
                    difficulty: 25,
                    type: "multiple-choice",
                    question: "What does the slope $$\\beta_1$$ represent in a simple linear regression?",
                    answer1: "The predicted value of $$y$$ when $$x=0$$",
                    answer2: "The change in $$y$$ for a one-unit increase in $$x$$",
                    answer3: "The random error term",
                    answer4: "The intercept of the regression line",
                    correct: "answer2",
                    solution: "The slope tells us how the response variable changes when the predictor increases by one unit."
                },
                {
                    id: "stats21",
                    difficulty: 30,
                    type: "multiple-choice",
                    question: "Which assumption is critical in ordinary least squares regression?",
                    answer1: "Predictors must be categorical",
                    answer2: "Errors are independent with constant variance",
                    answer3: "All predictors must be normally distributed",
                    answer4: "Responses must be integers",
                    correct: "answer2",
                    solution: "OLS assumes errors are independent, mean zero, and homoscedastic (constant variance)."
                },
                {
                    id: "stats22",
                    difficulty: 40,
                    type: "multiple-choice",
                    question: "What does $$R^2$$ measure in regression?",
                    answer1: "The slope of the line",
                    answer2: "The variance of the errors",
                    answer3: "The proportion of variance in the response explained by the model",
                    answer4: "The correlation between predictors",
                    correct: "answer3",
                    solution: "$$R^2$$ quantifies how much variation in the response is explained by the predictors."
                },
                {
                    id: "stats23",
                    difficulty: 50,
                    type: "multiple-choice",
                    question: "Which of the following is an example of a generalized linear model (GLM)?",
                    answer1: "Simple linear regression with normally distributed errors",
                    answer2: "Logistic regression for binary outcomes",
                    answer3: "Poisson regression for count data",
                    answer4: "All of the above",
                    correct: "answer4",
                    solution: "All listed models are GLMs: linear regression (normal), logistic (binomial), and Poisson regression."
                },
                {
                    id: "stats24",
                    difficulty: 65,
                    type: "multiple-choice",
                    question: "In a mixed model, what does a random slope represent?",
                    answer1: "The average effect of a predictor across all groups",
                    answer2: "Variation in how the predictor’s effect differs between groups",
                    answer3: "The baseline response for all individuals",
                    answer4: "Measurement error in predictors",
                    correct: "answer2",
                    solution: "Random slopes allow the effect of a predictor to vary across groups (e.g., classrooms, sites)."
                },
                {
                    id: "stats25",
                    difficulty: 70,
                    type: "multiple-choice",
                    question: "Which situation is best modeled with a GLMM?",
                    answer1: "Binary data with independent observations",
                    answer2: "Count data with correlated observations within subjects",
                    answer3: "Continuous data with constant variance",
                    answer4: "Independent categorical data",
                    correct: "answer2",
                    solution: "GLMMs extend GLMs to correlated data structures, such as repeated counts within subjects."
                },
                {
                    id: "stats26",
                    difficulty: 75,
                    type: "multiple-choice",
                    question: "What estimation method is commonly used to fit GLMMs?",
                    answer1: "Ordinary least squares",
                    answer2: "Restricted maximum likelihood (REML) or Laplace approximation",
                    answer3: "Simple linear optimization",
                    answer4: "Chi-square tests",
                    correct: "answer2",
                    solution: "GLMMs are typically fit using REML, Laplace approximation, or adaptive quadrature due to their complexity."
                },
                {
                    id: "stats27",
                    difficulty: 80,
                    type: "multiple-choice",
                    question: "When fitting a GLMM, why might convergence issues occur?",
                    answer1: "Too few predictors in the model",
                    answer2: "Random effects are complex or data are sparse",
                    answer3: "Link functions are only approximate",
                    answer4: "Responses are not normally distributed",
                    correct: "answer2",
                    solution: "Convergence problems often arise when the random-effects structure is too complex or data do not support estimation."
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
        
        // Get IDs of correctly answered problems
        const correctProblemIds = new Set(
            this.userProgress.problemHistory
                .filter(attempt => attempt.correct)
                .map(attempt => attempt.problemId)
        );
        
        // Filter problems within ±15 difficulty levels of current (adjusted for 1-100 scale)
        // and exclude problems that were already answered correctly
        const minDifficulty = Math.max(1, this.userProgress.currentDifficulty - 15);
        const maxDifficulty = Math.min(this.difficultyLevels, this.userProgress.currentDifficulty + 15);
        
        const filteredProblems = availableProblems.filter(problem => 
            problem.difficulty >= minDifficulty && 
            problem.difficulty <= maxDifficulty &&
            !correctProblemIds.has(problem.id)  // Exclude correctly answered problems
        );
        
        // If we have filtered problems, use them, otherwise use all available (except correctly answered ones)
        const problemsToUse = filteredProblems.length > 0 
            ? filteredProblems 
            : availableProblems.filter(problem => !correctProblemIds.has(problem.id));
        
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
