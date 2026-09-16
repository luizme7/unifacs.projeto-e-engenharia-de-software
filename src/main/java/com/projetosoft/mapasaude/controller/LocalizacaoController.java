package com.projetosoft.mapasaude.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projetosoft.mapasaude.model.RegistroLocalizacao;
import com.projetosoft.mapasaude.service.CsvService;

@RestController
@RequestMapping("/api/localizacoes")
@CrossOrigin(origins = "*")
public class LocalizacaoController {

    private final CsvService csvService;

    public LocalizacaoController(CsvService csvService) {
        this.csvService = csvService;
    }

    @GetMapping
    public List<RegistroLocalizacao> listar() {
        return csvService.obterDados();
    }
}