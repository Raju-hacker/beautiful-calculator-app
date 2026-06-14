const display = document.getElementById('display');
let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

// Add sound effect for button press
function playClick() {
    const audio = new Audio('https://freesound.org/data/previews/66/66930_931655-lq.mp3');
    audio.volume = 0.2;
    audio.play().catch(() => {});
}

function updateDisplay() {
    display.textContent = currentInput;
}

function handleNumber(num) {
    playClick();
    if (shouldResetDisplay) {
        currentInput = num;
        shouldResetDisplay = false;
    } else {
        currentInput = currentInput === '0' ? num : currentInput + num;
    }
    updateDisplay();
}

function handleOperator(op) {
    playClick();
    if (operator !== null && !shouldResetDisplay) {
        calculate();
    }
    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
}

function calculate() {
    if (operator === null) return;
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    switch(operator) {
        case '+': result = prev + current; break;
        case '−': result = prev - current; break;
        case '×': result = prev * current; break;
        case '÷': result = current !== 0 ? prev / current : 'Error'; break;
        case '%': result = prev / 100; break;
    }
    
    currentInput = result.toString().length > 12 ? result.toExponential(6) : parseFloat(result.toFixed(8)).toString();
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
}

// Event listeners
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');
        const action = button.getAttribute('data-action');
        
        if (value !== null) {
            handleNumber(value);
        } else if (action) {
            switch(action) {
                case 'clear':
                    currentInput = '0';
                    previousInput = '';
                    operator = null;
                    updateDisplay();
                    break;
                case 'delete':
                    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
                    updateDisplay();
                    break;
                case 'equals':
                    calculate();
                    break;
                case 'percent':
                    handleOperator('%');
                    break;
                case 'add':
                case 'subtract':
                case 'multiply':
                case 'divide':
                    handleOperator(action === 'add' ? '+' : 
                                  action === 'subtract' ? '−' : 
                                  action === 'multiply' ? '×' : '÷');
                    break;
            }
        }
    });
});

// Keyboard support
document.addEventListener('keydown', e => {
    if (e.key >= '0' && e.key <= '9') handleNumber(e.key);
    if (e.key === '.') handleNumber('.');
    if (e.key === '+') handleOperator('+');
    if (e.key === '-') handleOperator('−');
    if (e.key === '*') handleOperator('×');
    if (e.key === '/') handleOperator('÷');
    if (e.key === 'Enter' || e.key === '=') calculate();
    if (e.key === 'Backspace') {
        currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
        updateDisplay();
    }
    if (e.key.toLowerCase() === 'c') {
        currentInput = '0';
        previousInput = '';
        operator = null;
        updateDisplay();
    }
});

// Initial display
updateDisplay();