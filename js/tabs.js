// Tab and form management system
class TabManager {
    constructor() {
        this.currentTab = 'practice';
        this.isAuthenticated = false;
        this.pendingQuestions = JSON.parse(localStorage.getItem('pendingQuestions') || '[]');
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.setupAddQuestionForm();
        this.setupAuthForm();
        this.populateTopicSelect();
    }

    // Tab Navigation
    setupTabNavigation() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                this.switchTab(targetTab);
            });
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // Update tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        const targetPanel = document.getElementById(`${tabName}-tab`);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }

        this.currentTab = tabName;

        // Load pending questions if switching to review tab and authenticated
        if (tabName === 'review' && this.isAuthenticated) {
            this.loadPendingQuestions();
        }
    }

    // Add Question Form
    setupAddQuestionForm() {
        const form = document.getElementById('add-question-form');
        const subjectSelect = document.getElementById('subject-select');
        const topicSelect = document.getElementById('topic-select');

        // Update topics when subject changes
        subjectSelect.addEventListener('change', () => {
            this.updateTopicOptions(subjectSelect.value);
        });

        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitQuestion();
        });
    }

    populateTopicSelect() {
        const subjectSelect = document.getElementById('subject-select');
        if (subjectSelect.value) {
            this.updateTopicOptions(subjectSelect.value);
        }
    }

    updateTopicOptions(subject) {
        const topicSelect = document.getElementById('topic-select');
        topicSelect.innerHTML = '<option value="">Select Topic</option>';

        if (subject && window.subjects && window.subjects[subject]) {
            window.subjects[subject].topics.forEach(topic => {
                const option = document.createElement('option');
                option.value = topic.id;
                option.textContent = topic.name;
                topicSelect.appendChild(option);
            });
        }
    }

    submitQuestion() {
        const formData = {
            id: 'pending_' + Date.now(),
            subject: document.getElementById('subject-select').value,
            topic: document.getElementById('topic-select').value,
            question: document.getElementById('question-input').value,
            answer: document.getElementById('answer-input-form').value,
            solution: document.getElementById('solution-input').value,
            tags: document.getElementById('tags-input').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            difficulty: parseInt(document.getElementById('difficulty-input').value),
            status: 'pending',
            submittedAt: new Date().toISOString()
        };

        // Validate form
        if (!formData.subject || !formData.topic || !formData.question || 
            !formData.answer || !formData.solution || !formData.difficulty) {
            this.showFeedback('submission-feedback', 'Please fill in all required fields.', 'error');
            return;
        }

        if (formData.difficulty < 1 || formData.difficulty > 100) {
            this.showFeedback('submission-feedback', 'Difficulty must be between 1 and 100.', 'error');
            return;
        }

        // Add to pending questions
        this.pendingQuestions.push(formData);
        localStorage.setItem('pendingQuestions', JSON.stringify(this.pendingQuestions));

        // Show success message
        this.showFeedback('submission-feedback', 'Question submitted successfully! It will be reviewed before being added to the database.', 'success');

        // Reset form
        document.getElementById('add-question-form').reset();
        this.updateTopicOptions('');
    }

    // Authentication
    setupAuthForm() {
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.authenticate();
        });
    }

    authenticate() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple authentication (in production, this would be server-side)
        if (username === 'drew' && password === 'password') {
            this.isAuthenticated = true;
            document.getElementById('auth-section').classList.add('hidden');
            document.getElementById('review-section').classList.remove('hidden');
            this.loadPendingQuestions();
        } else {
            this.showFeedback('auth-feedback', 'Invalid username or password.', 'error');
        }
    }

    // Question Review
    loadPendingQuestions() {
        const container = document.getElementById('pending-questions');
        container.innerHTML = '';

        const pendingQuestions = this.pendingQuestions.filter(q => q.status === 'pending');

        if (pendingQuestions.length === 0) {
            container.innerHTML = '<p>No pending questions to review.</p>';
            return;
        }

        pendingQuestions.forEach(question => {
            const questionCard = this.createQuestionCard(question);
            container.appendChild(questionCard);
        });
    }

    createQuestionCard(question) {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.innerHTML = `
            <h4>Question ID: ${question.id}</h4>
            <div class="question-meta">
                <span><strong>Subject:</strong> ${question.subject}</span>
                <span><strong>Topic:</strong> ${question.topic}</span>
                <span><strong>Difficulty:</strong> ${question.difficulty} (${window.problemBank ? window.problemBank.getEducationalLevel(question.difficulty) : 'Unknown'})</span>
                <span><strong>Submitted:</strong> ${new Date(question.submittedAt).toLocaleDateString()}</span>
            </div>
            <div><strong>Question:</strong> ${question.question}</div>
            <div><strong>Answer:</strong> ${question.answer}</div>
            <div><strong>Solution:</strong> ${question.solution}</div>
            <div><strong>Tags:</strong> ${question.tags.join(', ')}</div>
            <div class="question-actions">
                <button class="approve-btn" onclick="tabManager.approveQuestion('${question.id}')">Approve</button>
                <button class="deny-btn" onclick="tabManager.denyQuestion('${question.id}')">Deny</button>
            </div>
        `;
        return card;
    }

    approveQuestion(questionId) {
        const questionIndex = this.pendingQuestions.findIndex(q => q.id === questionId);
        if (questionIndex === -1) return;

        const question = this.pendingQuestions[questionIndex];
        
        // Add to the main problem database
        if (window.problemBank) {
            const problemData = {
                subject: question.subject,
                topic: question.topic,
                question: question.question,
                answer: question.answer,
                solution: question.solution,
                difficulty: question.difficulty,
                tags: question.tags
            };
            
            const newId = window.problemBank.addProblem(problemData);
            console.log(`Question approved and added with ID: ${newId}`);
        }

        // Remove from pending questions
        this.pendingQuestions.splice(questionIndex, 1);
        localStorage.setItem('pendingQuestions', JSON.stringify(this.pendingQuestions));

        // Reload the pending questions view
        this.loadPendingQuestions();

        // Show success message
        alert('Question approved and added to the database!');
    }

    denyQuestion(questionId) {
        const questionIndex = this.pendingQuestions.findIndex(q => q.id === questionId);
        if (questionIndex === -1) return;

        // Remove from pending questions
        this.pendingQuestions.splice(questionIndex, 1);
        localStorage.setItem('pendingQuestions', JSON.stringify(this.pendingQuestions));

        // Reload the pending questions view
        this.loadPendingQuestions();

        // Show message
        alert('Question denied and removed from pending list.');
    }

    // Utility function for showing feedback
    showFeedback(elementId, message, type) {
        const feedbackElement = document.getElementById(elementId);
        feedbackElement.textContent = message;
        feedbackElement.className = `feedback ${type === 'error' ? 'incorrect' : 'correct'}`;
        feedbackElement.style.display = 'block';

        // Hide feedback after 5 seconds
        setTimeout(() => {
            feedbackElement.style.display = 'none';
        }, 5000);
    }
}

// Initialize tab manager when DOM is loaded
let tabManager;
document.addEventListener('DOMContentLoaded', () => {
    tabManager = new TabManager();
});
