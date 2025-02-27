package com.espe.micro_cursos.services;

import com.espe.micro_cursos.clients.UsuarioClientRest;
import com.espe.micro_cursos.models.Usuario;
import com.espe.micro_cursos.models.entities.Curso;
import com.espe.micro_cursos.models.entities.CursoUsuario;
import com.espe.micro_cursos.repositories.CursoRepository;
import feign.FeignException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CursoServiceImpl implements CursoService {
    @Autowired
    private CursoRepository repository;

    @Autowired
    private UsuarioClientRest clientRest;

    @Override
    public List<Curso> findAll() {
        return (List<Curso>) repository.findAll();
    }

    @Override
    public Optional<Curso> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public Curso save(Curso curso) {
        return repository.save(curso);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Usuario> addUser(Usuario usuario, Long id) {
        Optional<Curso> optional = repository.findById(id);
        if (optional.isPresent()) {
            try {
                Usuario usuarioTemp = clientRest.findById(usuario.getId());
                Curso curso = optional.get();
                CursoUsuario cursoUsuario = new CursoUsuario();
                cursoUsuario.setUsuarioId(usuarioTemp.getId());
                curso.addCursoUsuario(cursoUsuario);
                repository.save(curso);
                return Optional.of(usuarioTemp);
            } catch (FeignException.NotFound e) {
                throw new RuntimeException("El usuario no existe en el sistema");
            }
        } else {
            throw new RuntimeException("El curso no existe");
        }
    }


    @Override
    public void removeUsuarioFromCurso(Long usuarioId, Long cursoId) {
        Optional<Curso> optionalCurso = repository.findById(cursoId);
        if (optionalCurso.isPresent()) {
            Curso curso = optionalCurso.get();
            curso.getCursoUsuarios().removeIf(cu -> cu.getUsuarioId().equals(usuarioId));
            repository.save(curso);
        }
    }

    @Override
    public List<Usuario> getUsuariosByCurso(Long cursoId) {
        Optional<Curso> optionalCurso = repository.findById(cursoId);
        if (optionalCurso.isPresent()) {
            List<Long> usuarioIds = optionalCurso.get().getCursoUsuarios()
                    .stream()
                    .map(CursoUsuario::getUsuarioId)
                    .toList();
            return usuarioIds.stream()
                    .map(clientRest::findById)
                    .toList();
        }
        return List.of();
    }

}
