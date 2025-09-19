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
        
        // Submit answer
        document.getElementById('submit-answer').addEventListener('click', () => this.checkAnswer());
        
        // Next problem
        document.getElementById('next-btn').addEventListener('click', () => this.loadNewProblem());
        
        // Hint button
        document.getElementById('hint-btn').addEventListener('click', () => this.showHint());
        
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
        const selectedSubject = subjects.find(s => s.id === topic);
        if (selectedSubject) {
            document.getElementById('problem-category').textContent = selectedSubject.name;
        } else {
            document.getElementById('problem-category').textContent = 'Practice Problems';
        }
        
        // Load first problem
        this.loadNewProblem();
    }
    
    // Load a new problem
    loadNewProblem() {
        // Reset UI
        const answerInput = document.getElementById('answer-input');
        const feedbackEl = document.getElementById('feedback');
        const nextBtn = document.getElementById('next-btn');
        const hintBtn = document.getElementById('hint-btn');
        
        // Reset input and feedback
        answerInput.value = '';
        answerInput.disabled = false;
        answerInput.focus();
        
        // Clear feedback
        feedbackEl.className = 'feedback';
        feedbackEl.textContent = '';
        
        // Reset buttons
        nextBtn.classList.add('hidden');
        hintBtn.disabled = false;
        
        // Get a new problem
        this.currentProblem = problemBank.getProblem(this.currentSubject, this.currentTopic);
        
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
            
            // Process the question text to handle LaTeX expressions
            const parts = problem.question.split(/(\$.*?\$)/g);
            
            parts.forEach((part, index) => {
                if (part.startsWith('$') && part.endsWith('$')) {
                    // This is a LaTeX expression
                    const latexExpr = part.slice(1, -1); // Remove the $ delimiters
                    const span = document.createElement('span');
                    problemText.appendChild(span);
                    
                    try {
                        katex.render(latexExpr, span, {
                            throwOnError: false,
                            displayMode: false,
                            output: 'html',
                            strict: false
                        });
                    } catch (e) {
                        console.error('Error rendering LaTeX:', e);
                        span.textContent = latexExpr;
                    }
                } else if (part.trim() !== '') {
                    // This is regular text
                    const textNode = document.createTextNode(part);
                    problemText.appendChild(textNode);
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
    
    // Check the user's answer
    checkAnswer() {
        if (!this.currentProblem) return;
        
        const userAnswer = document.getElementById('answer-input').value.trim();
        if (!userAnswer) return;
        
        // Disable input and buttons during feedback
        const answerInput = document.getElementById('answer-input');
        const submitBtn = document.getElementById('submit-answer');
        answerInput.disabled = true;
        submitBtn.disabled = true;
        
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
        
        // Show correct answer if wrong
        if (!isCorrect) {
            const correctAnswerEl = document.createElement('div');
            correctAnswerEl.className = 'correct-answer';
            correctAnswerEl.innerHTML = `The correct answer is: <span class="answer">${this.currentProblem.answer}</span>`;
            feedbackEl.appendChild(correctAnswerEl);
        }
        
        // Show solution if available
        if (this.currentProblem.solution) {
            const solutionEl = document.createElement('div');
            solutionEl.className = 'solution';
            solutionEl.style.marginTop = '10px';
            
            const solutionTitle = document.createElement('div');
            solutionTitle.className = 'solution-title';
            solutionTitle.textContent = 'Solution:';
            solutionEl.appendChild(solutionTitle);
            
            const solutionContent = document.createElement('div');
            solutionContent.className = 'solution-content';
            
            // Process the solution text to handle LaTeX
            const parts = this.currentProblem.solution.split(/(\$.*?\$)/g);
            parts.forEach(part => {
                if (part.startsWith('$') && part.endsWith('$')) {
                    const latexExpr = part.slice(1, -1);
                    const span = document.createElement('span');
                    solutionContent.appendChild(span);
                    
                    try {
                        katex.render(latexExpr, span, {
                            throwOnError: false,
                            displayMode: false
                        });
                    } catch (e) {
                        console.error('Error rendering solution LaTeX:', e);
                        span.textContent = latexExpr;
                    }
                } else if (part.trim() !== '') {
                    solutionContent.appendChild(document.createTextNode(part));
                }
            });
            
            solutionEl.appendChild(solutionContent);
            feedbackEl.appendChild(solutionEl);
        }
        
        // Show next button
        const nextBtn = document.getElementById('next-btn');
        nextBtn.classList.remove('hidden');
        nextBtn.focus();
        
        // Disable hint button
        document.getElementById('hint-btn').disabled = true;
        
        // Store problem attempt in history
        problemBank.userProgress.problemHistory.push({
            problemId: this.currentProblem.id,
            timestamp: new Date().toISOString(),
            correct: isCorrect,
            timeSpent: timeSpent,
            userAnswer: userAnswer
        });
        
        // If answer is correct, automatically move to next problem after a delay
        if (isCorrect) {
            setTimeout(() => {
                this.loadNewProblem();
            }, 2000); // 2 second delay
        } else {
            // Re-enable input for trying again
            answerInput.disabled = false;
            submitBtn.disabled = false;
            answerInput.focus();
            answerInput.select();
        }
    }
    
    // Show a hint for the current problem
    showHint() {
        if (!this.currentProblem || !this.currentProblem.solution) return;
        
        // Disable hint button after first use
        document.getElementById('hint-btn').disabled = true;
        
        // Show a simplified version of the solution as a hint
        const feedbackEl = document.getElementById('feedback');
        feedbackEl.textContent = 'Hint: ' + this.currentProblem.solution.split('.')[0] + '.';
        feedbackEl.className = 'feedback';
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
