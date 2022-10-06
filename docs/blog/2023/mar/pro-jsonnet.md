# Про jsonnet

[САБЖ](https://jsonnet.org/)

Пропустим всю техническую часть и перейдем сразу к лирике. Про то, как пользоваться jsonnet написано на [главной странице](https://jsonnet.org/) и более подробно в [туториале](https://jsonnet.org/learning/tutorial.html).

![](https://imgs.xkcd.com/comics/standards.png)

Теперь к вопросу зачем, а главное, для чего. jsonnet это расширение json, соответственно, как минимум может использоваться везде, где требуется json. На самом деле можно конвертировать json обьекты в любой формат, например [yaml](https://jsonnet.org/ref/stdlib.html#manifestYamlDoc), [yaml stream](https://jsonnet.org/ref/stdlib.html#manifestYamlStream), [ini](https://jsonnet.org/ref/stdlib.html#manifestIni), [toml](https://jsonnet.org/ref/stdlib.html#manifestTomlEx), [python](https://jsonnet.org/ref/stdlib.html#manifestPython), [xml](https://jsonnet.org/ref/stdlib.html#manifestXmlJsonml) и при желании можно добавить любые другие форматы. Лично я добавлял парой функций простенькую поддержку hcl и dotenv:
```jsonnet title="common.jsonnet"
local items(obj) = std.map(
    function(x) [x, obj[x]],
    std.objectFields(obj)
);

local dotenv(env) = std.join("\n", ["%(name)s=%(value)s" % {
    name: kv[0],
    value: kv[1],
} for kv in items(env)]);

local hcl(o) = std.join("\n\n", [
  "%(header)s {\n%(body)s\n}" % {
    header: std.join(" ", b.headers),
    body: std.join("\n", [
      "    %(k)s %(v)s" % {
        k: k,
        v: std.join(" ", b.body[k]),
      }
      for k in std.objectFields(b.body)
    ]),
  }
  for b in o
]);

{
    dotenv:: dotenv,
    hcl:: hcl,
}
```

Получаем, что этой штукой можно заменить любое количество любых конфигов любых форматов и любой сложности на один большой сложный jsonnet конфиг и генерить производные конфиги одной командой
```sh
jsonnet --string --multi <dir> <config>.jsonnet
```

Взамен мы получаем один язык конфигурации вместо нескольких, возможность делить конфиг на части, как нам угодно, а не как должны быть файлы или ссылки с названиями внутри файлов, и, что не маловажно, переиспользование значений и шаблонизация конфигов. Теперь не нужно брать dns адрес и записывать в .env сервисов, конфиг http сервера и в конфиг dns сервера одну и ту же строчку, а потом вспоминать где она лежит и где ее надо поменять, если вдруг что. Вместо этого просто создаем переменную и переиспользуем.

Чуть подробнее про юзкейсы (из моей практики или потенциально возможные)

## Генерация svg
Раз есть енкодер в xml, прямо в документации показывают, как можно генерить svg. Мне сразу пришла идея написать функций оберток для svg примитивов и порисовать ими что-нибудь. Получилось вот [это](https://github.com/rprtr258/jsonnet-svg). Чтобы посмотреть результат, достаточно выполнить команду выше и смотреть сгенерированные svg-шки.

## Генерация html
Аналогично, можно генерировать html, используя семантику обьектов, списков и тд, а не текстовой подстановкой, типо jinja или go templates.

## Генерация yaml файлов для кубера
Ходят слухи, что это одна из ходовых причин использовать jsonnet, но мне не попадалось.

Отдельно здесь упомяну, как проблему огромных и сложных yaml конфигов решают в мире кубернетеса. Их решают такими способами, что лучше бы не решали:

- [helm](https://helm.sh/docs/chart_template_guide/getting_started/): текстовые подстановки через go templates
- [kustomize](https://kubectl.docs.kubernetes.io/references/kustomize/builtins/): отдельные yaml конфиги с патчами значений

Плюс, есть [обсуждения](https://noyaml.com/), что yaml конфиги в принципе [ужасная вещь](https://ruudvanasseldonk.com/2023/01/11/the-yaml-document-from-hell), а их темплейтинг все только усугубляет.

Jsonnet предлагает альтернативное решение с темплейтингом структуры обьектов, а не текстовых подстановок. И конфиг генерируется полностью, а не через наборы диффов и трансформеров предыдущих конфигов.

## Генерация инфры
Для себя я генерирую:

- Caddyfile
- docker-compose.yml
- .env
- конфиг dns сервера
- конфиг для loki
- конфиг для prometheus

В разной степени эти конфиги используют общие значения или темплейтятся. Плюс, оказывается, что некоторые фичи "темплейтинга" оказываются ненужными, такие как подстановка значений окружения в `docker-compose.yml`, ведь мы можем подставить их напрямую! Или включение логгинг драйвера для всех контейнеров в том же `docker-compose.yml`. Его можно включить отдельным конфигом в специальном файле на хосте с докером, а можно внутри `docker-compose.yml` для всех сервисов добавить драйвер:
```jsonnet title="vps.jsonnet"
local services = {
  [service]: raw_services[service] + {
    restart: "unless-stopped",
    logging: {
      driver: "loki",
      options: {
        "loki-url": "http://%(loki_host)s:3100/loki/api/v1/push" % {
          loki_host: common.servers.vps,
        },
      }
    }
  }
  for service in std.objectFields(raw_services)
};
local docker_compose = {
  version: "3.8",
  services: services,
  volumes: {
    "caddy_data": {
      external: true
    },
    "caddy_config": null,
    "grafana-storage": null,
  },
};

{
    "docker-compose.yml": std.manifestYamlDoc(docker_compose),
}
```

Так, нам не нужны костыли для циклов или референсов внутри формата конфига, все это прекрасно делается внутри jsonnet.

## Менеджмент множеством .env
Иногда приходится работать с микросервисами, которые конфигурируются из [переменных окружения](https://12factor.net/config) и большинство значений в .env файлах для них совпадает, типо данных для подключения к бд, реббиту, редису, джаггеру и тд. Плюс микросервисы могут обращаться друг к другу и нужно аккуратно ставить одинаковые неповторяющиеся между сервисами порты, на которых сервисы должны слушать. Все это можно упростить с помощью вынесения всех .env файлов в один jsonnet конфиг и генерацией через команду выше.

## Генерация terraform
В принципе, ничто не мешает добавить адекватный енкодер hcl и генерировать terraform конфиги, не заморачиваясь с их придумками с [циклами](https://developer.hashicorp.com/terraform/language/expressions/for), ифами, функциями и тд внутри формата hcl.
