# medulla

[![Build Status](https://travis-ci.org/calimaborges/medulla.svg?branch=master)](https://travis-ci.org/calimaborges/medulla)

Task runner for docker swarm

## Arquivo de configuração

```yml
general:
  host: "http://10.0.100.157"
  port: 2376
instance:
  maxJobs: 5
tasks:
  - name: "hello-world-trial-1"
    image: "hello-world"
    cron: "* * * * *"
    timeout: 30 # in seconds

  - name: "hello-world-trial-2"
    image: "hello-world"
    cron: "* * * * *"
```

## Interface gráfica

- Deve listar todas as tarefas
- Deve exibir últimas 3 execuções das tarefas (verde em sucesso, vermelho para falha)
- Deve permitir detalhar log das últimas 3 execuções das tarefas
- Deve permitir iniciar tarefa na forçadamente

```
+----------------------------------------------------------------------------------------------+
| ubuntu-trial                                                               OK  ERR OK    RUN |
| hello-world                                                                OK  OK  OK    RUN |
+----------------------------------------------------------------------------------------------+
```

## Referências

- https://blog.alexellis.io/containers-on-swarm/

## Funcionalidades

- **MVP**
  - [x] Arquivo de configuração com especificações do "servidor" Docker e tarefas
  - [x] Deve ser possível limitar quantidade de tarefas concorrentes no arquivo de configuração
  - [x] Tarefa pode ser agendada usando string cron
  - [x] Deve funcionar com o Docker Swarm
  - [x] Tratar execuções com erro
  - [x] Por enquanto armazenar somente 1 resultado por tarefa
  - [ ] RESTful API para acompanhar tarefas em execução
    - [x] Listar tarefas (baseado no `config.yaml`)
    - [x] Criar Factory / Classes ?
    - [x] Tratar erro:
          2018-10-06T16:27:00.045Z error: Task hello-world-trial-1 failed
          2018-10-06T16:27:00.046Z error: Cannot read property 'Status' of undefined
    - [ ] Obter estado atual da tarefa
    - [ ] Testar tarefas que nunca executaram
  - [ ] Dashboard para acompanhar tarefas em execução
    - [ ] Listar todas as tarefas
    - [ ] Exibir log de execução de cada tarefa
- **NEXT**
  - [ ] Testes automatizados
  - [ ] Deve permitir visualizar três últimas rodadas executadas por tarefa
  - [ ] Permitir definir tarefa como única rodada (não permite executar a mesma tarefa ao mesmo tempo)
  - [ ] Deve permitir forçar execução de tarefa
  - [ ] Deve permitir configurar notificador (slack, email etc)
  - [ ] Integração com GitLab para pesquisar arquivo `.medulla.yml` para buscar tarefas a serem agendadas
  - [ ] Implementar Timeout
