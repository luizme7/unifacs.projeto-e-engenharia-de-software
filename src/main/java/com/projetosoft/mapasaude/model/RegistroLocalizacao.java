package com.projetosoft.mapasaude.model;

import java.util.Map;

public record RegistroLocalizacao(
    double latitude,
    double longitude,
    Map<String, String> atributos
) {}
