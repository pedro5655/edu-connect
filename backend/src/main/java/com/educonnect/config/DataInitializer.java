package com.educonnect.config;

import com.educonnect.model.*;
import com.educonnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CursoRepository cursoRepository;
    
    @Autowired
    private ProfessorRepository professorRepository;
    
    @Autowired
    private AlunoRepository alunoRepository;
    
    @Autowired
    private TurmaRepository turmaRepository;

    @Override
    public void run(String... args) throws Exception {
        // Cursos
        CursoPresencial cursoTI = new CursoPresencial("Sistemas de Informação", "SI001", 3600, "Sala 101");
        CursoEAD cursoADM = new CursoEAD("Administração", "ADM001", 3000, "Plataforma EduConnect");
        cursoRepository.save(cursoTI);
        cursoRepository.save(cursoADM);

        // Professores
        Professor profJoao = new Professor("João Silva", "joao", "123", "TI", "REG001");
        Professor profMaria = new Professor("Maria Santos", "maria", "123", "Administração", "REG002");
        professorRepository.save(profJoao);
        professorRepository.save(profMaria);

        // Alunos
        Aluno aluno1 = new Aluno("Pedro Oliveira", "pedro", "123", "MAT001", cursoTI);
        Aluno aluno2 = new Aluno("Ana Costa", "ana", "123", "MAT002", cursoADM);
        alunoRepository.save(aluno1);
        alunoRepository.save(aluno2);

        // Turmas
        Turma turma1 = new Turma("TURMA001", profJoao, cursoTI);
        turma1.adicionarAluno(aluno1);
        turmaRepository.save(turma1);

        System.out.println("✅ Dados iniciais carregados com sucesso!");
    }
}