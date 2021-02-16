# Maratona Discover

Código relacionado a maratona discover da [Rocketseat](https://www.rocketseat.com.br) comandada pelo [@maykbrito](https://github.com/maykbrito).

## O que é a maratona discover?

Uma maratona de aulas práticas sobre desenvolvimento baseado nos cursos do [discover](https://app.rocketseat.com.br/discover), que é a área gratuita deles, onde você encontra muito conteúdo, vale a pena conferir se você está entrando no mundo da programação (de novo, é grátis, só se cadastrar ou entrar com o github).

## O que é esse projeto?

Ao final da maratona nós havíamos contruído uma aplicação de controle financeiro simples usando HTML, CSS e JavaScript (só client-side, sem banco de dados). Se quiser ver como está o meu é só [clicar aqui](https://samvkn.github.io/maratona-discover/).
A nossa tarefa é expandir a aplicação com features extras para concorrer a 10 bolsas do Ignite, curso focado no aprimoramento de carreira deles.

## O que eu fiz?

Alguns features extras que estou adicionando até o prazo de entrega do projeto final.

### :new_moon_with_face: Darkmode
Um tema escuro extremamente elegante e confortável aos olhos, não é porque é meu filho não, mas eu não consigo mais nem usar o tema claro. :sunglasses:

![Gif tema escuro](./img/darkmode.gif)

### :money_with_wings: Indicador de saldo negativo
O card de total era estático e verde, pra mim isso indica o contrário do que um saldo negativo significa. Então agora temos um vermelhão pra você saber que talvez não deva mais comer aquele sushi caríssimo, ou deve, quem sou eu pra julgar! :man_shrugging:

![Gif indicador de saldo](./img/balance.gif)

### :frowning: Seletor de tipo de transação
Uma mudança de UX, o usuário ter que digitar o sinal de negativo pra despesas era muito contra intuitivo, eu mesmo testando o saldo digitava positivo toda hora, então precisava automatizar isso, 
resolvi isso com um menu com abas que muda o form que o usuário envia, isso gerou várias mudanças de back-end porque a aplicação foi escrita pra rodar com um form só na página, mas no fim ficou melhor IMO.

![Gif seletor de tipo de transação](./img/transactionType.gif)