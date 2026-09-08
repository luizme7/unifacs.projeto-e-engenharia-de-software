package com.projetosoft.mapasaude;
/*
Classe responsável por tratar exceções na aplicação Spring Boot.
Ela utiliza a anotação @RestControllerAdvice para capturar exceções lançadas pelos controladores e fornecer respostas apropriadas.
*/
import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
public class Exception {
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(
            NoResourceFoundException exception) {

        Map<String, Object> response = Map.of(
                "status", 404,
                "error", "Not Found",
                "message", "A rota solicitada não existe.",
                "timestamp", LocalDateTime.now()
        );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }
}
