// Simplified subject list
const subjects = [
    { id: 'algebra', name: 'Algebra', category: 'math' },
    { id: 'calculus', name: 'Calculus', category: 'math' },
    { id: 'mechanics', name: 'Classical Mechanics', category: 'physics' },
    { id: 'quantum', name: 'Quantum Mechanics', category: 'physics' }
];

// Function to initialize subject buttons
function initSubjectButtons() {
    const subjectButtonsContainer = document.getElementById('subject-buttons');
    if (!subjectButtonsContainer) return;

    subjects.forEach(subject => {
        const button = document.createElement('button');
        button.className = 'subject-btn';
        button.textContent = subject.name;
        button.dataset.subject = subject.category;
        button.dataset.topic = subject.id;
        subjectButtonsContainer.appendChild(button);
    });
}

// Export the subjects for use in other files
window.subjects = subjects;

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initSubjectButtons);
