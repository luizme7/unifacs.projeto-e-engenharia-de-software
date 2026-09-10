package com.projetosoft.mapasaude.service;


import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.projetosoft.mapasaude.model.RegistroLocalizacao;

import jakarta.annotation.PostConstruct;

@Service
public class CsvService {

    private List<RegistroLocalizacao> cache;


    @PostConstruct
    public void carregarNaInicializacao() throws IOException {
        List<RegistroLocalizacao> registros = new ArrayList<>();

        //permite com que consiga pegar e tratar os dados do arquivo csv, separando os por ';' 

        try (Reader reader = new InputStreamReader(
                new ClassPathResource("Unidades_Basicas_Saude-UBS.csv").getInputStream());
             CSVParser parser = CSVFormat.DEFAULT
                     .builder()
                     .setDelimiter(';')
                     .setHeader()
                     .setSkipHeaderRecord(true)
                     .build()
                     .parse(reader)) {
            // Separa os dados de Latitude e Longitude para melhor uso dentro da aplicação.
            for (CSVRecord record : parser) {
                String latStr = record.get("LATITUDE");
                String lonStr = record.get("LONGITUDE");

            // Faz com que ignore linhas vazias
                 if (latStr == null || latStr.isBlank() || lonStr == null || lonStr.isBlank()) {
                 continue;
                    }
            // Muda o padrão de separação de casa numerica para o formato universal.
                double lat = Double.parseDouble(latStr.replace(",", "."));
                double lon = Double.parseDouble(lonStr.replace(",", "."));

                 Map<String, String> atributos = record.toMap();
                atributos.remove("LATITUDE");
                atributos.remove("LONGITUDE");

                registros.add(new RegistroLocalizacao(lat, lon, atributos));
            }
        }

        this.cache = registros;
    }

    public List<RegistroLocalizacao> obterDados() {
        return cache;
    }
}
