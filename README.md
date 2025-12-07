# EduConnect - Sistema de Gestão Educacional

## Visão Geral

Sistema de gestão educacional com Backend Java (Spring Boot) e Frontend HTML/CSS/JS.

## Como Executar

### Frontend (Interface)

O frontend foi projetado para funcionar mesmo sem o backend rodando (modo de demonstração com dados locais).

1. Navegue até a pasta `frontend`.
2. Abra o arquivo `index.html` no seu navegador favorito.
3. O sistema carregará com uma tela de inicialização e usará dados de exemplo se o backend não estiver disponível.

### Backend (API)

Para funcionalidade completa e persistência de dados, execute o servidor backend.

**Pré-requisitos:**

- Java JDK 21
- Maven instalado e configurado no PATH

**Passos:**

1. Abra um terminal na pasta `backend`.
2. Execute o comando:
   ```bash
   mvn spring-boot:run
   ```
3. A API estará disponível em `http://localhost:8080/api`.

## Funcionalidades

- Dashboard com estatísticas
- Gestão de Alunos, Professores, Cursos e Turmas
- Relatórios
- Modo offline/local (sem backend)
