package com.example;

/**
 * Entry point used to verify that the Maven project compiles and runs.
 *
 * <p>This class intentionally does not start Spring or connect to a database,
 * so it can be used before the application configuration and external services
 * are available.</p>
 */
public final class Main {

    private Main() {
        // Utility class
    }

    public static void main(String[] args) {
        System.out.println("Projeto e Engenharia de Software iniciado com sucesso.");
        System.out.printf("Java: %s%n", System.getProperty("java.version"));
    }
}