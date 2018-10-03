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
