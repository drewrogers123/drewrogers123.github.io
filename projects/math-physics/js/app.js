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
            problemText.innerHTML = '';
            
            // Process the question text to handle both inline ($) and display ($$) LaTeX
            const parts = problem.question.split(/(\$\$.*?\$\$|\$.*?\$)/g);

            parts.forEach(part => {
                if (part) { // Filter out empty strings from split
                    let isDisplay = false;
                    let latexExpr = '';

                    if (part.startsWith('$$') && part.endsWith('$$')) {
                        isDisplay = true;
                        latexExpr = part.slice(2, -2);
                    } else if (part.startsWith('$') && part.endsWith('$')) {
                        isDisplay = false;
                        latexExpr = part.slice(1, -1);
                    }

                    if (latexExpr) {
                        const container = document.createElement(isDisplay ? 'div' : 'span');
                        container.className = isDisplay ? 'latex-display' : 'latex-inline';
                        problemText.appendChild(container);
                        try {
                            katex.render(latexExpr, container, { throwOnError: false, displayMode: isDisplay });
                        } catch (e) {
                            console.error('KaTeX rendering error:', e);
                            container.textContent = latexExpr;
                        }
                    } else {
                        problemText.appendChild(document.createTextNode(part));
                    }
                }
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
    
    // Setup multiple choice options
    setupMultipleChoiceOptions() {
        const mcOptions = document.getElementById('mc-options');
        mcOptions.innerHTML = '';
        
        // Create radio buttons for each answer choice
        for (let i = 1; i <= 4; i++) {
            const answerKey = `answer${i}`;
            if (this.currentProblem[answerKey] === undefined) continue;
            
            const option = document.createElement('div');
            option.className = 'mc-option';
            option.innerHTML = `
                <input type="radio" id="mc-${i}" name="mc-answer" value="answer${i}">
                <label for="mc-${i}">${this.currentProblem[answerKey]}</label>
            `;
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
        feedbackEl.innerHTML = ''; // Clear previous feedback
        
        // Create feedback message
        const messageEl = document.createElement('div');
        messageEl.className = `feedback-message ${isCorrect ? 'correct' : 'incorrect'}`;
        messageEl.textContent = isCorrect ? '✅ Correct! 🎉' : '❌ Incorrect';
        feedbackEl.appendChild(messageEl);
        
        // Don't show the correct answer or solution
        
        // Show next button
        const nextBtn = document.getElementById('next-btn');
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
    
    // Create and initialize the app
    window.app = new MathPhysicsApp();
});
