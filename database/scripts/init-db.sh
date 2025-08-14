#!/bin/bash

# Script de inicialização para criar tabelas do UpWorker automaticamente
set -e


psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<EOSQL
-- Criação da extensão para UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE status_called AS ENUM ('Criacao', 'Aprovacao', 'Agendamento', 'Execucao', 'Em Revisao', 'Reprovado');

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(20) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de chamados
CREATE TABLE IF NOT EXISTS calleds (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    titulo VARCHAR(200) NOT NULL,
    tipo_chamado VARCHAR(20) NOT NULL,
    tipo_mudanca VARCHAR(30) NOT NULL,
    ambiente VARCHAR(20),
    executor VARCHAR(100),
    aprovador VARCHAR(100),
    data_execucao TIMESTAMP NOT NULL,
    script TEXT NOT NULL,
    emergencial BOOLEAN DEFAULT FALSE,
    anexo BYTEA,
    anexo_nome VARCHAR(255),
    anexo_tipo VARCHAR(50),
    status status_called NOT NULL DEFAULT 'Criacao',
    solicitante UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revisado_em TIMESTAMP,
    aprovado_em TIMESTAMP
);

-- Tabela de GMUDs para versionamento e histórico
CREATE TABLE IF NOT EXISTS gmuds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    called_id UUID NOT NULL REFERENCES calleds(id) ON DELETE CASCADE,
    versao INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(30) NOT NULL DEFAULT 'Em Revisao',
    documento TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revisado_em TIMESTAMP,
    aprovado_em TIMESTAMP
);

-- Tabela de comentários
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    called_id UUID NOT NULL REFERENCES calleds(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comentario TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de attachments
CREATE TABLE IF NOT EXISTS attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    called_id UUID NOT NULL REFERENCES calleds(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nome_arquivo VARCHAR(255) NOT NULL,
    url_arquivo TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de logs
CREATE TABLE IF NOT EXISTS logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    called_id UUID NOT NULL REFERENCES calleds(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    acao VARCHAR(100) NOT NULL,
    detalhes TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
EOSQL

# Executa o script SQL completo para garantir todas as tabelas/views/triggers
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f /docker-entrypoint-initdb.d/init.upworker.sql
