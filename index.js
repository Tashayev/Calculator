'use strict'
let formula = "";
let displayValue = "0";
let resultUsed = false;

function handleButtonClick(event) {
    const target = event.target;

    if (target.tagName === 'BUTTON') {
        const value = target.value;

        switch (value) {
            case 'AC':
                formula = "";
                displayValue = "0";
                resultUsed = false;
                break;

            case '=':
                try {
                    const result = evaluateExpression(formula);
                    formula += `=${result}`;
                    displayValue = result.toString();
                    resultUsed = true;
                } catch (error) {
                    displayValue = 'Error';
                    resultUsed = false;
                }
                break;

            default:
                updateFormula(value);
                displayValue = updateDisplay(value);
                resultUsed = false;
                break;
        }
        updateScreens();
    }
}

function evaluateExpression(expression) {
    const sanitized = expression.replace(/[^-\d/*+.]/g, '');
    return Function('return (' + sanitized + ')')();
}

function updateDisplay(value) {
    if (resultUsed) {
        // If result was just used, start a new expression
        return /^[1-9]$/.test(value) ? value : '0';
    }

    if (value === '.' && displayValue.includes('.')) {
        return displayValue;
    }

    if (/^[/*+\-]$/.test(value)) {
        // If an operator is clicked, check if the last character is also an operator
        const lastChar = displayValue.slice(-1);
        if (/^[/*+\-]$/.test(lastChar)) {
            // If the last character is an operator, replace it with the new one
            return displayValue.slice(0, -1) + value;
        }
        // If the last character is not an operator, allow the new operator
        return value;
    }

    if (/^[1-9]\d*(\.\d+)?$/.test(value) || (value === '.' && !displayValue.includes('.'))) {
        // If the clicked value is a digit or decimal, replace '0' or add to the existing number
        return displayValue === '0' || displayValue === 'Error' ? value : displayValue + value;
    }

    return displayValue;
}




function updateFormula(value) {
    const lastChar = formula.slice(-1);

    if (resultUsed) {
        formula = value;
    } else {
        if (/^[+*/]$/.test(value) && formula === "") {
            // If the equation is empty and the new value is an operator, don't append it
            return;
        }

        if (/^[/*+\-]$/.test(lastChar) && /^[/*+\-]$/.test(value)) {
            // Don't repeat operators
            return;
        }

        if (lastChar === '0' && value === '0') {
            // If the last character is '0' and the new value is '0', don't append another '0'
            return;
        }

        if (displayValue === '0' && /^[1-9\-]$/.test(value)) {
            // Replace 0 with the new digit or minus sign
            formula = value;
        } else {
            formula += value;
        }
    }
}




function updateScreens() {
    document.getElementById('formula-screen').textContent = formula;
    document.getElementById('display').textContent = displayValue;
}
