package com.projetosoft.mapasaude;
/*
Classe responsável por definir a rota raiz ("/") da aplicação.
Quando um cliente acessa a URL raiz, o método home() é chamado, retornando o arquivo index.html.
*/
import org.springframework.core.io.Resource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Route {
    @GetMapping("/")
    public ResponseEntity<Resource> home() {
        Resource html = new ClassPathResource("static/index.html");
        return ResponseEntity.ok()
            .header("Content-Type", "text/html; charset=UTF-8")
            .body(html);
    }
}