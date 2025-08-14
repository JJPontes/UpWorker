
# Esquema do Banco de Dados (PostgreSQL)

O sistema utiliza PostgreSQL para persistência dos dados. Os principais modelos implementados são:

## Tabela: users

- id (serial, PK)
- nome (varchar)
- email (varchar, único)
- senha (varchar, hash)
- perfil (varchar) — valores: 'Analista', 'Executor'
- criado_em (timestamp)

## Tabela: calleds

- id (serial, PK)
- titulo (varchar)
- descricao (text)
- status (enum: 'Criacao', 'Aprovacao', 'Agendamento', 'Execucao', 'Em Revisao', 'Reprovado')
- solicitante (varchar)
- criado_em (timestamp)

## Tabela: comments

- id (serial, PK)
- called_id (int, FK → calleds.id)
- user_id (int, FK → users.id)
- comentario (text)
- criado_em (timestamp)

## Tabela: attachments

- id (serial, PK)
- called_id (int, FK → calleds.id)
- user_id (int, FK → users.id)
- nome_arquivo (varchar)
- url_arquivo (text)
- criado_em (timestamp)

## Tabela: logs

- id (serial, PK)
- called_id (int, FK → calleds.id)
- user_id (int, FK → users.id)
- acao (varchar)
- detalhes (text)
- criado_em (timestamp)

## Tabela: notifications

- id (serial, PK)
- user_id (int, FK → users.id)
- mensagem (text)
- lida (boolean)
- criado_em (timestamp)

## Observações

- O relacionamento entre usuários e chamados é feito via campo `solicitante` (email ou nome do usuário) e pelas FKs das tabelas auxiliares.
- O backend está pronto para integração real com o banco, e as tabelas são criadas automaticamente ao subir o container Docker.