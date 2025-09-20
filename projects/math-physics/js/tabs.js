// Tab and form management system
class TabManager {
    constructor() {
        this.currentTab = 'practice';
        this.isAuthenticated = false;
        this.pendingQuestions = JSON.parse(localStorage.getItem('pendingQuestions') || '[]');
        this.selectedTags = [];
        this.availableTags = [];
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.setupAddQuestionForm();
        this.setupAuthForm();
        this.setupTagSelector();
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
        const questionType = document.getElementById('question-type');
        const shortAnswerGroup = document.getElementById('short-answer-group');
        const multipleChoiceGroup = document.getElementById('multiple-choice-group');

        // Toggle between question types
        questionType.addEventListener('change', (e) => {
            if (e.target.value === 'short-answer') {
                shortAnswerGroup.style.display = 'block';
                multipleChoiceGroup.style.display = 'none';
            } else {
                shortAnswerGroup.style.display = 'none';
                multipleChoiceGroup.style.display = 'block';
            }
        });

        // Update topics when subject changes
        subjectSelect.addEventListener('change', () => {
            this.updateTopicOptions(subjectSelect.value);
        });

        // Update tags when topic changes
        topicSelect.addEventListener('change', () => {
            const subject = subjectSelect.value;
            const topic = topicSelect.value;
            this.updateAvailableTags(subject, topic);
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

        // Update available tags based on subject
        this.updateAvailableTags(subject);
    }

    // Tag Selector Setup
    setupTagSelector() {
        const searchInput = document.getElementById('tags-search');
        const dropdown = document.getElementById('tags-dropdown');

        // Handle search input
        searchInput.addEventListener('input', (e) => {
            this.filterTags(e.target.value);
        });

        // Handle focus and blur events
        searchInput.addEventListener('focus', () => {
            this.showTagDropdown();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.tags-selector-container')) {
                this.hideTagDropdown();
            }
        });

        // Initialize with empty tags
        this.updateSelectedTagsDisplay();
    }

    updateAvailableTags(subject, topic = null) {
        this.availableTags = [];
        
        if (window.problemBank && window.problemBank.availableTags && subject) {
            if (topic && window.problemBank.availableTags[subject][topic]) {
                // Get tags for specific topic
                this.availableTags = [...window.problemBank.availableTags[subject][topic]];
            } else if (window.problemBank.availableTags[subject]) {
                // Get all tags for the subject
                Object.values(window.problemBank.availableTags[subject]).forEach(topicTags => {
                    this.availableTags = this.availableTags.concat(topicTags);
                });
                // Remove duplicates
                this.availableTags = [...new Set(this.availableTags)];
            }
        }

        // Sort tags alphabetically
        this.availableTags.sort();
        this.filterTags('');
    }

    filterTags(searchTerm) {
        const dropdown = document.getElementById('tags-dropdown');
        const filteredTags = this.availableTags.filter(tag => 
            tag.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !this.selectedTags.includes(tag)
        );

        dropdown.innerHTML = '';

        if (filteredTags.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'tag-option';
            noResults.textContent = searchTerm ? 'No matching tags found' : 'No tags available';
            noResults.style.fontStyle = 'italic';
            noResults.style.color = '#6c757d';
            dropdown.appendChild(noResults);
        } else {
            filteredTags.forEach(tag => {
                const option = document.createElement('div');
                option.className = 'tag-option';
                option.textContent = tag;
                option.addEventListener('click', () => this.selectTag(tag));
                dropdown.appendChild(option);
            });
        }
    }

    selectTag(tag) {
        if (!this.selectedTags.includes(tag)) {
            this.selectedTags.push(tag);
            this.updateSelectedTagsDisplay();
            this.filterTags(document.getElementById('tags-search').value);
            document.getElementById('tags-search').value = '';
        }
    }

    removeTag(tag) {
        this.selectedTags = this.selectedTags.filter(t => t !== tag);
        this.updateSelectedTagsDisplay();
        this.filterTags(document.getElementById('tags-search').value);
    }

    updateSelectedTagsDisplay() {
        const container = document.getElementById('selected-tags');
        container.innerHTML = '';

        if (this.selectedTags.length === 0) {
            const message = document.createElement('div');
            message.className = 'no-tags-message';
            message.textContent = 'No tags selected. Search and click to add tags.';
            container.appendChild(message);
        } else {
            this.selectedTags.forEach(tag => {
                const tagElement = document.createElement('div');
                tagElement.className = 'selected-tag';
                tagElement.innerHTML = `
                    <span>${tag}</span>
                    <span class="remove-tag" onclick="tabManager.removeTag('${tag}')">&times;</span>
                `;
                container.appendChild(tagElement);
            });
        }
    }

    showTagDropdown() {
        document.getElementById('tags-dropdown').classList.remove('hidden');
    }

    hideTagDropdown() {
        document.getElementById('tags-dropdown').classList.add('hidden');
    }

    submitQuestion() {
        const questionType = document.getElementById('question-type').value;
        const questionData = {
            id: 'pending_' + Date.now(),
            subject: document.getElementById('subject-select').value,
            topic: document.getElementById('topic-select').value,
            question: document.getElementById('question-input').value,
            solution: document.getElementById('solution-input').value,
            tags: [...this.selectedTags],
            difficulty: parseInt(document.getElementById('difficulty-input').value),
            type: questionType,
            status: 'pending',
            submittedAt: new Date().toISOString()
        };

        // Handle different question types
        if (questionType === 'short-answer') {
            const answer = document.getElementById('answer-input-form').value.trim();
            if (!answer) {
                this.showFeedback('submission-feedback', 'Please enter an answer.', 'error');
                return;
            }
            questionData.answer = answer;
        } else { // Multiple choice
            const correctAnswer = document.querySelector('input[name="correct-answer"]:checked');
            const answerInputs = document.querySelectorAll('.mc-answer');
            let hasEmptyFields = false;
            
            // Check for empty answer choices
            answerInputs.forEach(input => {
                if (!input.value.trim()) hasEmptyFields = true;
            });
            
            if (hasEmptyFields) {
                this.showFeedback('submission-feedback', 'Please fill in all answer choices.', 'error');
                return;
            }
            
            if (!correctAnswer) {
                this.showFeedback('submission-feedback', 'Please select the correct answer.', 'error');
                return;
            }
            
            // Add multiple choice answers
            answerInputs.forEach((input, index) => {
                const answerNum = index + 1;
                questionData[`answer${answerNum}`] = input.value.trim();
                
                // Mark the correct answer
                if (answerNum === parseInt(correctAnswer.value)) {
                    questionData.correct = `answer${answerNum}`;
                }
            });
        }

        // Validate required fields
        if (!questionData.subject || !questionData.topic || !questionData.question || 
            !questionData.solution || !questionData.difficulty) {
            this.showFeedback('submission-feedback', 'Please fill in all required fields.', 'error');
            return;
        }

        if (formData.difficulty < 1 || formData.difficulty > 100) {
            this.showFeedback('submission-feedback', 'Difficulty must be between 1 and 100.', 'error');
            return;
        }

        // Add to pending questions
        this.pendingQuestions.push(questionData);
        localStorage.setItem('pendingQuestions', JSON.stringify(this.pendingQuestions));

        // Show success message
        this.showFeedback('submission-feedback', 'Question submitted successfully! It will be reviewed before being added to the database.', 'success');

        // Reset form
        const form = document.getElementById('add-question-form');
        form.reset();
        this.selectedTags = [];
        this.updateSelectedTagsDisplay();
        this.updateTopicOptions('');
        
        // Reset question type to short answer
        document.getElementById('question-type').value = 'short-answer';
        document.getElementById('short-answer-group').style.display = 'block';
        document.getElementById('multiple-choice-group').style.display = 'none';
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
