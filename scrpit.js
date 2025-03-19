document.addEventListener('DOMContentLoaded', function() {
    // Setup keyboard events
    setupKeyboardEvents();
    
    // Add entrance animation to main elements
    document.querySelector('header').classList.add('fade-in');
    document.querySelector('.keyboard-learning-container').classList.add('fade-in');
    
    function setupKeyboardEvents() {
        const userInput = document.querySelector('.user-input-field');
        const targetText = document.querySelector('.target-text');
        const feedbackMessage = document.querySelector('.feedback-message');
        const nextButton = document.querySelector('.next-button');
        const progressBar = document.querySelector('.progress-bar');
        const keys = document.querySelectorAll('.key');
        
        let currentLesson = 1;
        const totalLessons = 5;
        
        // Lessons data
        const lessons = [
            { text: "ola", description: "Digite: \"ola\"" },
            { text: "casa", description: "Digite: \"casa\"" },
            { text: "teclado", description: "Digite: \"teclado\"" },
            { text: "computador", description: "Digite: \"computador\"" },
            { text: "aprendendo a digitar", description: "Digite: \"aprendendo a digitar\"" }
        ];
        
        // Focus input when clicking anywhere in practice area
        document.querySelector('.practice-area').addEventListener('click', function() {
            userInput.focus();
        });
        
        // Key highlight on keyboard press
        userInput.addEventListener('keydown', function(e) {
            const key = e.key.toLowerCase();
            
            // Find and highlight pressed key
            keys.forEach(keyElement => {
                const dataKey = keyElement.getAttribute('data-key').toLowerCase();
                if (dataKey === key || 
                    (key === ' ' && dataKey === 'space') ||
                    (key === 'enter' && dataKey === 'enter') ||
                    (key === 'shift' && dataKey === 'shift') ||
                    (key === 'backspace' && dataKey === 'backspace')) {
                    keyElement.classList.add('pressed');
                }
            });
        });
        
        userInput.addEventListener('keyup', function(e) {
            const key = e.key.toLowerCase();
            
            // Remove highlight from released key
            keys.forEach(keyElement => {
                const dataKey = keyElement.getAttribute('data-key').toLowerCase();
                if (dataKey === key || 
                    (key === ' ' && dataKey === 'space') ||
                    (key === 'enter' && dataKey === 'enter') ||
                    (key === 'shift' && dataKey === 'shift') ||
                    (key === 'backspace' && dataKey === 'backspace')) {
                    keyElement.classList.remove('pressed');
                }
            });
            
            // Check if input matches target text
            const currentTarget = lessons[currentLesson - 1].text;
            if (userInput.value.toLowerCase() === currentTarget.toLowerCase()) {
                feedbackMessage.textContent = "Muito bem! ";
                feedbackMessage.className = "feedback-message feedback-correct";
                nextButton.disabled = false;
            } else if (currentTarget.toLowerCase().startsWith(userInput.value.toLowerCase())) {
                feedbackMessage.textContent = "Continue digitando...";
                feedbackMessage.className = "feedback-message";
                nextButton.disabled = true;
            } else {
                feedbackMessage.textContent = "Ops! Verifique o que você digitou.";
                feedbackMessage.className = "feedback-message feedback-incorrect";
                nextButton.disabled = true;
            }
        });
        
        // Next button functionality
        nextButton.addEventListener('click', function() {
            if (currentLesson < totalLessons) {
                currentLesson++;
                updateLesson();
                
                // Add a nice visual effect when moving to next lesson
                feedbackMessage.textContent = "Carregando próxima lição...";
                feedbackMessage.className = "feedback-message";
                
                // Animated highlight effect for target text
                targetText.style.transform = "scale(1.05)";
                setTimeout(() => {
                    targetText.style.transform = "";
                }, 400);
            } else {
                // Completed all lessons with celebration effect
                targetText.textContent = "Parabéns! Você completou todas as lições!";
                targetText.style.color = "#4CAF50";
                targetText.style.textShadow = "0 0 10px rgba(76, 175, 80, 0.5)";
                
                userInput.style.display = 'none';
                feedbackMessage.textContent = "Você concluiu o treinamento!";
                feedbackMessage.className = "feedback-message feedback-correct";
                nextButton.disabled = true;
                
                // Update progress bar to 100% when all lessons are completed
                progressBar.style.width = "100%";
                
                // Add celebration effect
                celebrateCompletion(document.querySelector('.keyboard-learning-container'));
            }
        });
        
        // Add function to celebrate completion
        function celebrateCompletion(container) {
            // Create confetti effect
            for (let i = 0; i < 50; i++) {
                createConfetti(container);
            }
        }
        
        function createConfetti(container) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = getRandomColor();
            confetti.style.borderRadius = '50%';
            confetti.style.top = '-10px';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.transform = 'scale(' + (Math.random() * 0.6 + 0.4) + ')';
            confetti.style.zIndex = '1000';
            container.appendChild(confetti);
            
            // Animate confetti
            const animation = confetti.animate([
                { 
                    top: '-10px', 
                    transform: 'scale(' + (Math.random() * 0.6 + 0.4) + ') rotate(0deg)',
                    opacity: 1 
                },
                { 
                    top: container.offsetHeight + 'px', 
                    transform: 'scale(' + (Math.random() * 0.6 + 0.4) + ') rotate(' + (Math.random() * 360) + 'deg)',
                    opacity: 0 
                }
            ], {
                duration: Math.random() * 2000 + 1500,
                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
            });
            
            animation.onfinish = function() {
                confetti.remove();
            };
        }
        
        function getRandomColor() {
            const colors = ['#8EC6E6', '#a5d4ec', '#4CAF50', '#FFC107', '#E91E63', '#9C27B0'];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        function updateLesson() {
            targetText.textContent = lessons[currentLesson - 1].description;
            userInput.value = '';
            userInput.focus();
            feedbackMessage.textContent = '';
            nextButton.disabled = true;
            
            // Update progress bar with better animation
            const progress = (currentLesson - 1) / totalLessons * 100;
            progressBar.style.width = `${progress}%`;
            
            // Highlight keys related to the current lesson
            highlightRelevantKeys(lessons[currentLesson - 1].text);
        }
        
        function highlightRelevantKeys(word) {
            // Reset any previous highlights
            keys.forEach(key => key.classList.remove('highlight'));
            
            // Get unique characters from the word
            const uniqueChars = [...new Set(word.toLowerCase())];
            
            // Highlight keys for each character
            uniqueChars.forEach(char => {
                if (char === ' ') char = 'space';
                
                keys.forEach(keyElement => {
                    const dataKey = keyElement.getAttribute('data-key').toLowerCase();
                    if (dataKey === char) {
                        keyElement.classList.add('highlight');
                    }
                });
            });
            
            // After 3 seconds, remove the highlights
            setTimeout(() => {
                keys.forEach(key => key.classList.remove('highlight'));
            }, 3000);
        }
        
        // Initialize the first lesson
        updateLesson();
        
        // Add a slight animation to the keyboard on start
        const keyboard = document.querySelector('.keyboard');
        keyboard.style.transform = 'translateY(20px)';
        keyboard.style.opacity = '0';
        
        setTimeout(() => {
            keyboard.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            keyboard.style.transform = 'translateY(0)';
            keyboard.style.opacity = '1';
        }, 300);
    }
    
    // Add CSS animations classes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .fade-in {
            animation: fadeIn 0.6s ease-out forwards;
        }
        
        .slide-in {
            animation: slideIn 0.5s ease-out forwards;
        }
    `;
    document.head.appendChild(style);
    
    // Add additional animation classes
    const extraStyles = document.createElement('style');
    extraStyles.textContent = `
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0px); }
        }
        
        @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(142, 198, 230, 0.3); }
            50% { box-shadow: 0 0 20px rgba(142, 198, 230, 0.6); }
            100% { box-shadow: 0 0 5px rgba(142, 198, 230, 0.3); }
        }
    `;
    document.head.appendChild(extraStyles);
});
