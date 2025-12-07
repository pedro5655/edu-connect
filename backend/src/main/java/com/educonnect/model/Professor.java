package com.educonnect.model;

import jakarta.persistence.*;

@Entity
@Table(name = "professores")
public class Professor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    private String login;
    private String senha;
    private String especialidade;
    private String registro;
    
    public Professor() {}
    
    public Professor(String nome, String login, String senha, String especialidade, String registro) {
        this.nome = nome;
        this.login = login;
        this.senha = senha;
        this.especialidade = especialidade;
        this.registro = registro;
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }
    
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    
    public String getEspecialidade() { return especialidade; }
    public void setEspecialidade(String especialidade) { this.especialidade = especialidade; }
    
    public String getRegistro() { return registro; }
    public void setRegistro(String registro) { this.registro = registro; }
    
    public String gerarRelatorio() {
        return String.format("Professor: %s | Registro: %s | Especialidade: %s", 
                           nome, registro, especialidade);
    }
}