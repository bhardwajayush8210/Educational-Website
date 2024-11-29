
// Data for lessons and games
let lessons = [
    {
        title: "Introduction to Mathematics",
        description: "Learn the basics of arithmetic and algebra.",
        image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        title: "World History",
        description: "Explore the major events that shaped our world.",
        image: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        title: "Biology Fundamentals",
        description: "Discover the wonders of life and living organisms.",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        title: "Introduction to Programming",
        description: "Learn the basics of coding and computational thinking.",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        title: "Art History",
        description: "Explore the evolution of art through the ages.",
        image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        title: "Environmental Science",
        description: "Understand the complexities of our planet's ecosystems.",
        image: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
];

const games = [
    {
        title: "Math Challenge",
        description: "Test your math skills with fun puzzles!",
        image: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        title: "History Quiz",
        description: "How well do you know world history?",
        image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        title: "Science Experiment",
        description: "Conduct virtual experiments and learn!",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        title: "Language Puzzle",
        description: "Improve your vocabulary and language skills.",
        image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        title: "Geography Adventure",
        description: "Explore the world and learn about different cultures.",
        image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        title: "Coding Challenge",
        description: "Solve programming puzzles and improve your coding skills.",
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
];

// Function to create a card element
function createCard(item, type) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden card';
    card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="w-full h-48 object-cover">
        <div class="p-4">
            <h3 class="text-xl font-semibold mb-2">${item.title}</h3>
            <p class="text-gray-600">${item.description}</p>
            <button class="mt-4 bg-${type === 'lesson' ? 'blue' : 'green'}-500 text-white px-4 py-2 rounded-lg hover:bg-${type === 'lesson' ? 'blue' : 'green'}-600 transition-colors duration-300">
                ${type === 'lesson' ? 'Start Learning' : 'Play Now'}
            </button>
        </div>
    `;
    return card;
}

// Function to populate content
function populateContent(contentId, items, type) {
    const container = document.getElementById(contentId);
    container.innerHTML = '';
    items.forEach(item => {
        container.appendChild(createCard(item, type));
    });
}

// Tab switching functionality
const tabs = ['lessons', 'games', 'ai', 'contests', 'arvr'];
tabs.forEach(tab => {
    const button = document.getElementById(`${tab}Tab`);
    button.addEventListener('click', () => {
        tabs.forEach(t => {
            document.getElementById(`${t}Content`).classList.add('hidden');
            document.getElementById(`${t}Tab`).classList.remove('bg-blue-500', 'text-white');
            document.getElementById(`${t}Tab`).classList.add('bg-gray-200', 'text-gray-700');
        });
        document.getElementById(`${tab}Content`).classList.remove('hidden');
        button.classList.remove('bg-gray-200', 'text-gray-700');
        button.classList.add('bg-blue-500', 'text-white');
    });
});

// Populate initial content
populateContent('lessonsContent', lessons, 'lesson');
populateContent('gamesContent', games, 'game');

// AI Chatbot functionality
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendMessage');

// Function to add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${sender}-message`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Predefined responses
const responses = {
    "hi": "Hello! How can I assist you today?",
    "what is ar/vr?": "AR (Augmented Reality) adds digital elements to a live view, while VR (Virtual Reality) immerses you in a completely virtual environment.",
    "tell me about biology": "Biology is the study of living organisms, divided into many specialized fields such as botany, microbiology, and zoology.",
    "how do i sign up?": "You can sign up by clicking the 'Sign Up' button in the authentication modal.",
    "help": "I'm here to help! Please ask your question."
};

// Handle sending message
sendButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        addMessage(message, 'user');
        chatInput.value = '';

        // Check for a response based on the message
        const lowerCaseMessage = message.toLowerCase();
        const response = responses[lowerCaseMessage] || "I'm sorry, I don't have an answer for that.";
        
        // Simulate AI response
        setTimeout(() => {
            addMessage(response, 'ai');
        }, 1000);
    }
});

// Allow sending messages with the Enter key
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});

// File upload functionality (placeholder)
['image', 'audio', 'video'].forEach(type => {
    document.getElementById(`${type}Upload`).addEventListener('click', () => {
        console.log(`Uploading ${type}`);
        // Implement file upload logic here
    });
});

// Teacher dashboard functionality
document.getElementById('uploadLesson').addEventListener('click', () => {
    const title = document.getElementById('lessonTitle').value;
    const description = document.getElementById('lessonDescription').value;
    const imageUrl = document.getElementById('lessonImageUrl').value;

    if (title && description && imageUrl) {
        const newLesson = { title, description, image: imageUrl };
        lessons.push(newLesson);
        populateContent('lessonsContent', lessons, 'lesson');
        
        // Clear input fields
        document.getElementById('lessonTitle').value = '';
        document.getElementById('lessonDescription').value = '';
        document.getElementById('lessonImageUrl').value = '';

        alert('New lesson added successfully!');
    } else {
        alert('Please fill in all fields for the new lesson.');
    }
});

// Function to toggle teacher dashboard visibility
function toggleTeacherDashboard(show) {
    const dashboard = document.getElementById('teacherDashboard');
    const contentTabs = document.getElementById('contentTabs');
    if (show) {
        dashboard.classList.remove('hidden');
        contentTabs.classList.add('hidden');
    } else {
        dashboard.classList.add('hidden');
        contentTabs.classList.remove('hidden');
    }
}

// Export functions for use in auth.js
window.eduQuestApp = {
    toggleTeacherDashboard,
    populateContent
};
