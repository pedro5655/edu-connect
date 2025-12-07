package com.educonnect.model;

import jakarta.persistence.*;

@Entity
@Table(name = "alunos")
public class Aluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    private String login;
    private String senha;
    private String matricula;
    
    @ManyToOne
    @JoinColumn(name = "curso_id")
    private Curso curso;
    
    public Aluno() {}
    
    public Aluno(String nome, String login, String senha, String matricula, Curso curso) {
        this.nome = nome;
        this.login = login;
        this.senha = senha;
        this.matricula = matricula;
        this.curso = curso;
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }
    
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    
    public String getMatricula() { return matricula; }
    public void setMatricula(String matricula) { this.matricula = matricula; }
    
    public Curso getCurso() { return curso; }
    public void setCurso(Curso curso) { this.curso = curso; }
    
    public String gerarRelatorio() {
        return String.format("Aluno: %s | Matrícula: %s | Curso: %s", 
                           nome, matricula, curso != null ? curso.getNome() : "N/A");
    }
}