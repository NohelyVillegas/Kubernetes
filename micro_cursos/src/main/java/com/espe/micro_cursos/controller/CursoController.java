package com.espe.micro_cursos.controller;
import com.espe.micro_cursos.clients.UsuarioClientRest;
import com.espe.micro_cursos.models.Usuario;
import com.espe.micro_cursos.models.entities.Curso;
import com.espe.micro_cursos.services.CursoService;
import feign.FeignException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cursos")
public class CursoController {
    @Autowired
    private CursoService service;

    @Autowired
    private UsuarioClientRest clientRest;

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Curso curso, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errores = new HashMap<>();
            result.getFieldErrors().forEach(
                    err -> errores.put(err.getField(), err.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errores); // Aquí está el cambio
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(curso));
    }

    @GetMapping
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok().body(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return ResponseEntity.of(service.findById(id));
    }

    @PutMapping("/{id}")

    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Curso curso) {
        return ResponseEntity.ok().body(service.save(curso));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> agregarUsuario(@RequestBody Usuario usuario, @PathVariable Long id) {
        Optional<Usuario> optional;
        try {
            optional = service.addUser(usuario, id);
        } catch (FeignException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("mensaje", "Usuario no encontrado"+ e.getMessage()));

        }
        if (optional.isPresent()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(optional.get());
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("mensaje", "No se pudo agregar el usuario"));
        }
    }

    // CAMBIOSSSS
    @PostMapping("/usuarios")
    public ResponseEntity<?> addUsuarioToSystem(@RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = clientRest.create(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
        } catch (FeignException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Collections.singletonMap("mensaje", "Error al crear el usuario: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{cursoId}/usuarios/{usuarioId}")
    public ResponseEntity<?> removeUsuario(@PathVariable Long cursoId, @PathVariable Long usuarioId) {
        service.removeUsuarioFromCurso(usuarioId, cursoId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{cursoId}/usuarios")
    public ResponseEntity<?> getUsuarios(@PathVariable Long cursoId) {
        return ResponseEntity.ok(service.getUsuariosByCurso(cursoId));
    }


}
