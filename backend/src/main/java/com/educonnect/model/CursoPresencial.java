package com.educonnect.model;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("PRESENCIAL")
public class CursoPresencial extends Curso {
    private String sala;
    
    public CursoPresencial() {}
    
    public CursoPresencial(String nome, String codigo, int cargaHoraria, String sala) {
        super(nome, codigo, cargaHoraria);
        this.sala = sala;
    }
    
    public String getSala() { return sala; }
    public void setSala(String sala) { this.sala = sala; }
    
    @Override
    public String detalharCurso() {
        return super.detalharCurso() + " | Modalidade: Presencial | Sala: " + sala;
    }
}