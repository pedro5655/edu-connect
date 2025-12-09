package com.educonnect.controller;

import com.educonnect.model.*;
import com.educonnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
public class SistemaController {

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private TurmaRepository turmaRepository;

    // ALUNOS
    @GetMapping("/alunos")
    public List<Aluno> listarAlunos() {
        return alunoRepository.findAll();
    }

    @PostMapping("/alunos")
    public ResponseEntity<Aluno> cadastrarAluno(@RequestBody Aluno aluno) {
        if (aluno.getCurso() != null && aluno.getCurso().getId() != null) {
            Optional<Curso> cursoExistente = cursoRepository.findById(aluno.getCurso().getId());
            if (cursoExistente.isPresent()) {
                aluno.setCurso(cursoExistente.get());
            } else {
                return ResponseEntity.badRequest().build();
            }
        }

        Aluno alunoSalvo = alunoRepository.save(aluno);
        return ResponseEntity.ok(alunoSalvo);
    }

    @DeleteMapping("/alunos/{id}")
    public ResponseEntity<Void> excluirAluno(@PathVariable Long id) {
        if (alunoRepository.existsById(id)) {
            alunoRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // PROFESSORES
    @GetMapping("/professores")
    public List<Professor> listarProfessores() {
        return professorRepository.findAll();
    }

    @PostMapping("/professores")
    public Professor cadastrarProfessor(@RequestBody Professor professor) {
        return professorRepository.save(professor);
    }

    @DeleteMapping("/professores/{id}")
    public ResponseEntity<Void> excluirProfessor(@PathVariable Long id) {
        if (professorRepository.existsById(id)) {
            professorRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // CURSOS
    @GetMapping("/cursos")
    public List<Curso> listarCursos() {
        return cursoRepository.findAll();
    }

    @PostMapping("/cursos")
    public Curso cadastrarCurso(@RequestBody Curso curso) {
        return cursoRepository.save(curso);
    }

    @PostMapping("/cursos/presencial")
    public Curso cadastrarCursoPresencial(@RequestBody CursoPresencial curso) {
        return cursoRepository.save(curso);
    }

    @PostMapping("/cursos/ead")
    public Curso cadastrarCursoEAD(@RequestBody CursoEAD curso) {
        return cursoRepository.save(curso);
    }

    @DeleteMapping("/cursos/{id}")
    public ResponseEntity<Void> excluirCurso(@PathVariable Long id) {
        if (cursoRepository.existsById(id)) {
            cursoRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // TURMAS
    @GetMapping("/turmas")
    public List<Turma> listarTurmas() {
        return turmaRepository.findAll();
    }

    @PostMapping("/turmas")
    public ResponseEntity<Turma> criarTurma(@RequestBody Turma turma) {
        if (turma.getProfessor() != null && turma.getProfessor().getId() != null &&
                turma.getCurso() != null && turma.getCurso().getId() != null) {

            Optional<Professor> professor = professorRepository.findById(turma.getProfessor().getId());
            Optional<Curso> curso = cursoRepository.findById(turma.getCurso().getId());

            if (professor.isPresent() && curso.isPresent()) {
                turma.setProfessor(professor.get());
                turma.setCurso(curso.get());
                Turma turmaSalva = turmaRepository.save(turma);
                return ResponseEntity.ok(turmaSalva);
            }
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/turmas/{id}")
    public ResponseEntity<Void> excluirTurma(@PathVariable Long id) {
        if (turmaRepository.existsById(id)) {
            turmaRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // DASHBOARD
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTO> getDashboard() {
        long totalAlunos = alunoRepository.count();
        long totalProfessores = professorRepository.count();
        long totalCursos = cursoRepository.count();
        long totalTurmas = turmaRepository.count();

        DashboardDTO dashboard = new DashboardDTO(totalAlunos, totalProfessores, totalCursos, totalTurmas);
        return ResponseEntity.ok(dashboard);
    }

    public static class DashboardDTO {
        private long totalAlunos;
        private long totalProfessores;
        private long totalCursos;
        private long totalTurmas;

        public DashboardDTO(long totalAlunos, long totalProfessores, long totalCursos, long totalTurmas) {
            this.totalAlunos = totalAlunos;
            this.totalProfessores = totalProfessores;
            this.totalCursos = totalCursos;
            this.totalTurmas = totalTurmas;
        }

        public long getTotalAlunos() {
            return totalAlunos;
        }

        public long getTotalProfessores() {
            return totalProfessores;
        }

        public long getTotalCursos() {
            return totalCursos;
        }

        public long getTotalTurmas() {
            return totalTurmas;
        }
    }
}