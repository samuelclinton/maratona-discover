const Modal = {
    toggle(){
        document.querySelector('.modal-overlay').classList.toggle('active')
    }
}

const Storage = {
    
    get(){
        return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
    },

    set(transactions){
        localStorage.setItem('dev.finances:transactions', JSON.stringify(transactions))
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

        value = Number(value) * 100

        return value
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

    // Seleciona a tabela que vamos inserir os dados mais tarde
    transactionsContainer: document.querySelector('#data-table tbody'),
    
    // Método de criação de tabela
    innerHTMLTransaction(transaction, index){

        // Checa se a quantia é maior que 0 pra determinar se é income ou expense
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        // Criação dos dados da linha da tabela
        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
        </td>
        `

        // Retorna os dados da linha dentro de uma variável
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
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions(){
        this.transactionsContainer.innerHTML = ''
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

App.init()