// =============================================
// 🎓 SISTEMA EDUCONNECT - JAVASCRIPT DEFINITIVO
// =============================================

// Configurações globais
const CONFIG = {
    API_URL: 'http://localhost:8080/api',
    LOADING_DURATION: 3000,
    REQUEST_TIMEOUT: 5000
};

// Estado do sistema
const EstadoSistema = {
    alunos: [],
    professores: [],
    cursos: [],
    turmas: [],
    inicializado: false
};

// Controles de fluxo
const Controles = {
    cadastrandoAluno: false,
    cadastrandoProfessor: false,
    cadastrandoCurso: false,
    criandoTurma: false
};

// =============================================
// 🎇 SISTEMA DE LOADING EXPLOSÃO
// =============================================

class LoadingManager {
    constructor() {
        this.loadingElement = document.getElementById('loading-explosion');
        this.duracao = CONFIG.LOADING_DURATION;
    }

    iniciar() {
        console.log('🎇 Iniciando loading explosão...');
        
        // Ocultar conteúdo principal
        this.ocultarConteudoPrincipal();
        
        // Mostrar loading
        if (this.loadingElement) {
            this.loadingElement.style.display = 'flex';
        }
        
        // Programar fim do loading
        setTimeout(() => this.finalizar(), this.duracao);
    }

    ocultarConteudoPrincipal() {
        const header = document.querySelector('.header');
        const main = document.querySelector('.main');
        
        if (header) header.style.display = 'none';
        if (main) main.style.display = 'none';
    }

    mostrarConteudoPrincipal() {
        const header = document.querySelector('.header');
        const main = document.querySelector('.main');
        
        if (header) header.style.display = '';
        if (main) main.style.display = '';
    }

    finalizar() {
        console.log('✅ Finalizando loading...');
        
        if (this.loadingElement) {
            this.loadingElement.classList.add('fade-out');
            
            setTimeout(() => {
                this.loadingElement.style.display = 'none';
                this.mostrarConteudoPrincipal();
                Sistema.inicializar();
            }, 800);
        } else {
            this.mostrarConteudoPrincipal();
            Sistema.inicializar();
        }
    }
}

// =============================================
// 🎓 SISTEMA PRINCIPAL
// =============================================

class Sistema {
    static inicializar() {
        if (EstadoSistema.inicializado) {
            console.warn('⚠️ Sistema já inicializado');
            return;
        }

        console.log('🎓 Inicializando sistema EduConnect...');
        
        EstadoSistema.inicializado = true;
        
        // Inicializar componentes
        this.inicializarEventListeners();
        this.carregarDados();
        
        Interface.mostrarSecao('dashboard');
        console.log('✅ Sistema inicializado com sucesso!');
    }

    static async carregarDados() {
        console.log('🔄 Carregando dados do sistema...');

        try {
            // Limpar dados antigos
            this.limparDados();

            // Tentar carregar da API
            const sucesso = await APIService.carregarTodosDados();
            
            if (sucesso) {
                console.log('✅ Dados carregados da API');
                Interface.mostrarToast('Sistema conectado!', 'success');
            } else {
                // Fallback para dados locais
                console.log('📁 Usando dados locais');
                DadosLocais.carregarDadosExemplo();
                Interface.mostrarToast('Sistema pronto!', 'success');
            }

        } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
            DadosLocais.carregarDadosExemplo();
            Interface.mostrarToast('Sistema carregado em modo local', 'info');
        } finally {
            Interface.atualizarTodasTabelas();
        }
    }

    static limparDados() {
        EstadoSistema.alunos = [];
        EstadoSistema.professores = [];
        EstadoSistema.cursos = [];
        EstadoSistema.turmas = [];
    }

    static inicializarEventListeners() {
        console.log('🔗 Inicializando event listeners...');
        
        // Navegação
        EventListeners.inicializarNavegacao();
        
        // Formulários
        EventListeners.inicializarFormularios();
        
        // Modais
        EventListeners.inicializarModais();
    }
}

// =============================================
// 🌐 SERVIÇO DE API (SIMPLIFICADO)
// =============================================

class APIService {
    static async carregarTodosDados() {
        try {
            const [alunos, professores, cursos, turmas] = await Promise.all([
                this.fazerRequisicao('/alunos'),
                this.fazerRequisicao('/professores'),
                this.fazerRequisicao('/cursos'),
                this.fazerRequisicao('/turmas')
            ]);

            // Atualizar estado apenas se as requisições forem bem-sucedidas
            if (alunos) EstadoSistema.alunos = alunos;
            if (professores) EstadoSistema.professores = professores;
            if (cursos) EstadoSistema.cursos = cursos;
            if (turmas) EstadoSistema.turmas = turmas;

            return true;
        } catch (error) {
            console.log('🌐 API não disponível, usando dados locais');
            return false;
        }
    }

    static async fazerRequisicao(endpoint) {
        try {
            const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.warn(`⚠️ Falha ao carregar ${endpoint}:`, error.message);
            return null;
        }
    }

    static async cadastrarAluno(dadosAluno) {
        return await this.enviarDados('/alunos', dadosAluno, 'aluno');
    }

    static async cadastrarProfessor(dadosProfessor) {
        return await this.enviarDados('/professores', dadosProfessor, 'professor');
    }

    static async cadastrarCurso(dadosCurso) {
        return await this.enviarDados('/cursos', dadosCurso, 'curso');
    }

    static async criarTurma(dadosTurma) {
        return await this.enviarDados('/turmas', dadosTurma, 'turma');
    }

    static async enviarDados(endpoint, dados, tipo) {
        try {
            const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados)
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`❌ Erro ao cadastrar ${tipo}:`, error);
            
            // Simular sucesso localmente
            return this.simularRespostaLocal(dados, tipo);
        }
    }

    static simularRespostaLocal(dados, tipo) {
        const id = Date.now();
        return { id, ...dados, dataCriacao: new Date().toISOString() };
    }
}

// =============================================
// 💾 DADOS LOCAIS (PRIMÁRIO)
// =============================================

class DadosLocais {
    static carregarDadosExemplo() {
        console.log('💾 Carregando dados locais...');

        // Cursos
        EstadoSistema.cursos = [
            { 
                id: 1, 
                nome: 'Sistemas de Informação', 
                codigo: 'SI001', 
                cargaHoraria: 3600, 
                tipo: 'presencial', 
                sala: 'Sala 101' 
            },
            { 
                id: 2, 
                nome: 'Administração', 
                codigo: 'ADM001', 
                cargaHoraria: 3000, 
                tipo: 'ead', 
                plataforma: 'Plataforma EduConnect' 
            }
        ];

        // Professores
        EstadoSistema.professores = [
            { 
                id: 1, 
                nome: 'João Silva', 
                login: 'joao', 
                senha: '123', 
                especialidade: 'TI', 
                registro: 'REG001' 
            },
            { 
                id: 2, 
                nome: 'Maria Santos', 
                login: 'maria', 
                senha: '123', 
                especialidade: 'Administração', 
                registro: 'REG002' 
            }
        ];

        // Alunos
        EstadoSistema.alunos = [
            { 
                id: 1, 
                nome: 'Pedro Oliveira', 
                login: 'pedro', 
                senha: '123', 
                matricula: 'MAT001', 
                curso: EstadoSistema.cursos[0] 
            },
            { 
                id: 2, 
                nome: 'Ana Costa', 
                login: 'ana', 
                senha: '123', 
                matricula: 'MAT002', 
                curso: EstadoSistema.cursos[1] 
            }
        ];

        // Turmas
        EstadoSistema.turmas = [
            { 
                id: 1, 
                codigo: 'TURMA001', 
                professor: EstadoSistema.professores[0], 
                curso: EstadoSistema.cursos[0], 
                alunos: [EstadoSistema.alunos[0]] 
            }
        ];

        console.log('✅ Dados locais carregados');
    }
}

// =============================================
// 🎨 INTERFACE DO USUÁRIO
// =============================================

class Interface {
    static mostrarSecao(sectionId) {
        console.log(`📁 Mostrando seção: ${sectionId}`);
        
        // Ocultar todas as seções
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Mostrar seção selecionada
        const secaoAtiva = document.getElementById(sectionId);
        if (secaoAtiva) {
            secaoAtiva.classList.add('active');
            this.atualizarSecao(sectionId);
        }

        // Atualizar navegação
        this.atualizarNavegacaoAtiva(sectionId);
    }

    static atualizarSecao(sectionId) {
        switch(sectionId) {
            case 'alunos':
                this.atualizarTabelaAlunos();
                break;
            case 'professores':
                this.atualizarTabelaProfessores();
                break;
            case 'cursos':
                this.atualizarGridCursos();
                break;
            case 'turmas':
                this.atualizarGridTurmas();
                break;
            case 'relatorios':
                this.atualizarRelatorios();
                break;
        }
    }

    static atualizarNavegacaoAtiva(sectionId) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-section') === sectionId) {
                btn.classList.add('active');
            }
        });
    }

    static atualizarDashboard(dados) {
        const elementos = {
            'total-alunos': dados?.totalAlunos || EstadoSistema.alunos.length,
            'total-professores': dados?.totalProfessores || EstadoSistema.professores.length,
            'total-cursos': dados?.totalCursos || EstadoSistema.cursos.length,
            'total-turmas': dados?.totalTurmas || EstadoSistema.turmas.length
        };

        Object.entries(elementos).forEach(([id, valor]) => {
            const elemento = document.getElementById(id);
            if (elemento) elemento.textContent = valor;
        });
    }

    static atualizarTabelaAlunos() {
        const tbody = document.getElementById('alunos-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        EstadoSistema.alunos.forEach(aluno => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${aluno.matricula || 'N/A'}</td>
                <td>${aluno.nome || 'N/A'}</td>
                <td>${aluno.curso?.nome || 'N/A'}</td>
                <td>${aluno.login || 'N/A'}</td>
                <td>
                    <button class="btn-secondary" onclick="Interface.editarAluno(${aluno.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-secondary" onclick="Interface.excluirAluno(${aluno.id})" style="background: var(--danger-color); color: white;">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    static atualizarTabelaProfessores() {
        const tbody = document.getElementById('professores-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        EstadoSistema.professores.forEach(professor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${professor.registro || 'N/A'}</td>
                <td>${professor.nome || 'N/A'}</td>
                <td>${professor.especialidade || 'N/A'}</td>
                <td>${professor.login || 'N/A'}</td>
                <td>
                    <button class="btn-secondary" onclick="Interface.editarProfessor(${professor.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-secondary" onclick="Interface.excluirProfessor(${professor.id})" style="background: var(--danger-color); color: white;">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    static atualizarGridCursos() {
        const grid = document.getElementById('cursos-grid');
        if (!grid) return;

        grid.innerHTML = '';

        EstadoSistema.cursos.forEach(curso => {
            const card = document.createElement('div');
            card.className = 'course-card';
            
            let infoExtra = '';
            if (curso.tipo === 'presencial' && curso.sala) {
                infoExtra = `<div class="info-item"><span class="info-label">Sala:</span> ${curso.sala}</div>`;
            } else if (curso.tipo === 'ead' && curso.plataforma) {
                infoExtra = `<div class="info-item"><span class="info-label">Plataforma:</span> ${curso.plataforma}</div>`;
            }

            card.innerHTML = `
                <h3>${curso.nome || 'Curso sem nome'}</h3>
                <div class="course-info">
                    <div class="info-item">
                        <span class="info-label">Código:</span> ${curso.codigo || 'N/A'}
                    </div>
                    <div class="info-item">
                        <span class="info-label">Carga Horária:</span> ${curso.cargaHoraria || 0}h
                    </div>
                    <div class="info-item">
                        <span class="info-label">Modalidade:</span> ${curso.tipo === 'presencial' ? 'Presencial' : 'EAD'}
                    </div>
                    ${infoExtra}
                </div>
            `;
            grid.appendChild(card);
        });
    }

    static atualizarGridTurmas() {
        const grid = document.getElementById('turmas-grid');
        if (!grid) return;

        grid.innerHTML = '';

        EstadoSistema.turmas.forEach(turma => {
            const card = document.createElement('div');
            card.className = 'turma-card';
            
            card.innerHTML = `
                <h3>Turma ${turma.codigo || 'N/A'}</h3>
                <div class="turma-info">
                    <div class="info-item">
                        <span class="info-label">Professor:</span> ${turma.professor?.nome || 'N/A'}
                    </div>
                    <div class="info-item">
                        <span class="info-label">Curso:</span> ${turma.curso?.nome || 'N/A'}
                    </div>
                    <div class="info-item">
                        <span class="info-label">Alunos:</span> ${turma.alunos?.length || 0}
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    static atualizarRelatorios() {
        this.atualizarRelatorio('relatorio-alunos', EstadoSistema.alunos, aluno => 
            `Aluno: ${aluno.nome} | Matrícula: ${aluno.matricula} | Curso: ${aluno.curso?.nome || 'N/A'}`
        );

        this.atualizarRelatorio('relatorio-professores', EstadoSistema.professores, professor =>
            `Professor: ${professor.nome} | Registro: ${professor.registro} | Especialidade: ${professor.especialidade}`
        );

        this.atualizarRelatorio('relatorio-cursos', EstadoSistema.cursos, curso =>
            `Curso: ${curso.nome} | Código: ${curso.codigo} | Carga: ${curso.cargaHoraria}h`
        );

        this.atualizarRelatorio('relatorio-turmas', EstadoSistema.turmas, turma =>
            `Turma: ${turma.codigo} | Professor: ${turma.professor?.nome} | Curso: ${turma.curso?.nome} | Alunos: ${turma.alunos?.length || 0}`
        );
    }

    static atualizarRelatorio(elementId, dados, formatar) {
        const elemento = document.getElementById(elementId);
        if (!elemento) return;

        elemento.innerHTML = dados.map(item => 
            `<div style="padding: 5px 0; border-bottom: 1px solid #eee;">${formatar(item)}</div>`
        ).join('');
    }

    static atualizarTodasTabelas() {
        this.atualizarDashboard();
        this.atualizarTabelaAlunos();
        this.atualizarTabelaProfessores();
        this.atualizarGridCursos();
        this.atualizarGridTurmas();
        this.atualizarRelatorios();
    }

    // ===== OPERAÇÕES CRUD =====

    static async cadastrarAluno() {
        if (Controles.cadastrandoAluno) {
            this.mostrarToast('Aguarde, cadastro em andamento...', 'warning');
            return;
        }

        Controles.cadastrandoAluno = true;

        try {
            const dados = {
                nome: document.getElementById('aluno-nome').value,
                login: document.getElementById('aluno-login').value,
                senha: document.getElementById('aluno-senha').value,
                matricula: document.getElementById('aluno-matricula').value,
                curso: { id: parseInt(document.getElementById('aluno-curso').value) }
            };

            const resultado = await APIService.cadastrarAluno(dados);
            
            // Adicionar localmente se a API não estiver disponível
            if (resultado && !resultado.id) {
                resultado.id = Date.now();
                EstadoSistema.alunos.push(resultado);
            }

            this.fecharModal('aluno');
            this.atualizarTodasTabelas();
            this.mostrarToast('Aluno cadastrado com sucesso!', 'success');

        } catch (error) {
            console.error('❌ Erro ao cadastrar aluno:', error);
            this.mostrarToast('Erro ao cadastrar aluno', 'error');
        } finally {
            Controles.cadastrandoAluno = false;
        }
    }

    static async cadastrarProfessor() {
        if (Controles.cadastrandoProfessor) {
            this.mostrarToast('Aguarde, cadastro em andamento...', 'warning');
            return;
        }

        Controles.cadastrandoProfessor = true;

        try {
            const dados = {
                nome: document.getElementById('professor-nome').value,
                login: document.getElementById('professor-login').value,
                senha: document.getElementById('professor-senha').value,
                especialidade: document.getElementById('professor-especialidade').value,
                registro: document.getElementById('professor-registro').value
            };

            const resultado = await APIService.cadastrarProfessor(dados);
            
            if (resultado && !resultado.id) {
                resultado.id = Date.now();
                EstadoSistema.professores.push(resultado);
            }

            this.fecharModal('professor');
            this.atualizarTodasTabelas();
            this.mostrarToast('Professor cadastrado com sucesso!', 'success');

        } catch (error) {
            console.error('❌ Erro ao cadastrar professor:', error);
            this.mostrarToast('Erro ao cadastrar professor', 'error');
        } finally {
            Controles.cadastrandoProfessor = false;
        }
    }

    static async cadastrarCurso() {
        if (Controles.cadastrandoCurso) {
            this.mostrarToast('Aguarde, cadastro em andamento...', 'warning');
            return;
        }

        Controles.cadastrandoCurso = true;

        try {
            const tipo = document.querySelector('input[name="curso-tipo"]:checked')?.value || 'presencial';
            const dados = {
                nome: document.getElementById('curso-nome').value,
                codigo: document.getElementById('curso-codigo').value,
                cargaHoraria: parseInt(document.getElementById('curso-carga-horaria').value),
                tipo: tipo
            };

            if (tipo === 'presencial') {
                dados.sala = document.getElementById('curso-sala').value;
            } else {
                dados.plataforma = document.getElementById('curso-plataforma').value;
            }

            const resultado = await APIService.cadastrarCurso(dados);
            
            if (resultado && !resultado.id) {
                resultado.id = Date.now();
                EstadoSistema.cursos.push(resultado);
            }

            this.fecharModal('curso');
            this.atualizarTodasTabelas();
            this.mostrarToast('Curso cadastrado com sucesso!', 'success');

        } catch (error) {
            console.error('❌ Erro ao cadastrar curso:', error);
            this.mostrarToast('Erro ao cadastrar curso', 'error');
        } finally {
            Controles.cadastrandoCurso = false;
        }
    }

    static async criarTurma() {
        if (Controles.criandoTurma) {
            this.mostrarToast('Aguarde, criação em andamento...', 'warning');
            return;
        }

        Controles.criandoTurma = true;

        try {
            const dados = {
                codigo: document.getElementById('turma-codigo').value,
                professor: { id: parseInt(document.getElementById('turma-professor').value) },
                curso: { id: parseInt(document.getElementById('turma-curso').value) }
            };

            const resultado = await APIService.criarTurma(dados);
            
            if (resultado && !resultado.id) {
                resultado.id = Date.now();
                EstadoSistema.turmas.push(resultado);
            }

            this.fecharModal('turma');
            this.atualizarTodasTabelas();
            this.mostrarToast('Turma criada com sucesso!', 'success');

        } catch (error) {
            console.error('❌ Erro ao criar turma:', error);
            this.mostrarToast('Erro ao criar turma', 'error');
        } finally {
            Controles.criandoTurma = false;
        }
    }

    // ===== MODAIS =====

    static abrirModal(tipo) {
        const modal = document.getElementById(`modal-${tipo}`);
        if (modal) {
            modal.style.display = 'block';
            
            if (tipo === 'aluno' || tipo === 'turma') {
                this.popularSelectCursos();
            }
            if (tipo === 'turma') {
                this.popularSelectProfessores();
            }
        }
    }

    static fecharModal(tipo) {
        const modal = document.getElementById(`modal-${tipo}`);
        const form = document.getElementById(`form-${tipo}`);
        
        if (modal) modal.style.display = 'none';
        if (form) form.reset();
    }

    static popularSelectCursos() {
        const selects = [
            document.getElementById('aluno-curso'),
            document.getElementById('turma-curso')
        ];

        selects.forEach(select => {
            if (!select) return;
            
            select.innerHTML = '<option value="">Selecione um curso</option>';
            EstadoSistema.cursos.forEach(curso => {
                const option = document.createElement('option');
                option.value = curso.id;
                option.textContent = curso.nome;
                select.appendChild(option);
            });
        });
    }

    static popularSelectProfessores() {
        const select = document.getElementById('turma-professor');
        if (!select) return;
        
        select.innerHTML = '<option value="">Selecione um professor</option>';
        EstadoSistema.professores.forEach(professor => {
            const option = document.createElement('option');
            option.value = professor.id;
            option.textContent = professor.nome;
            select.appendChild(option);
        });
    }

    // ===== UTILITÁRIOS =====

    static mostrarToast(mensagem, tipo = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) {
            console.log(`📢 ${tipo}: ${mensagem}`);
            return;
        }

        toast.textContent = mensagem;
        toast.className = `toast show ${tipo}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    static editarAluno(id) {
        this.mostrarToast('Funcionalidade de edição em desenvolvimento', 'warning');
    }

    static async excluirAluno(id) {
        if (!confirm('Tem certeza que deseja excluir este aluno?')) return;

        try {
            EstadoSistema.alunos = EstadoSistema.alunos.filter(aluno => aluno.id !== id);
            this.atualizarTabelaAlunos();
            this.mostrarToast('Aluno excluído com sucesso!', 'success');
        } catch (error) {
            console.error('❌ Erro ao excluir aluno:', error);
            this.mostrarToast('Erro ao excluir aluno', 'error');
        }
    }

    static editarProfessor(id) {
        this.mostrarToast('Funcionalidade de edição em desenvolvimento', 'warning');
    }

    static excluirProfessor(id) {
        this.mostrarToast('Funcionalidade de exclusão em desenvolvimento', 'warning');
    }
}

// =============================================
// 🎯 EVENT LISTENERS
// =============================================

class EventListeners {
    static inicializarNavegacao() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.getAttribute('data-section');
                Interface.mostrarSecao(section);
            });
        });
    }

    static inicializarFormularios() {
        // Formulário de aluno
        const formAluno = document.getElementById('form-aluno');
        if (formAluno) {
            formAluno.addEventListener('submit', (e) => {
                e.preventDefault();
                Interface.cadastrarAluno();
            });
        }

        // Formulário de professor
        const formProfessor = document.getElementById('form-professor');
        if (formProfessor) {
            formProfessor.addEventListener('submit', (e) => {
                e.preventDefault();
                Interface.cadastrarProfessor();
            });
        }

        // Formulário de curso
        const formCurso = document.getElementById('form-curso');
        if (formCurso) {
            formCurso.addEventListener('submit', (e) => {
                e.preventDefault();
                Interface.cadastrarCurso();
            });
        }

        // Formulário de turma
        const formTurma = document.getElementById('form-turma');
        if (formTurma) {
            formTurma.addEventListener('submit', (e) => {
                e.preventDefault();
                Interface.criarTurma();
            });
        }
    }

    static inicializarModais() {
        // Fechar modais ao clicar fora
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Fechar modais com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            }
        });
    }
}

// =============================================
// 🚀 INICIALIZAÇÃO DA APLICAÇÃO
// =============================================

// Único ponto de entrada
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 EduConnect - Inicializando...');
    
    // Iniciar loading
    const loadingManager = new LoadingManager();
    loadingManager.iniciar();
});

// Funções globais para HTML
window.openModal = (tipo) => Interface.abrirModal(tipo);
window.closeModal = (tipo) => Interface.fecharModal(tipo);

console.log('✅ JavaScript do EduConnect carregado!');