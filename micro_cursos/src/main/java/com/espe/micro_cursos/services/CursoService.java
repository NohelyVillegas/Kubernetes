package com.espe.micro_cursos.services;
import com.espe.micro_cursos.models.Usuario;
import com.espe.micro_cursos.models.entities.Curso;

import java.util.List;
import java.util.Optional;

public interface CursoService {
    List<Curso> findAll();
    Optional<Curso> findById(Long id);
    Curso save(Curso curso);
    void deleteById(Long id);
    void removeUsuarioFromCurso(Long usuarioId, Long cursoId);
    Optional<Usuario> addUser(Usuario usuario, Long id);
    List<Usuario> getUsuariosByCurso(Long cursoId);

}


