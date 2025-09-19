// Subject categories and topics
const subjects = {
    math: {
        name: 'Mathematics',
        topics: [
            { id: 'algebra', name: 'Algebra' },
            { id: 'calculus', name: 'Calculus' }
        ]
    },
    physics: {
        name: 'Physics',
        topics: [
            { id: 'mechanics', name: 'Classical Mechanics' },
            { id: 'quantum', name: 'Quantum Mechanics' }
        ]
    }
};

// Function to initialize subject buttons
function initSubjectButtons() {
    const mathButtons = document.getElementById('math-buttons');
    const physicsButtons = document.getElementById('physics-buttons');
    
    // Add math subject buttons
    subjects.math.topics.forEach(topic => {
        const button = document.createElement('button');
        button.className = 'subject-btn';
        button.textContent = topic.name;
        button.dataset.subject = 'math';
        button.dataset.topic = topic.id;
        mathButtons.appendChild(button);
    });
    
    // Add physics subject buttons
    subjects.physics.topics.forEach(topic => {
        const button = document.createElement('button');
        button.className = 'subject-btn';
        button.textContent = topic.name;
        button.dataset.subject = 'physics';
        button.dataset.topic = topic.id;
        physicsButtons.appendChild(button);
    });
}

// Export the subjects for use in other files
window.subjects = subjects;

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initSubjectButtons);
