# UpWorker Database

Scripts e documentação do banco de dados PostgreSQL para o sistema UpWorker.

## Principais Recursos
- Script de criação automática de tabelas essenciais
- Suporte a comentários, anexos, logs e notificações
- Integração via Docker Compose

## Como usar

- Ao subir o container do banco (`docker compose up -d`), todas as tabelas são criadas automaticamente
- Scripts SQL disponíveis em `database/scripts/`

## Estrutura
- `init-db.sh` - script de inicialização automática
- `init.upworker.sql` - script SQL completo
- `init.sql` - script inicial

## Tabelas Criadas
- users
- calleds
- comments
- attachments
- logs
- notifications

## Observações
- O volume `db_data` garante persistência dos dados
- O banco é acessado pelo backend via variáveis de ambiente
