package com.projetosoft.mapasaude;
/*
Classe responsável por iniciar a aplicação Spring Boot. Ela contém o método main, que é o ponto de entrada da aplicação.
Ao executar, o servidor Spring Boot é iniciado na porta: 8081
*/
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Main {
    public static void main(String[] args) {
        System.out.println("Servidor iniciado na porta 8081");
        SpringApplication.run(Main.class, args);
    }
}