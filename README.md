### Mks code challenge

Esse é uma aplicação nestjs que contêm um CRUD de um catálogo de filmes,
os endpoints estão protegidos por autenticação baseada em token de acesso jwt. Para saber mais, inicie o projeto e acesse o endpoint /api que contêm uma documentação feita utilizando swagger.

## Tecnologias utilizadas
 - Nestjs
 - Docker
 - Postgres
 - Typeorm
 - Aws ec2

## Iniciando o projeto.

Para iniciar, clone este repositório
```sh
git clone https://github.com/Wesley-Arizio/mks_code_challenge.git
```

Navegue até o diretório, e instale as dependências
```shell
npm ci
```

Crie um arquivo .env com base no arquivo .env.example e preencha as variáveis com valores válidos.

Inicie o banco de dados utilizando docker, basta rodar o seguinte comando:

```sh
docker compose up -d
```

Para rodar o projeto

```sh
# desenvolvimento
$ npm run start
# ou
$ npm run start:dev

# produção
$ npm run start:prod
```

## Deploy

Deploy foi feito utilizando docker em uma máquina virtual da AWS utilizando ec2.
acesse o [app aqui](http://15.228.48.158:8080/api).