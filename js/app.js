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
        document.getElementById('answer-input').value = '';
        document.getElementById('feedback').className = 'feedback';
        document.getElementById('feedback').textContent = '';
        document.getElementById('next-btn').classList.add('hidden');
        document.getElementById('hint-btn').disabled = false;
        
        // Get a new problem
        this.currentProblem = problemBank.getProblem(this.currentSubject, this.currentTopic);
        
        // Display the problem
        this.renderProblem(this.currentProblem);
        
        // Start timer for this problem
        this.startTimer();
    }
    
    // Render problem using KaTeX
    renderProblem(problem) {
        const problemText = document.getElementById('problem-text');
        
        try {
            // Use KaTeX to render the problem
            katex.render(problem.question, problemText, {
                throwOnError: false,
                displayMode: true
            });
        } catch (e) {
            // If KaTeX rendering fails, display as plain text
            problemText.textContent = problem.question;
            console.error('KaTeX rendering error:', e);
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
        
        // Stop the timer
        const timeSpent = (Date.now() - this.startTime) / 1000; // in seconds
        clearInterval(this.timer);
        
        // Check if answer is correct
        const isCorrect = problemBank.checkAnswer(this.currentProblem, userAnswer);
        
        // Update difficulty based on performance
        problemBank.updateDifficulty(isCorrect);
        
        // Show feedback
        const feedbackEl = document.getElementById('feedback');
        feedbackEl.textContent = isCorrect ? 'Correct! 🎉' : `Incorrect. The correct answer is ${this.currentProblem.answer}.`;
        feedbackEl.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        
        // Show solution if available and answer was wrong
        if (!isCorrect && this.currentProblem.solution) {
            const solutionEl = document.createElement('div');
            solutionEl.className = 'solution';
            solutionEl.style.marginTop = '10px';
            solutionEl.innerHTML = `<strong>Solution:</strong> ${this.currentProblem.solution}`;
            feedbackEl.appendChild(solutionEl);
            
            // Render any LaTeX in the solution
            katex.render(this.currentProblem.solution, solutionEl, {
                throwOnError: false,
                displayMode: true
            });
        }
        
        // Show next button
        document.getElementById('next-btn').classList.remove('hidden');
        document.getElementById('hint-btn').disabled = true;
        
        // Store problem attempt in history
        problemBank.userProgress.problemHistory.push({
            problemId: this.currentProblem.id,
            timestamp: new Date().toISOString(),
            correct: isCorrect,
            timeSpent: timeSpent,
            userAnswer: userAnswer
        });
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
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize KaTeX auto-render
    window.katex = katex;
    
    // Create and initialize the app
    window.app = new MathPhysicsApp();
});
