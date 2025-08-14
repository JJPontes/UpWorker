CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE status_called AS ENUM ('Criacao', 'Aprovacao', 'Agendamento', 'Execucao', 'Em Revisao', 'Reprovado');

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(20) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE calleds ADD COLUMN revisado_em TIMESTAMP;
ALTER TABLE calleds ADD COLUMN aprovado_em TIMESTAMP;

CREATE TABLE IF NOT EXISTS gmuds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    called_id UUID NOT NULL REFERENCES calleds(uuid) ON DELETE CASCADE,
    versao INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(30) NOT NULL DEFAULT 'Em Revisao',
    documento TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revisado_em TIMESTAMP,
    aprovado_em TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    called_id UUID NOT NULL REFERENCES calleds(uuid) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comentario TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    called_id UUID NOT NULL REFERENCES calleds(uuid) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nome_arquivo VARCHAR(255) NOT NULL,
    url_arquivo TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    called_id UUID NOT NULL REFERENCES calleds(uuid) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    acao VARCHAR(100) NOT NULL,
    detalhes TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE attachments ADD COLUMN tipo VARCHAR(30);
ALTER TABLE attachments ADD COLUMN tamanho INTEGER;

CREATE OR REPLACE FUNCTION versionar_gmud() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO gmuds (called_id, versao, status, documento, criado_em)
    VALUES (NEW.id, COALESCE((SELECT MAX(versao) FROM gmuds WHERE called_id = NEW.id), 0) + 1, 'Em Revisao', NEW.script, CURRENT_TIMESTAMP);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_versionar_gmud
AFTER UPDATE OF script ON calleds
FOR EACH ROW EXECUTE FUNCTION versionar_gmud();

CREATE OR REPLACE VIEW vw_gmuds_por_chamado AS
SELECT c.uuid AS chamado_id, c.uuid, g.versao, g.status, g.documento, g.criado_em, g.revisado_em, g.aprovado_em
FROM calleds c
JOIN gmuds g ON g.called_id = c.uuid;