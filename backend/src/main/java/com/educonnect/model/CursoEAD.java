package com.educonnect.model;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("EAD")
public class CursoEAD extends Curso {
    private String plataforma;
    
    public CursoEAD() {}
    
    public CursoEAD(String nome, String codigo, int cargaHoraria, String plataforma) {
        super(nome, codigo, cargaHoraria);
        this.plataforma = plataforma;
    }
    
    public String getPlataforma() { return plataforma; }
    public void setPlataforma(String plataforma) { this.plataforma = plataforma; }
    
    @Override
    public String detalharCurso() {
        return super.detalharCurso() + " | Modalidade: EAD | Plataforma: " + plataforma;
    }
}