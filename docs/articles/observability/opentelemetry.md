# OpenTelemetry — анализ и разбор

## Что это

OpenTelemetry (OTel) — это open-source framework и стандарт для сбора, обработки и экспорта телеметрии из программных систем. CNCF-проект (та же организация, что Kubernetes, Prometheus), образовался в 2019 из слияния OpenTracing (LightStep/Ben Sigelman) и OpenCensus (Google).

OTel **не занимается** хранением и визуализацией телеметрии. Это слой между инструментируемым кодом и backend'ами (Prometheus, Jaeger, Grafana, Datadog, Honeycomb, GreptimeDB, ClickHouse и т.д.).

## Зачем

До OTel каждый инструмент хотел свою SDK. Если ты хотел отправлять трейсы в Jaeger, тебе ставили jaeger-client. Если ещё и метрики в Prometheus — prometheus-client. Если логи в Elasticsearch — logstash/logback. Три разные API, три разные конфигурации, три набора депенденсов.

OTel даёт один API для всего. Ты пишешь:
```go
span, _ := tracer.Start(ctx, "process_payment")
span.SetAttributes(attribute.String("payment_id", id))
// ... код ...
span.End()
```
А какой бэкенд под капотом — решается конфигурацией, без изменения кода.

## Из каких частей состоит

| Компонент | Что делает |
|---|---|
| **Specification** | Описания типов данных: Span, LogRecord, Metric, Resource. Правила семантических конвенций (как называть атрибуты) |
| **API** | Интерфейсы для TracerProvider, MeterProvider, LoggerProvider. SDK-free API — можно заинструментировать код, не подключая реализацию |
| **SDK** | Реализации API: SpanProcessor (батчинг, семплирование), MetricReader, LogRecordProcessor, Exporters |
| **Collector** | Отдельный сервис (otel-collector), который получает данные от приложений, трансформирует, фильтрует, и экспортирует в один или несколько бэкендов. **Архитектурно важная штука:** он может быть gateway или agent (sidecar) |
| **Exporters** | OTLP-native, Prometheus, Jaeger, Zipkin, Kafka, stdout, и т.д. |
| **Auto-instrumentation** | Для многих языков — готовые библиотеки, которые автоматически Instrument известные фреймворки (HTTP-клиенты, gRPC, базы данных, message queues). Подключаешь — всё работает |
| **Semantic conventions** | Стандартизированные имена атрибутов: `http.method`, `http.url`, `db.system`, `messaging.system` — чтобы при переезде между бэкендами метрики не ломались |

## Как течёт данные

```
   Приложение A                   Приложение Б
   [OTel SDK]                     [OTel SDK]
       |                              |
       ↓                              ↓
   +--------------------------------------+
   |        OTel Collector                |
   |  (фильтрация, батчинг,              |
   |   множественный экспорт,             |
   |   memory sampling, tail-based        |
   |   sampling)                          |
   +--------------------------------------+
       |              |              |
       ↓              ↓              ↓
   Metrics DB    Traces DB       Logs DB
   (Prometheus)  (Jaeger)      (Elasticsearch)
```

Collector — центральный элемент production-деплоя. Ему можно сказать: «метрики шли в Prometheus, трейсы в Honeycomb, а логи в OpenSearch, но если какой-то трейс медленный (latency > 500ms) — пошли его копию ещё и в debug-store».

## OTel и шкала сырости

OTel — это *инструмент телеметрии*, то есть он про сбор и передачу данных, а не про их формальную организацию. Он не предписывает, должны ли твои данные быть wide events или классическими трёмя столпами. На практике:

- **OTel SDK** генерирует трейсы (spans), метрики (counters, histograms), логи (log records) — то есть классическую трёх-столбовую модель.
- **OTel Collector** может агрегировать, семплировать, трансформировать и перенаправлять данные — то есть принимать «левые» (сырые) сигналы и выдавать «правые» (обработанные) на экспорт.
- **Semantic conventions** поощряют добавлять *к атрибутам спанов* широкий набор полей — что на практике приближает spans к wide events.

OTel не решает концептуальный вопрос «как хранить». Он решает вопрос «как собрать и как доставить». Поэтому он находится на шкале чуть правее системы, но левее бэкендов хранения — это *инструмент телеметрии*, а не модель данных.

## Что важно понимать

1. **OTel — нейтральная труба.** Он не навязывает модель wide events, но он *совместим с ней*. Если писать много атрибутов на span — это уже wide events в OTel-терминологии.
2. **OTel не хранит.** Ему нужен бэкенд. Какой — решает deployer.
3. **OTel Collector — ключевой элемент.** Гибкая pipeline-архитектура. Можно делать routing, filtering, sampling, enrichment прямо в collector, не трогая приложение.
4. **Auto-instrumentation — убийца продуктивности.** Для многих языков и фреймворков OTel цепляется автоматически. Это значит, что observability ставится как dependency, без правки кода бизнес-логики.
5. **OTel не решает (и не ставит задачу) фундаментальных вопросов.** Что такое observability, достаточны ли три столпа, какова оптимальная степень сырости данных — это остаётся за рамками OTel.

## Ссылки

- https://opentelemetry.io/ — официальный сайт
- https://github.com/open-telemetry/opentelemetry-specification — specification
- https://opentelemetry.io/docs/concepts/instrumentation/ — обзор instrumentation
- https://opentelemetry.io/docs/collector/ — collector
- https://opentelemetry.io/docs/specs/semconv/ — semantic conventions
