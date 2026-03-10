# 🌞 Lumina

> Aplicativo de gerenciamento de tarefas acessível, desenvolvido para pessoas com autismo, TDAH e outras condições neurológicas.

---

## 📋 Sobre o Projeto

O **Lumina** é um todo-list no estilo Kanban (inspirado no Trello e Jira) com foco em **acessibilidade cognitiva**. O app foi projetado para reduzir a sobrecarga sensorial e facilitar a organização de tarefas para pessoas neurodivergentes, com recursos como modo foco, timer pomodoro, modos cognitivos personalizados e paleta de cores pastéis.

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| [Angular](https://angular.dev/overview) | 21 | Framework Web
| [TypeScript](https://www.typescriptlang.org/) | 5+ | Tipagem estática
| 
[Node.js](https://nodejs.org/en) | 20.19.5
| GitHub Actions (CI/CD)

## Estrutura de CI/CD Pipeline
O projeto utiliza GitHub Actions para automação de testes, build e deploy:
- **CI**: Executa testes automatizados e valida o build a cada push ou pull request.
- **CD**: Realiza deploy automático para ambientes definidos após aprovação.
- Os arquivos de configuração estão em `.github/workflows/ci.yml` e `.github/workflows/cd.yml`.

## Como Rodar o Projeto Localmente
1. Clone o repositório:
	```bash
	git clone https://github.com/RaulFerreira21/fiap-inclusive-hackathon.git
	```
2. Acesse a pasta do projeto:
	```bash
	cd fiap-inclusive-hackathon/lumina-work
	```
3. Instale as dependências:
	```bash
	npm install
	```
4. Rode o servidor de desenvolvimento:
	```bash
	npm start
	```
5. Acesse `http://localhost:4200` no navegador.

## Estrutura do Projeto
```
lumina-work/
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── domain/
│   │   ├── features/
│   │   └── services/
│   ├── index.html
│   └── main.ts
├── public/
├── angular.json
├── package.json
└── ...
```
## Acessibilidade e Navegação por Teclado
O Lumina foi desenvolvido com foco em acessibilidade para pessoas com TDAH, Autismo e outras condições. É possível navegar por todo o sistema usando apenas o teclado:

- Todos os botões, modais e painéis possuem `tabindex` e `aria-label`.
- Ações podem ser realizadas com Enter ou Espaço.
- Os fluxos principais (onboarding, dashboard, modais, painel de configurações) são totalmente acessíveis.
- Overlay e painéis possuem roles e navegação por teclado.

Essas melhorias garantem uma experiência inclusiva, sem dependência do mouse.

## ♿ Acessibilidade

O Lumina foi desenvolvido com foco em acessibilidade cognitiva:

- **Cores pastéis** — reduzem a sobrecarga sensorial visual
- **Modo foco** — elimina distrações, exibe apenas o necessário
- **Passos guiados** — orienta o usuário em ações dentro do app
- **Alertas visuais** — alternativa a alertas sonoros
- **Tamanho de fonte ajustável** — conforto na leitura
- **Modos cognitivos pré-configurados** — adaptações rápidas para diferentes necessidades

---

## 🗺️ Próximos Passos

- [ ] Tela de Configurações funcional
- [ ] Persistência de dados com AsyncStorage
- [ ] Notificações ao fim do ciclo pomodoro
- [ ] Autenticação de usuário
- [ ] Sincronização na nuvem
- [ ] Modo escuro (Sensibilidade Sensorial)

---

## Contribuição
Pull requests são bem-vindos. Para contribuir, siga as práticas de Git Flow e mantenha a cobertura de testes.

## Contato
Para dúvidas ou sugestões, abra uma issue no repositório.


<p align="center">Feito com 🌞 para tornar a produtividade mais acessível</p>