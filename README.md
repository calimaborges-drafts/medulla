# medulla

Task runner for docker swarm

## Arquivo de configuração

```yml
general:
  - ca: ca.pem
    cert: cert.pem
    host: "192.168.1.10"
    key: key.pem
    port: 2375
    version: v1.25
tasks:
  - name: "ubuntu trial"
    image: "ubuntu"
    cmd: "/bin/bash -c tail -f /var/log/dmesg"
    cron: "* * * * *"

  - name: "hello world trial"
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

## Funcionalidades

- [x] Arquivo de configuração com especificações do "servidor" Docker e tarefas
- [x] Deve ser possível limitar quantidade de tarefas concorrentes no arquivo de configuração
- [x] Tarefa pode ser agendada usando string cron
- [ ] Deve funcionar com o Docker Swarm
- [ ] RESTful API para acompanhar tarefas em execução
- [ ] Dashboard para acompanhar tarefas em execução
- [ ] Deve permitir visualizar três últimas rodadas executadas por tarefa
- [ ] Permitir definir tarefa como única rodada (não permite executar a mesma tarefa ao mesmo tempo)
- [ ] Deve permitir exibir tarefas agendadas com cron string
- [ ] Deve permitir forçar execução de tarefa
- [ ] Deve permitir configurar notificador (slack, email etc)
- [ ] Integração com GitLab para pesquisar arquivo `.medulla.yml` para buscar tarefas a serem agendadas
