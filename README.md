## Acessibilidade e Navegação por Teclado
O Lumina foi desenvolvido com foco em acessibilidade para pessoas com TDAH, Autismo e outras condições. É possível navegar por todo o sistema usando apenas o teclado:

- Todos os botões, modais e painéis possuem `tabindex` e `aria-label`.
- Ações podem ser realizadas com Enter ou Espaço.
- Os fluxos principais (onboarding, dashboard, modais, painel de configurações) são totalmente acessíveis.
- Overlay e painéis possuem roles e navegação por teclado.

Essas melhorias garantem uma experiência inclusiva, sem dependência do mouse.
# fiap-inclusive-hackathon

## Sobre o Projeto
Lumina é uma aplicação web desenvolvida para o FIAP Inclusive Hackathon, focada em acessibilidade, produtividade e inclusão. O objetivo é facilitar a organização de tarefas, promover o uso de técnicas como Pomodoro e oferecer uma experiência acessível para todos os usuários.

## Tecnologias Utilizadas
- Angular
- TypeScript
- SCSS
- Node.js
- GitHub Actions (CI/CD)

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

## Contribuição
Pull requests são bem-vindos. Para contribuir, siga as práticas de Git Flow e mantenha a cobertura de testes.

## Contato
Para dúvidas ou sugestões, abra uma issue no repositório.
