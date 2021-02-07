const Modal = {
    toggle(){
        document.querySelector('.modal-overlay').classList.toggle('active')
    }
}

// Tema escuro com persistência, adicionado após o término das aulas para o concurso
const Darkmode = {

    // Método liga-desliga do tema escuro
    toggle(){

        // Se as preferencias de tema escuro no localstorage forem null (vazio) ou off, sete para on e ligue o tema escuro
        if (Storage.getDarkmode() == null || Storage.getDarkmode() == 'off'){
            Storage.setDarkmodeOn()
            document.querySelector('body').classList.add('darkmode')

        }
        // Se as preferencias forem on, sete o darkmode para off e desligue o tema escuro
        else if (Storage.getDarkmode() == 'on') {
            Storage.setDarkmodeOff()
            document.querySelector('body').classList.remove('darkmode')
        }
    },

    // Método que checa se o tema escuro está ligado quando a aplicação se inicia
    check(){

        // Se as preferencias de tema escuro não forem nulas, e estiver on,
        // remova as transições pois elas causam um flash branco no reload e ligue o tema escuro
        if (Storage.getDarkmode() != null && Storage.getDarkmode() == 'on'){

            // Remove as transições
            DOM.removeTransition()

            // Ligue o tema escuro
            document.querySelector('body').classList.add('darkmode')

            // Espere 300ms e adicione as transições de volta
            setTimeout(DOM.addTransition, 300)
        }
    }
}

const Storage = {
    
    get(){
        return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
    },

    set(transactions){
        localStorage.setItem('dev.finances:transactions', JSON.stringify(transactions))
    },

    // Define o tema escuro como ligado no localstorage
    setDarkmodeOn(){
        localStorage.setItem('dev.finances:darkmode', 'on')
    },

    // Define o tema escuro como desligado no localstorage
    setDarkmodeOff(){
        localStorage.setItem('dev.finances:darkmode', 'off')
    },

    // Pega o valor do tema escuro no localstorage
    getDarkmode(){
        return localStorage.getItem('dev.finances:darkmode')
    }
}

const Transaction = {

    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index){
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes(){
        let income = 0

        Transaction.all.forEach(transaction => {
            if(transaction.amount > 0){
                income += transaction.amount
            }
        })

        return income
    },

    expenses(){
        let expense = 0

        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0){
                expense += transaction.amount
            }
        })

        return expense
    },

    total(){
        return Transaction.incomes() + Transaction.expenses()
    }
}

const Utils = {
    
    formatAmount(value){

        value = value * 100

        return Math.round(value)
    },

    formatDate(date){
        const splittedDate = date.split("-")
        
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })

        return signal + value
    }
}

const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),
    
    innerHTMLTransaction(transaction, index){

        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <td class="transition description">${transaction.description}</td>
        <td class="transition ${CSSclass}">${amount}</td>
        <td class="transition date">${transaction.date}</td>
        <td class="transition">
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
        </td>
        `

        return html
    },

    // Método de adicionar a linha dentro do HTML
    addTransaction(transaction, index){

        // Criação da linha da tabela em sí
        const tr = document.createElement('tr')

        // Adicionando os dados que criamos no método innerHTMLTransaction dentro da linha
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)

        tr.dataset.index = index

        // Adicionando a linha dentro da tabela no HTML
        DOM.transactionsContainer.appendChild(tr)
    },

    updateBalance(){
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())

        this.negativeBalance(Utils.formatAmount(Transaction.total()))

        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },
    
    // Método que checa se o saldo é negativo e muda a aparência do card total para indicar
    negativeBalance(total){

        if (total < 0){
            document.querySelector('.card.total').classList.add('negative')
        } else {
            document.querySelector('.card.total').classList.remove('negative')
        }
    },

    clearTransactions(){
        this.transactionsContainer.innerHTML = ''
    },

    // Método que remove as transições, pois quando atualizamos a página com darkmode ligado
    // um flash branco indesejável aparece por alguns ms.
    removeTransition(){

        // Selecione todos os elementos com a classe transition
        const elements = document.querySelectorAll('.transition')

        // Para cada elemento com a classe transition, remova a classe transition e adicione notransition
        elements.forEach(element => {
            element.classList.remove('transition')
            element.classList.add('notransition')
        })
    },

    // Método que adiciona as transições de volta
    addTransition(){

        // Selecione todos os elementos com a classe notransition
        const elements = document.querySelectorAll('.notransition')

        // Para cada elemento com a classe notransition, remova a classe notransition e adicione transition
        elements.forEach(element => {
            element.classList.remove('notransition')
            element.classList.add('transition')
        })
    }
}

const Form = {

    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return {
            description: this.description.value,
            amount: this.amount.value,
            date: this.date.value
        }
    },

    validateFields(){
        const {description, amount, date} = this.getValues()
        
        if(description.trim() === '' || amount.trim() === '' || date.trim() === ''){
            throw new Error('Por favor preencha todos os campos')
        }
    },
    
    formatValues(){
        let {description, amount, date} = this.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields(){
        this.description.value = ''
        this.amount.value = ''
        this.date.value = ''
    },

    submit(event){

        event.preventDefault()

        try {

            this.validateFields()

            const transaction  = this.formatValues()

            Transaction.add(transaction)

            this.clearFields()

            Modal.toggle()

            App.reload()

        } catch (error) {
            alert(error.message)
        }
        
    }
}

const App = {
    init(){

        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload(){
        
        DOM.clearTransactions()

        App.init()
    }
}

Darkmode.check()

App.init()