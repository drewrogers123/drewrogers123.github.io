// Main application
class MathPhysicsApp {
    constructor() {
        this.currentProblem = null;
        this.currentSubject = null;
        this.currentTopic = null;
        this.startTime = null;
        this.timer = null;
        
        this.initializeEventListeners();
        this.initializeUI();
    }
    
    // Initialize event listeners
    initializeEventListeners() {
        // Subject button clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('subject-btn')) {
                this.handleSubjectSelect(e.target.dataset.subject, e.target.dataset.topic);
            }
        });
        
        // Submit answer (short answer)
        document.getElementById('submit-answer').addEventListener('click', () => this.checkAnswer());
        
        // Submit answer (multiple choice)
        document.getElementById('submit-mc-answer').addEventListener('click', () => this.checkAnswer());
        
        // Next problem
        document.getElementById('next-btn').addEventListener('click', () => this.loadNewProblem());
        
        // Back button
        document.getElementById('back-btn').addEventListener('click', () => this.backToSubjects());
        
        // Handle Enter key in answer input
        document.getElementById('answer-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });
    }
    
    // Initialize UI elements
    initializeUI() {
        // Show subject selection by default
        document.getElementById('subject-selection').classList.remove('hidden');
        document.getElementById('problem-container').classList.add('hidden');
        
        // Initialize progress
        problemBank.updateProgressUI();
    }
    
    // Handle subject selection
    handleSubjectSelect(subject, topic) {
        this.currentSubject = subject;
        this.currentTopic = topic;
        
        // Update problem bank with current subject/topic
        problemBank.userProgress.lastSubject = subject;
        problemBank.userProgress.lastTopic = topic;
        
        // Show problem container and hide subject selection
        document.getElementById('subject-selection').classList.add('hidden');
        document.getElementById('problem-container').classList.remove('hidden');
        
        // Update category title
        const subjectName = subjects[subject]?.name || 'Mathematics';
        let topicName = '';
        
        if (subject && topic) {
            const topicObj = subjects[subject]?.topics.find(t => t.id === topic);
            topicName = topicObj ? `: ${topicObj.name}` : '';
        }
        
        document.getElementById('problem-category').textContent = `${subjectName}${topicName}`;
        
        // Load first problem
        this.loadNewProblem();
    }
    
    // Load a new problem
    loadNewProblem() {
        // Reset UI
        const answerInput = document.getElementById('answer-input');
        const mcOptions = document.getElementById('mc-options');
        const feedbackEl = document.getElementById('feedback');
        const nextBtn = document.getElementById('next-btn');
        
        // Reset input and feedback
        answerInput.value = '';
        answerInput.disabled = false;
        document.getElementById('submit-answer').disabled = false;
        
        // Clear feedback and MC options
        feedbackEl.className = 'feedback';
        feedbackEl.textContent = '';
        mcOptions.innerHTML = '';
        
        // Reset buttons
        nextBtn.classList.add('hidden');
        
        // Get a new problem
        this.currentProblem = problemBank.getProblem(this.currentSubject, this.currentTopic);
        
        // Show/hide appropriate input based on question type
        const isMultipleChoice = this.currentProblem.type === 'multiple-choice';
        document.getElementById('answer-section').style.display = isMultipleChoice ? 'none' : 'block';
        document.getElementById('mc-section').style.display = isMultipleChoice ? 'block' : 'none';
        
        // Setup multiple choice options if needed
        if (isMultipleChoice) {
            this.setupMultipleChoiceOptions();
        } else {
            answerInput.focus();
        }
        
        // Display the problem
        this.renderProblem(this.currentProblem);
        
        // Start timer for this problem
        this.startTimer();
        
        // Ensure input is focused
        answerInput.focus();
    }
    
    // Render problem using KaTeX
    renderProblem(problem) {
        const problemText = document.getElementById('problem-text');
        
        try {
            // First, clear any existing content
            problemText.innerHTML = problem.question;
            
            // Use KaTeX auto-render to process all LaTeX in the problem text
            renderMathInElement(problemText, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ],
                throwOnError: false
            });
            
        } catch (e) {
            console.error('Error rendering problem:', e);
            problemText.textContent = problem.question;
        }
    }
    
    // Start the timer for the current problem
    startTimer() {
        this.startTime = Date.now();
        
        // Clear any existing timer
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        // Update timer display every second
        this.timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            // Could update a timer display here if needed
        }, 1000);
    }
    
    // Setup multiple choice options with LaTeX support
    setupMultipleChoiceOptions() {
        const mcOptions = document.getElementById('mc-options');
        mcOptions.innerHTML = '';
        
        // Create radio buttons for each answer choice
        for (let i = 1; i <= 4; i++) {
            const answerKey = `answer${i}`;
            if (this.currentProblem[answerKey] === undefined) continue;
            
            const option = document.createElement('div');
            option.className = 'mc-option';
            
            // Create radio button
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.id = `mc-${i}`;
            radio.name = 'mc-answer';
            radio.value = `answer${i}`;
            
            // Create label with LaTeX support
            const label = document.createElement('label');
            label.htmlFor = `mc-${i}`;
            
            // Process the answer text for LaTeX
            const answerText = this.currentProblem[answerKey];
            const parts = answerText.split(/(\$.*?\$)/g);
            
            parts.forEach(part => {
                if (part.startsWith('$') && part.endsWith('$')) {
                    // This is a LaTeX expression
                    const latexSpan = document.createElement('span');
                    try {
                        katex.render(part.slice(1, -1), latexSpan, {
                            throwOnError: false,
                            displayMode: false
                        });
                    } catch (e) {
                        console.error('Error rendering LaTeX:', e);
                        latexSpan.textContent = part;
                    }
                    label.appendChild(latexSpan);
                } else if (part) {
                    // Regular text
                    label.appendChild(document.createTextNode(part));
                }
            });
            
            option.appendChild(radio);
            option.appendChild(label);
            mcOptions.appendChild(option);
        }
    }
    
    // Get the user's selected answer (for multiple choice)
    getSelectedAnswer() {
        const selectedOption = document.querySelector('input[name="mc-answer"]:checked');
        return selectedOption ? selectedOption.value : null;
    }
    
    // Check the user's answer
    checkAnswer() {
        if (!this.currentProblem) return;
        
        let userAnswer;
        let isMultipleChoice = this.currentProblem.type === 'multiple-choice';
        
        if (isMultipleChoice) {
            userAnswer = this.getSelectedAnswer();
            if (!userAnswer) return; // No option selected
        } else {
            userAnswer = document.getElementById('answer-input').value.trim();
            if (!userAnswer) return;
        }
        
        // Disable input and buttons during feedback
        const answerInput = document.getElementById('answer-input');
        const submitBtn = document.getElementById('submit-answer');
        const mcOptions = document.querySelectorAll('input[name="mc-answer"]');
        
        answerInput.disabled = true;
        submitBtn.disabled = true;
        mcOptions.forEach(opt => opt.disabled = true);
        
        // Stop the timer
        const timeSpent = (Date.now() - this.startTime) / 1000; // in seconds
        clearInterval(this.timer);
        
        // Check if answer is correct
        const isCorrect = problemBank.checkAnswer(this.currentProblem, userAnswer);
        
        // Update difficulty based on performance
        problemBank.updateDifficulty(isCorrect);
        
        // Show feedback
        const feedbackEl = document.getElementById('feedback');
        const nextBtn = document.getElementById('next-btn');
        
        if (isCorrect) {
            feedbackEl.className = 'feedback correct';
            feedbackEl.textContent = 'Correct!';
        } else {
            feedbackEl.className = 'feedback incorrect';
            feedbackEl.textContent = 'Incorrect. Try again!';
        }
        
        // Show next button
        nextBtn.classList.remove('hidden');
        nextBtn.focus();
        
        // Store problem attempt in history
        problemBank.userProgress.problemHistory.push({
            problemId: this.currentProblem.id,
            timestamp: new Date().toISOString(),
            correct: isCorrect,
            timeSpent: timeSpent,
            userAnswer: userAnswer
        });
        
        // If the answer is correct, auto-advance after a short delay.
        // Otherwise, wait for the user to click 'Next Problem'.
        if (isCorrect) {
            setTimeout(() => {
                this.loadNewProblem();
            }, 2000); // 2-second delay
        } else {
            // Re-enable input for another attempt if the answer was wrong
            answerInput.disabled = false;
            submitBtn.disabled = false;
            answerInput.focus();
            answerInput.select();
        }
    }
    
    // Go back to subjects screen
    backToSubjects() {
        // Stop any running timers
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // Reset current problem
        this.currentProblem = null;
        
        // Show subject selection and hide problem container
        document.getElementById('subject-selection').classList.remove('hidden');
        document.getElementById('problem-container').classList.add('hidden');
        
        // Reset UI state
        document.getElementById('answer-input').value = '';
        document.getElementById('feedback').className = 'feedback';
        document.getElementById('feedback').textContent = '';
        document.getElementById('next-btn').classList.add('hidden');
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize KaTeX auto-render
    window.katex = katex;
    
    // Configure KaTeX auto-render
    document.addEventListener('DOMContentLoaded', function() {
        renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError: false
        });
    });
    
    // Start the application
    window.app = new MathPhysicsApp();
});
